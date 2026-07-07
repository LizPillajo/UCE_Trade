package rabbitmq

import (
	"encoding/json"
	"log"

	amqp "github.com/rabbitmq/amqp091-go"
	"uce-trade-ms9/internal/core/services"
)

type Consumer struct {
	Conn    *amqp.Connection
	Channel *amqp.Channel
	Service *services.AnalyticsService
}

func NewConsumer(rabbitURL string, service *services.AnalyticsService) (*Consumer, error) {
	conn, err := amqp.Dial(rabbitURL)
	if err != nil {
		return nil, err
	}

	ch, err := conn.Channel()
	if err != nil {
		return nil, err
	}

	return &Consumer{
		Conn:    conn,
		Channel: ch,
		Service: service,
	}, nil
}

func (c *Consumer) StartConsuming() error {
	// We will listen to the same exchanges as MS8/MS6/MS2/MS1
	
	// 1. Payment Success
	err := c.setupQueue("payments-exchange", "payment.success", "ms9.analytics.payment.queue", c.handlePayment)
	if err != nil {
		return err
	}

	// 2. New Startup (Venture created)
	err = c.setupQueue("ventures-exchange", "venture.created", "ms9.analytics.venture.queue", c.handleVenture)
	if err != nil {
		return err
	}

	// 3. New User
	err = c.setupQueue("users-exchange", "user.created", "ms9.analytics.user.queue", c.handleUser)
	if err != nil {
		return err
	}

	return nil
}

func (c *Consumer) setupQueue(exchange, routingKey, queueName string, handler func([]byte) error) error {
	err := c.Channel.ExchangeDeclare(exchange, "direct", true, false, false, false, nil)
	if err != nil {
		return err
	}

	q, err := c.Channel.QueueDeclare(queueName, true, false, false, false, nil)
	if err != nil {
		return err
	}

	err = c.Channel.QueueBind(q.Name, routingKey, exchange, false, nil)
	if err != nil {
		return err
	}

	msgs, err := c.Channel.Consume(q.Name, "", false, false, false, false, nil)
	if err != nil {
		return err
	}

	go func() {
		for d := range msgs {
			if err := handler(d.Body); err != nil {
				log.Printf("Error processing message from %s: %v", queueName, err)
				d.Nack(false, false)
			} else {
				d.Ack(false)
			}
		}
	}()

	log.Printf("[RabbitMQ] Listening on queue: %s", queueName)
	return nil
}

// Handlers
func (c *Consumer) handlePayment(body []byte) error {
	var payload map[string]interface{}
	if err := json.Unmarshal(body, &payload); err != nil {
		return err
	}
	return c.Service.ProcessPayment(payload)
}

func (c *Consumer) handleVenture(body []byte) error {
	var payload map[string]interface{}
	if err := json.Unmarshal(body, &payload); err != nil {
		return err
	}
	return c.Service.ProcessVenture(payload)
}

func (c *Consumer) handleUser(body []byte) error {
	var payload map[string]interface{}
	if err := json.Unmarshal(body, &payload); err != nil {
		return err
	}
	return c.Service.ProcessUser(payload)
}

func (c *Consumer) Close() {
	if c.Channel != nil {
		c.Channel.Close()
	}
	if c.Conn != nil {
		c.Conn.Close()
	}
}
