package ports

import "uce-trade-ms3/internal/core/domain"

type CatalogService interface {
	GetAllVentures() ([]domain.VentureReadModel, error)
	SyncVenture(venture domain.VentureReadModel) error
}