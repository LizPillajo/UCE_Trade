package events

import (
	"context"
	"encoding/json"
	"log/slog"
	"os"
	"uce-trade-ms3/internal/core/domain"
	"uce-trade-ms3/internal/core/ports"

	"github.com/segmentio/kafka-go"
)

type KafkaConsumer struct {
	service ports.CatalogService
	reader  *kafka.Reader
	logger  *slog.Logger
}

func NewKafkaConsumer(brokers []string, topic string, service ports.CatalogService) *KafkaConsumer {
	reader := kafka.NewReader(kafka.ReaderConfig{
		Brokers:   brokers,
		Topic:     topic,
		Partition: 0,
	})

	// Logs in JSON format so that tools like Grafana and Loki can easily read them
	logger := slog.New(slog.NewJSONHandler(os.Stdout, nil))

	return &KafkaConsumer{
		service: service,
		reader:  reader,
		logger:  logger,
	}
}

func (c *KafkaConsumer) Start() {
	c.logger.Info("🎧 MS3: Kafka Consumer listening for events...")
	for {
		msg, err := c.reader.ReadMessage(context.Background())
		if err != nil {
			c.logger.Error("Error reading message from Kafka", "error", err)
			continue
		}

		var venture domain.VentureReadModel
		if err := json.Unmarshal(msg.Value, &venture); err != nil {
			c.logger.Error("Error parsing event payload", "error", err)
			continue
		}

		if err := c.service.SyncVenture(venture); err != nil {
			c.logger.Error("Error saving venture to MongoDB", "error", err, "venture_id", venture.ID)
		} else {
			c.logger.Info("✅ Venture successfully synced to Catalog", "title", venture.Title)
		}
	}
}
