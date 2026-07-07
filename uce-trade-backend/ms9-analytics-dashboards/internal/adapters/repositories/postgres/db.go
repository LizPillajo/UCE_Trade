package postgres

import (
	"context"
	"fmt"
	
	"github.com/sirupsen/logrus"

	"github.com/jackc/pgx/v5/pgxpool"
)

type Database struct {
	Pool *pgxpool.Pool
}

// Connect initializes the connection pool to PostgreSQL
func Connect(connString string) (*Database, error) {
	ctx := context.Background()
	pool, err := pgxpool.New(ctx, connString)
	if err != nil {
		return nil, fmt.Errorf("unable to connect to database: %v", err)
	}

	// Test connection
	if err := pool.Ping(ctx); err != nil {
		return nil, fmt.Errorf("unable to ping database: %v", err)
	}

	logrus.Info("Connected to PostgreSQL Data Warehouse")
	return &Database{Pool: pool}, nil
}

// Close gracefully closes the connection pool
func (db *Database) Close() {
	if db.Pool != nil {
		db.Pool.Close()
	}
}

// RunMigrations executes raw SQL to create the Star Schema tables for the Data Warehouse
func (db *Database) RunMigrations() error {
	ctx := context.Background()

	// SQL for DimUsers
	dimUsersSQL := `
	CREATE TABLE IF NOT EXISTS dim_users (
		id VARCHAR(255) PRIMARY KEY,
		role VARCHAR(50) NOT NULL,
		created_at TIMESTAMP NOT NULL
	);`

	// SQL for DimVentures
	dimVenturesSQL := `
	CREATE TABLE IF NOT EXISTS dim_ventures (
		id UUID PRIMARY KEY,
		student_id VARCHAR(255) NOT NULL,
		category_name VARCHAR(100) NOT NULL,
		status VARCHAR(50) NOT NULL,
		created_at TIMESTAMP NOT NULL
	);`

	// SQL for FactSales
	factSalesSQL := `
	CREATE TABLE IF NOT EXISTS fact_sales (
		id UUID PRIMARY KEY,
		venture_id UUID NOT NULL,
		student_id VARCHAR(255) NOT NULL,
		category_name VARCHAR(100) NOT NULL,
		amount DECIMAL(10, 2) NOT NULL,
		created_at TIMESTAMP NOT NULL
	);`

	queries := []string{dimUsersSQL, dimVenturesSQL, factSalesSQL}

	for _, query := range queries {
		if _, err := db.Pool.Exec(ctx, query); err != nil {
			return fmt.Errorf("error executing migration: %v", err)
		}
	}

	logrus.Info("Data Warehouse schemas created successfully.")
	return nil
}
