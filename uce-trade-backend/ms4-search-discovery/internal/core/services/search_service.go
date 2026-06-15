package services

import (
	"uce-trade-ms4/internal/core/domain"
	"uce-trade-ms4/internal/core/ports"
)

type searchService struct {
	repo ports.SearchRepository
}

func NewSearchService(repo ports.SearchRepository) ports.SearchService {
	return &searchService{repo: repo}
}

func (s *searchService) Search(query string, category string) ([]domain.Venture, error) {
	return s.repo.SearchVentures(query, category)
}