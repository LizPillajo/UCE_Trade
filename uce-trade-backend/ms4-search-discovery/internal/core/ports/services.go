package ports

import "uce-trade-ms4/internal/core/domain"

type SearchService interface {
	Search(query string, category string) ([]domain.Venture, error)
	IndexVenture(venture domain.Venture) error
}