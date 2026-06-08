package main

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/segmentio/kafka-go" 
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

// 1. DOMAIN (The read model)
type VentureReadModel struct {
	ID          string  `json:"id" bson:"_id"`
	StudentId   string  `json:"studentId" bson:"student_id"`
	Title       string  `json:"title" bson:"title"`
	Description string  `json:"description" bson:"description"`
	Price       float64 `json:"price" bson:"price"`
	ImageUrl    string  `json:"imageUrl" bson:"image_url"`
	Status      string  `json:"status" bson:"status"`
}

func main() {
	// 2. INFRASTRUCTURE: Connecting to MongoDB
	clientOptions := options.Client().ApplyURI("mongodb://localhost:27017")
	mongoClient, err := mongo.Connect(context.TODO(), clientOptions)
	if err != nil {
		log.Fatal(err)
	}
	collection := mongoClient.Database("uce_trade_query").Collection("ventures")

	// 3. INPUT ADAPTER (Eventos): Kafka Consumer (Segmentio)
	go func() {
		reader := kafka.NewReader(kafka.ReaderConfig{
			Brokers:   []string{"localhost:9092"},
			Topic:     "venture-created-topic",
			Partition: 0,
		})
		defer reader.Close()

		fmt.Println("Consumidor de Kafka escuchando eventos...")
		for {
			msg, err := reader.ReadMessage(context.Background())
			if err != nil {
				log.Printf("Error leyendo mensaje de Kafka: %v", err)
				continue
			}
			
			var venture VentureReadModel
			json.Unmarshal(msg.Value, &venture)
			
			// Save to MongoDB when the event occurs
			_, err = collection.InsertOne(context.TODO(), venture)
			if err == nil {
				fmt.Printf("¡Emprendimiento sincronizado en MongoDB!: %s\n", venture.Title)
			}
		}
	}()

	// 4. INPUT ADAPTER (REST): Query Controller
	router := gin.Default()
	router.GET("/api/v1/catalog/ventures", func(c *gin.Context) {
		var ventures []VentureReadModel
		cursor, err := collection.Find(context.TODO(), bson.D{{}})
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Error fetching data"})
			return
		}
		if err = cursor.All(context.TODO(), &ventures); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Error parsing data"})
			return
		}
		
		// If it is null, return an empty array to prevent errors in the frontend
		if ventures == nil {
			ventures = []VentureReadModel{}
		}
		c.JSON(http.StatusOK, ventures)
	})

	fmt.Println("MS3 Catalog Query levantado en el puerto 8082")
	router.Run(":8082")
}