package events

import (
	"context"
	"encoding/json"
	"uce-trade-ms4/internal/core/domain"
	"uce-trade-ms4/internal/core/ports"

	"github.com/sirupsen/logrus"

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
	logrus.Info("🎧 MS4: Kafka consumer listening for events...")
	for {
		// Waiting for a message to arrive
		msg, err := c.reader.ReadMessage(context.Background())
		if err != nil {
			logrus.Errorf("Error reading message from Kafka: %v", err)
			continue
		}

		// Convert the JSON message to the Venture model
		var venture domain.Venture
		if err := json.Unmarshal(msg.Value, &venture); err != nil {
			logrus.Errorf("Error parsing event: %v", err)
			continue
		}

		// Llama al caso de uso para indexar en Elasticsearch
		if err := c.service.IndexVenture(venture); err != nil {
			logrus.Errorf("Error indexing in ES: %v", err)
		} else {
			logrus.Infof("✅ ¡Startup indexed in Elasticsearch!: %s", venture.Title)
		}
	}
}
