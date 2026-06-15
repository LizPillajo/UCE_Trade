package main

import (
	"fmt"
	"log"
	"uce-trade-ms4/internal/adapters/handlers/http"
	"uce-trade-ms4/internal/adapters/repositories/elasticsearch"
	"uce-trade-ms4/internal/core/services"

	es8 "github.com/elastic/go-elasticsearch/v8"
	"github.com/gin-gonic/gin"
)

func main() {
	// 1. Configure the Elasticsearch Client
	cfg := es8.Config{
		Addresses: []string{"http://localhost:9200"}, // Docker ES
	}
	esClient, err := es8.NewClient(cfg)
	if err != nil {
		log.Fatalf("Error creating the client: %s", err)
	}

	// 2. Dependency Injection (Hexagonal)
	repo := elasticsearch.NewESRepository(esClient, "ventures")
	searchSvc := services.NewSearchService(repo)
	searchHandler := http.NewSearchHandler(searchSvc)

	// 3. Router Gin
	router := gin.Default()
	
	v1 := router.Group("/api/v1/search")
	{
		v1.GET("/ventures", searchHandler.Search)
	}

	fmt.Println("MS4 Search & Discovery levantado en el puerto 8083")
	router.Run(":8083")
}