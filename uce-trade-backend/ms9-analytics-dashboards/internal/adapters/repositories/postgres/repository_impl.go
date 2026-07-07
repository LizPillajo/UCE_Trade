package postgres

import (
	"context"

	"uce-trade-ms9/internal/core/domain"
)

// The Database struct already exists in db.go

// SaveFactSale inserts a new sale into the fact table
func (db *Database) SaveFactSale(sale *domain.FactSale) error {
	ctx := context.Background()
	query := `INSERT INTO fact_sales (id, venture_id, student_id, category_name, amount, created_at)
	          VALUES ($1, $2, $3, $4, $5, $6)`
	_, err := db.Pool.Exec(ctx, query, sale.ID, sale.VentureID, sale.StudentID, sale.CategoryName, sale.Amount, sale.CreatedAt)
	return err
}

func (db *Database) SaveDimUser(user *domain.DimUser) error {
	ctx := context.Background()
	query := `INSERT INTO dim_users (id, role, created_at) VALUES ($1, $2, $3)`
	_, err := db.Pool.Exec(ctx, query, user.ID, user.Role, user.CreatedAt)
	return err
}

func (db *Database) SaveDimVenture(venture *domain.DimVenture) error {
	ctx := context.Background()
	query := `INSERT INTO dim_ventures (id, student_id, category_name, status, created_at) VALUES ($1, $2, $3, $4, $5)`
	_, err := db.Pool.Exec(ctx, query, venture.ID, venture.StudentID, venture.CategoryName, venture.Status, venture.CreatedAt)
	return err
}

// GetAdminStats calculates the aggregations for the Admin UI based on period
func (db *Database) GetAdminStats(period string) (map[string]interface{}, error) {
	// Here we will implement complex SQL groupings like:
	// SELECT SUM(amount) FROM fact_sales WHERE created_at > now() - interval...

	// Stub return for now
	return map[string]interface{}{
		"kpi": map[string]interface{}{
			"totalUsers":    0,
			"totalStartups": 0,
			"totalRevenue":  0,
		},
		"growthData": []map[string]interface{}{},
		"pieData":    map[string]interface{}{},
	}, nil
}

// GetStudentStats calculates the aggregations for the Student UI
func (db *Database) GetStudentStats(studentID, period string) (map[string]interface{}, error) {
	// Stub return for now
	return map[string]interface{}{
		"kpi": map[string]interface{}{
			"totalSales":     0,
			"totalRevenue":   0,
			"activeServices": 0,
		},
		"chartSales":    map[string]interface{}{},
		"chartCategory": map[string]interface{}{},
		"topServices":   []map[string]interface{}{},
	}, nil
}
