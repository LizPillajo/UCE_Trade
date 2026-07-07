package services

import (
	"encoding/json"
	"net/http"
	"os"
	"sort"
	"time"

	"github.com/google/uuid"
	"github.com/sirupsen/logrus"
	"uce-trade-ms9/internal/core/domain"
	"uce-trade-ms9/internal/core/ports"
)

type AnalyticsService struct {
	Repo      ports.AnalyticsRepository
	Publisher ports.NotificationPublisher
}

func NewAnalyticsService(repo ports.AnalyticsRepository, pub ports.NotificationPublisher) *AnalyticsService {
	return &AnalyticsService{Repo: repo, Publisher: pub}
}

// ProcessPayment formats the event and stores it in the Data Warehouse
func (s *AnalyticsService) ProcessPayment(payload map[string]interface{}) error {
	// Parse payload safely
	amount, _ := payload["amount"].(float64)
	ventureID, _ := payload["ventureId"].(string)
	buyerID, _ := payload["studentId"].(string)
	
	sellerID := s.Repo.GetVentureSellerID(ventureID)
	categoryName := "General"
	
	// Lazy load missing venture from MS3 (Kafka/RabbitMQ broker mismatch workaround)
	if sellerID == "" {
		logrus.Infof("[Core] Venture %s missing in Data Warehouse. Fetching from MS3...", ventureID)
		sID, cat := fetchVentureFromMS3(ventureID)
		if sID != "" {
			dim := &domain.DimVenture{
				ID:           ventureID,
				StudentID:    sID,
				CategoryName: cat,
				Status:       "ACTIVE",
				CreatedAt:    time.Now(),
			}
			s.Repo.SaveDimVenture(dim)
			sellerID = sID
			categoryName = cat
		}
	}

	// Create FactSale
	fact := &domain.FactSale{
		ID:           uuid.New().String(),
		VentureID:    ventureID,
		StudentID:    buyerID, // fact_sales student_id represents the buyer
		CategoryName: categoryName, 
		Amount:       amount,
		CreatedAt:    time.Now(),
	}

	logrus.Infof("[Core] Saving FactSale: %v", fact.Amount)
	err := s.Repo.SaveFactSale(fact)
	if err == nil && s.Publisher != nil {
		s.Publisher.PublishDashboardRefresh("analytics/admin")
		if buyerID != "" {
			s.Publisher.PublishDashboardRefresh("analytics/student/" + buyerID)
		}
		if sellerID != "" {
			s.Publisher.PublishDashboardRefresh("analytics/student/" + sellerID)
		}
	}
	return err
}

// Helper to fetch venture details from MS3
func fetchVentureFromMS3(ventureID string) (studentID, categoryName string) {
	ms3URL := os.Getenv("CATALOG_URL")
	if ms3URL == "" {
		ms3URL = "http://localhost:8082"
	}
	resp, err := http.Get(ms3URL + "/api/v1/catalog/ventures")
	if err != nil {
		return "", ""
	}
	defer resp.Body.Close()

	var allVentures []map[string]interface{}
	if err := json.NewDecoder(resp.Body).Decode(&allVentures); err != nil {
		return "", ""
	}

	for _, v := range allVentures {
		vid, _ := v["id"].(string)
		if vid == ventureID {
			sID, _ := v["studentId"].(string)
			cat, _ := v["categoryName"].(string)
			if cat == "" {
				cat = "Other"
			}
			return sID, cat
		}
	}
	return "", ""
}

func (s *AnalyticsService) ProcessVenture(payload map[string]interface{}) error {
	id, _ := payload["id"].(string)
	studentID, _ := payload["studentId"].(string)
	category, _ := payload["categoryName"].(string)
	if category == "" {
		category = "Other"
	}

	dim := &domain.DimVenture{
		ID:           id,
		StudentID:    studentID,
		CategoryName: category,
		Status:       "ACTIVE",
		CreatedAt:    time.Now(),
	}

	logrus.Infof("[Core] Saving DimVenture: %v", dim.ID)
	err := s.Repo.SaveDimVenture(dim)
	if err == nil && s.Publisher != nil {
		s.Publisher.PublishDashboardRefresh("analytics/admin")
		if studentID != "" {
			s.Publisher.PublishDashboardRefresh("analytics/student/" + studentID)
		}
	}
	return err
}

func (s *AnalyticsService) ProcessUser(payload map[string]interface{}) error {
	id, _ := payload["id"].(string)
	role, _ := payload["role"].(string)

	dim := &domain.DimUser{
		ID:        id,
		Role:      role,
		CreatedAt: time.Now(),
	}

	logrus.Infof("[Core] Saving DimUser: %v", dim.ID)
	err := s.Repo.SaveDimUser(dim)
	if err == nil && s.Publisher != nil {
		s.Publisher.PublishDashboardRefresh("analytics/admin")
	}
	return err
}

// GetAdminDashboards executes the logic for the Admin UI
func (s *AnalyticsService) GetAdminDashboards(period string) (map[string]interface{}, error) {
	return s.Repo.GetAdminStats(period)
}

// GetStudentDashboards executes the logic for the Student UI
func (s *AnalyticsService) GetStudentDashboards(studentID, period string) (map[string]interface{}, error) {
	stats, err := s.Repo.GetStudentStats(studentID, period)
	if err != nil {
		return nil, err
	}

	// Fetch ventures and ratings from MS3
	ms3URL := os.Getenv("CATALOG_URL")
	if ms3URL == "" {
		ms3URL = "http://localhost:8082" // Fallback for local console execution
	}
	resp, err := http.Get(ms3URL + "/api/v1/catalog/ventures")
	if err != nil {
		logrus.Errorf("Error fetching ventures from MS3: %v", err)
		return stats, nil // Return stats even if MS3 fails
	}
	defer resp.Body.Close()

	var allVentures []map[string]interface{}
	if err := json.NewDecoder(resp.Body).Decode(&allVentures); err != nil {
		logrus.Errorf("Error decoding ventures from MS3: %v", err)
		return stats, nil
	}

	// Filter by studentID and calculate average rating
	var topServices []map[string]interface{}
	var totalRating float64
	var ratingCount int

	for _, v := range allVentures {
		vStudentId, ok := v["studentId"].(string)
		if ok && vStudentId == studentID {
			rating, _ := v["rating"].(float64)
			totalRating += rating
			ratingCount++

			topServices = append(topServices, map[string]interface{}{
				"id":           v["id"],
				"title":        v["title"],
				"categoryName": v["categoryName"],
				"rating":       rating,
				"reviewsCount": v["reviewsCount"],
				"price":        v["price"],
			})
		}
	}

	avgRating := 0.0
	if ratingCount > 0 {
		avgRating = totalRating / float64(ratingCount)
	}

	// Sort topServices by rating descending
	sort.Slice(topServices, func(i, j int) bool {
		r1, _ := topServices[i]["rating"].(float64)
		r2, _ := topServices[j]["rating"].(float64)
		return r1 > r2
	})

	if len(topServices) > 5 {
		topServices = topServices[:5] // Keep top 5
	}

	if kpi, ok := stats["kpi"].(map[string]interface{}); ok {
		kpi["rating"] = avgRating
	}
	stats["topServices"] = topServices

	return stats, nil
}
