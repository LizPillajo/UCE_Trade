package services

import (
	"uce-trade-ms3/internal/core/domain"
	"uce-trade-ms3/internal/core/ports"
)

type catalogService struct {
	repo ports.CatalogRepository
}

func NewCatalogService(repo ports.CatalogRepository) ports.CatalogService {
	return &catalogService{repo: repo}
}

func (s *catalogService) GetAllVentures() ([]domain.VentureReadModel, error) {
	return s.repo.FindAll()
}

func (s *catalogService) SyncVenture(venture domain.VentureReadModel) error {
	return s.repo.InsertVenture(venture)
}