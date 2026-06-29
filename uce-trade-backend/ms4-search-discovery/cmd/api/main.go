package main

import (
	"fmt"
	"log"
	"os"
	"strings"
	"uce-trade-ms4/internal/adapters/handlers/events"
	"uce-trade-ms4/internal/adapters/handlers/http"
	"uce-trade-ms4/internal/adapters/repositories/elasticsearch"
	"uce-trade-ms4/internal/core/services"

	es8 "github.com/elastic/go-elasticsearch/v7"
	"github.com/gin-gonic/gin"

	swaggerFiles "github.com/swaggo/files"
	ginSwagger "github.com/swaggo/gin-swagger"
	_ "uce-trade-ms4/docs" 
)

// @title MS4 Search & Discovery API
// @version 1.0
// @description Microservice of search and discovery for UCE Trade using Elasticsearch.
// @host localhost:8083
func main() {
	// Configure the Elasticsearch Client
	esURL := os.Getenv("ELASTICSEARCH_URL")
	if esURL == "" {
		esURL = "http://localhost:9200"
	}
	cfg := es8.Config{
		Addresses: []string{esURL},
	}
	esClient, err := es8.NewClient(cfg)
	if err != nil {
		log.Fatalf("Error creating the client: %s", err)
	}

	// Dependency Injection (Hexagonal)
	repo := elasticsearch.NewESRepository(esClient, "ventures")
	searchSvc := services.NewSearchService(repo)
	searchHandler := http.NewSearchHandler(searchSvc)

	// Launch Kafka in the background
	kafkaBrokersEnv := os.Getenv("KAFKA_BROKERS")
	if kafkaBrokersEnv == "" {
		kafkaBrokersEnv = "localhost:9092"
	}
	kafkaBrokers := strings.Split(kafkaBrokersEnv, ",")
	kafkaConsumer := events.NewKafkaConsumer(kafkaBrokers, "venture-created-topic", searchSvc)
	go kafkaConsumer.Start()

	// Router Gin
	router := gin.Default()
	
	// Swagger Endpoint
	router.GET("/swagger/*any", ginSwagger.WrapHandler(swaggerFiles.Handler))

	v1 := router.Group("/api/v1/search")
	{
		v1.GET("/ventures", searchHandler.Search)
		v1.GET("/ventures/my-ventures", searchHandler.GetMyVentures)
		v1.GET("/ventures/featured", searchHandler.GetFeaturedVentures) 
		v1.GET("/ventures/:id", searchHandler.GetVentureById)
	}

	fmt.Println("MS4 Search & Discovery built at Port 8083")
	router.Run(":8083")
}
