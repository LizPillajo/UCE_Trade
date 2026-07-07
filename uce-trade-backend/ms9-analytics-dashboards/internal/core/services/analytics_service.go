package services

import (
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
	studentID, _ := payload["studentId"].(string)
	
	// Create FactSale
	fact := &domain.FactSale{
		ID:           uuid.New().String(),
		VentureID:    ventureID,
		StudentID:    studentID,
		CategoryName: "General", // Should ideally be fetched or included in payload
		Amount:       amount,
		CreatedAt:    time.Now(),
	}

	logrus.Infof("[Core] Saving FactSale: %v", fact.Amount)
	err := s.Repo.SaveFactSale(fact)
	if err == nil && s.Publisher != nil {
		s.Publisher.PublishDashboardRefresh("analytics/admin")
		if studentID != "" {
			s.Publisher.PublishDashboardRefresh("analytics/student/" + studentID)
		}
	}
	return err
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
	return s.Repo.GetStudentStats(studentID, period)
}
