package events

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"uce-trade-ms4/internal/core/domain"
	"uce-trade-ms4/internal/core/ports"

	"github.com/segmentio/kafka-go"
)

type KafkaConsumer struct {
	service ports.SearchService
	reader  *kafka.Reader
}

func NewKafkaConsumer(brokers []string, topic string, service ports.SearchService) *KafkaConsumer {
	reader := kafka.NewReader(kafka.ReaderConfig{
		Brokers:   brokers,
		Topic:     topic,
		Partition: 0,
	})
	return &KafkaConsumer{service: service, reader: reader}
}

func (c *KafkaConsumer) Start() {
	fmt.Println("🎧 MS4: Consumidor de Kafka escuchando eventos...")
	for {
		// Waiting for a message to arrive
		msg, err := c.reader.ReadMessage(context.Background())
		if err != nil {
			log.Printf("Error reading message from Kafka: %v", err)
			continue
		}

		// Convert the JSON message to the Venture model
		var venture domain.Venture
		if err := json.Unmarshal(msg.Value, &venture); err != nil {
			log.Printf("Error parsing event: %v", err)
			continue
		}

		// Llama al caso de uso para indexar en Elasticsearch
		if err := c.service.IndexVenture(venture); err != nil {
			log.Printf("Error indexing in ES: %v", err)
		} else {
			fmt.Printf("✅ ¡Startup indexed in Elasticsearch!: %s\n", venture.Title)
		}
	}
}