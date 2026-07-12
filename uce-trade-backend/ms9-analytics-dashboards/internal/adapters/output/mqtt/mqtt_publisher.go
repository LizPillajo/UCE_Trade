package mqtt

import (
	"encoding/json"
	"github.com/sirupsen/logrus"

	MQTT "github.com/eclipse/paho.mqtt.golang"
)

type Publisher struct {
	Client MQTT.Client
}

func NewPublisher(brokerURL string) (*Publisher, error) {
	opts := MQTT.NewClientOptions().AddBroker(brokerURL)
	opts.SetClientID("ms9-analytics-publisher")

	client := MQTT.NewClient(opts)
	if token := client.Connect(); token.Wait() && token.Error() != nil {
		return nil, token.Error()
	}

	logrus.Infof("[MQTT] Connected to broker: %s", brokerURL)
	return &Publisher{Client: client}, nil
}

func (p *Publisher) PublishDashboardRefresh(topic string) error {
	payload := map[string]string{
		"type": "dashboard-refresh",
	}
	bytes, _ := json.Marshal(payload)

	token := p.Client.Publish(topic, 0, false, bytes)
	token.Wait()

	if token.Error() != nil {
		logrus.Errorf("[MQTT] Failed to publish to %s: %v", topic, token.Error())
		return token.Error()
	}

	logrus.Infof("[MQTT] Published 'dashboard-refresh' to %s", topic)
	return nil
}

func (p *Publisher) Close() {
	if p.Client != nil && p.Client.IsConnected() {
		p.Client.Disconnect(250)
	}
}
