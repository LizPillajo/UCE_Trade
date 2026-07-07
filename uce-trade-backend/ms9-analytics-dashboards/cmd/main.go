package main

import (
	"log"
	"uce-trade-ms9/internal/adapters/repositories/postgres"

	"github.com/gin-gonic/gin"
)

func main() {
	log.Println("Starting MS9 Analytics & Dashboards...")

	// Normally this comes from env vars (e.g., os.Getenv("DATABASE_URL"))
	// For testing, we use a placeholder connection string. 
	// The real string will be configured in docker-compose later.
	dbURL := "postgres://postgres:postgres@localhost:5432/ms9_db?sslmode=disable"
	
	db, err := postgres.Connect(dbURL)
	if err != nil {
		log.Printf("Warning: Failed to connect to DB on startup: %v\n", err)
		log.Println("Continuing without DB for now (Wait for Docker setup in next tasks).")
	} else {
		defer db.Close()

		// Run pure SQL migrations
		if err := db.RunMigrations(); err != nil {
			log.Fatalf("Failed to run migrations: %v", err)
		}
	}

	// Initialize Gin Engine
	r := gin.Default()

	// Health check route
	r.GET("/api/v1/analytics/health", func(c *gin.Context) {
		c.JSON(200, gin.H{"status": "UP", "service": "ms9-analytics-dashboards"})
	})

	// Start the server
	port := "3009" // MS9 typically runs on 3009
	log.Printf("Server listening on port %s", port)
	if err := r.Run(":" + port); err != nil {
		log.Fatalf("Failed to start server: %v", err)
	}
}
