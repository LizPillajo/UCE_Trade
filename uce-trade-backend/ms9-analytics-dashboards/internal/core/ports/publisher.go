package ports

type NotificationPublisher interface {
	PublishDashboardRefresh(topic string) error
}
