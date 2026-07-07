package ports

import (
	"uce-trade-ms9/internal/core/domain"
)

// AnalyticsRepository defines how the service interacts with the Data Warehouse
type AnalyticsRepository interface {
	SaveFactSale(sale *domain.FactSale) error
	SaveDimUser(user *domain.DimUser) error
	SaveDimVenture(venture *domain.DimVenture) error

	// Methods for aggregations (period can be "ALL", "MONTHLY", "WEEKLY")
	GetAdminStats(period string) (map[string]interface{}, error)
	GetStudentStats(studentID, period string) (map[string]interface{}, error)
}
