package ports

import "uce-trade-ms4/internal/core/domain"

type SearchRepository interface {
	SearchVentures(query string, category string) ([]domain.Venture, error)
	IndexVenture(venture domain.Venture) error
	GetMyVentures(email string) ([]domain.Venture, error)
	GetVentureById(id string) (*domain.Venture, error)
}