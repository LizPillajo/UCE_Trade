package main

import (
	"context"
	"log"
	"os"
	"strings"

	"uce-trade-ms3/internal/adapters/handlers/events"
	httpHandler "uce-trade-ms3/internal/adapters/handlers/http"
	"uce-trade-ms3/internal/adapters/repositories/mongodb"
	"uce-trade-ms3/internal/core/services"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"

	swaggerFiles "github.com/swaggo/files"
	ginSwagger "github.com/swaggo/gin-swagger"
	_ "uce-trade-ms3/docs"
)

func main() {
	// 1. ADAPTERS: MongoDB Configuration
	mongoURI := os.Getenv("MONGO_URI")
	if mongoURI == "" {
		mongoURI = "mongodb://localhost:27017"
	}
	clientOptions := options.Client().ApplyURI(mongoURI)
	mongoClient, err := mongo.Connect(context.TODO(), clientOptions)
	if err != nil {
		log.Fatalf("Critical Error connecting to MongoDB: %v", err)
	}

	// 2. DEPENDENCY INJECTION (Hexagonal Architecture)
	repo := mongodb.NewMongoRepository(mongoClient, "uce_trade_query", "ventures")
	catalogSvc := services.NewCatalogService(repo)
	catalogHandler := httpHandler.NewCatalogHandler(catalogSvc)

	// 3. INPUT ADAPTER: Start Kafka in the background
	kafkaBrokersEnv := os.Getenv("KAFKA_BROKERS")
	if kafkaBrokersEnv == "" {
		kafkaBrokersEnv = "localhost:9092"
	}
	kafkaBrokers := strings.Split(kafkaBrokersEnv, ",")
	kafkaConsumer := events.NewKafkaConsumer(kafkaBrokers, "venture-created-topic", catalogSvc)
	go kafkaConsumer.Start()

	kafkaUpdateConsumer := events.NewKafkaConsumer(kafkaBrokers, "venture-updated-topic", catalogSvc)
	go kafkaUpdateConsumer.Start()

	// 4. INPUT ADAPTER: Router Gin
	router := gin.Default()

	// Swagger Endpoint
	router.GET("/swagger/*any", ginSwagger.WrapHandler(swaggerFiles.Handler))

	v1 := router.Group("/api/v1/catalog")
	{
		v1.GET("/ventures", catalogHandler.GetCatalog)
	}

	log.Println("🚀 MS3 Catalog Query running on port 8082")
	router.Run(":8082")

}
