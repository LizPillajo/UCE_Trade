package services

import (
	"encoding/json"
	"fmt"
	"net/http"
	"time"
	"uce-trade-ms4/internal/core/domain"
	"uce-trade-ms4/internal/core/ports"
)

type searchService struct {
	repo ports.SearchRepository
}

func NewSearchService(repo ports.SearchRepository) ports.SearchService {
	return &searchService{repo: repo}
}

// Helper function to fetch owner details from MS1 (Identity)
func (s *searchService) fetchOwner(studentId string) *domain.Owner {
	if studentId == "" {
		return nil
	}

	url := fmt.Sprintf("http://localhost:8080/api/v1/users/%s", studentId)
	
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
func (s *searchService) populateOwners(ventures []domain.Venture) []domain.Venture {
	for i := range ventures {
		ventures[i].Owner = s.fetchOwner(ventures[i].StudentId)
	}
	return ventures
}

func (s *searchService) Search(query string, category string, page int, size int, sort string) ([]domain.Venture, int, error) {
	ventures, total, err := s.repo.SearchVentures(query, category, page, size, sort)
	if err != nil {
		return nil, 0, err
	}
	
	// Inject owner data before returning
	return s.populateOwners(ventures), total, nil
}

func (s *searchService) IndexVenture(v domain.Venture) error {
	return s.repo.IndexVenture(v)
}

func (s *searchService) GetMyVentures(email string) ([]domain.Venture, error) {
	ventures, err := s.repo.GetMyVentures(email)
	if err != nil {
		return nil, err
	}

	// Inject owner data before returning
	return s.populateOwners(ventures), nil
}

func (s *searchService) GetVentureById(id string) (*domain.Venture, error) {
	venture, err := s.repo.GetVentureById(id)
	if err != nil {
		return nil, err
	}
	
	// Inject owner data before returning
	if venture != nil {
		venture.Owner = s.fetchOwner(venture.StudentId)
	}
	
	return venture, nil
}

func (s *searchService) GetFeaturedVentures() ([]domain.Venture, error) {
    ventures, err := s.repo.GetFeaturedVentures()
    if err != nil {
        return nil, err
    }
    
    return s.populateOwners(ventures), nil
}