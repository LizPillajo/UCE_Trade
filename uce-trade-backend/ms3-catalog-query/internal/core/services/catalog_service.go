package services

import (
	"encoding/json"
	"fmt"
	"net/http"
	"os"
	"time"
	"uce-trade-ms3/internal/core/domain"
	"uce-trade-ms3/internal/core/ports"
)

type catalogService struct {
	repo       ports.CatalogRepository
	ms1BaseURL string 
}

func NewCatalogService(repo ports.CatalogRepository) ports.CatalogService {
	ms1URL := os.Getenv("MS1_BASE_URL")
	if ms1URL == "" {
		ms1URL = "http://localhost:8080" 
	}

	return &catalogService{
		repo:       repo,
		ms1BaseURL: ms1URL,
	}
}

// Helper function to fetch owner details from MS1 (Identity)
func (s *catalogService) fetchOwner(studentId string) *domain.Owner {
	if studentId == "" {
		return nil
	}

	url := fmt.Sprintf("%s/api/v1/users/%s", s.ms1BaseURL, studentId)

	client := &http.Client{Timeout: 5 * time.Second}
	resp, err := client.Get(url)
	if err != nil {
		fmt.Printf("Error fetching owner from MS1: %v\n", err)
		return nil
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		fmt.Printf("MS1 returned status %d for user %s\n", resp.StatusCode, studentId)
		return nil
	}

	var owner domain.Owner
	if err := json.NewDecoder(resp.Body).Decode(&owner); err != nil {
		fmt.Printf("Error decoding owner from MS1: %v\n", err)
		return nil
	}

	return &owner
}

// Helper function to populate owners for a slice of ventures
func (s *catalogService) populateOwners(ventures []domain.VentureReadModel) []domain.VentureReadModel {
	for i := range ventures {
		ventures[i].Owner = s.fetchOwner(ventures[i].StudentId)
	}
	return ventures
}

func (s *catalogService) GetAllVentures() ([]domain.VentureReadModel, error) {
	ventures, err := s.repo.FindAll()
	if err != nil {
		return nil, err
	}

	return s.populateOwners(ventures), nil
}

func (s *catalogService) SyncVenture(venture domain.VentureReadModel) error {
	return s.repo.InsertVenture(venture)
}