package ports

import "uce-trade-ms3/internal/core/domain"

type CatalogRepository interface {
	FindAll() ([]domain.VentureReadModel, error)
	InsertVenture(venture domain.VentureReadModel) error
}