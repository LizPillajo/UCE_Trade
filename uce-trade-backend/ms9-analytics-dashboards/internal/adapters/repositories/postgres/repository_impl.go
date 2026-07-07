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
	ctx := context.Background()

	var totalUsers int
	db.Pool.QueryRow(ctx, `SELECT COUNT(id) FROM dim_users`).Scan(&totalUsers)

	var totalStartups int
	db.Pool.QueryRow(ctx, `SELECT COUNT(id) FROM dim_ventures WHERE status = 'ACTIVE'`).Scan(&totalStartups)

	var totalRevenue float64
	db.Pool.QueryRow(ctx, `SELECT COALESCE(SUM(amount), 0) FROM fact_sales`).Scan(&totalRevenue)

	return map[string]interface{}{
		"kpi": map[string]interface{}{
			"totalUsers":    totalUsers,
			"totalStartups": totalStartups,
			"totalRevenue":  totalRevenue,
		},
		"growthData": []map[string]interface{}{},
		"pieData":    map[string]interface{}{},
	}, nil
}

// GetStudentStats calculates the aggregations for the Student UI
func (db *Database) GetStudentStats(studentID, period string) (map[string]interface{}, error) {
	ctx := context.Background()

	// 1. Calculate KPI
	var totalSales int
	var totalRevenue float64
	queryKpi := `
		SELECT COUNT(f.id), COALESCE(SUM(f.amount), 0)
		FROM fact_sales f
		JOIN dim_ventures v ON f.venture_id = v.id
		WHERE v.student_id = $1
	`
	db.Pool.QueryRow(ctx, queryKpi, studentID).Scan(&totalSales, &totalRevenue)

	// 2. Calculate Active Services
	var activeServices int
	queryActive := `SELECT COUNT(id) FROM dim_ventures WHERE student_id = $1 AND status = 'ACTIVE'`
	db.Pool.QueryRow(ctx, queryActive, studentID).Scan(&activeServices)

	// 3. chartSales (Group by date)
	chartSales := make(map[string]interface{})
	queryChartSales := `
		SELECT to_char(f.created_at, 'DD/MM'), COALESCE(SUM(f.amount), 0)
		FROM fact_sales f
		JOIN dim_ventures v ON f.venture_id = v.id
		WHERE v.student_id = $1
		GROUP BY to_char(f.created_at, 'DD/MM')
	`
	rows, err := db.Pool.Query(ctx, queryChartSales, studentID)
	if err == nil {
		defer rows.Close()
		for rows.Next() {
			var date string
			var amount float64
			if err := rows.Scan(&date, &amount); err == nil {
				chartSales[date] = amount
			}
		}
	}

	// 4. chartCategory (Group by category)
	chartCategory := make(map[string]interface{})
	queryChartCategory := `
		SELECT v.category_name, COALESCE(SUM(f.amount), 0)
		FROM fact_sales f
		JOIN dim_ventures v ON f.venture_id = v.id
		WHERE v.student_id = $1
		GROUP BY v.category_name
	`
	rowsCat, err := db.Pool.Query(ctx, queryChartCategory, studentID)
	if err == nil {
		defer rowsCat.Close()
		for rowsCat.Next() {
			var cat string
			var amount float64
			if err := rowsCat.Scan(&cat, &amount); err == nil {
				chartCategory[cat] = amount
			}
		}
	}

	return map[string]interface{}{
		"kpi": map[string]interface{}{
			"totalSales":     totalSales,
			"totalRevenue":   totalRevenue,
			"activeServices": activeServices,
		},
		"chartSales":    chartSales,
		"chartCategory": chartCategory,
		"topServices":   []map[string]interface{}{},
	}, nil
}

// GetVentureSellerID retrieves the studentID of the seller who owns the venture
func (db *Database) GetVentureSellerID(ventureID string) string {
	ctx := context.Background()
	var sellerID string
	query := `SELECT student_id FROM dim_ventures WHERE id = $1`
	err := db.Pool.QueryRow(ctx, query, ventureID).Scan(&sellerID)
	if err != nil {
		return ""
	}
	return sellerID
}
