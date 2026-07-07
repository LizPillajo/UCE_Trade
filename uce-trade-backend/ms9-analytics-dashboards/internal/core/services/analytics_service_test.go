package services_test

import (
	"errors"
	"testing"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/mock"
	"uce-trade-ms9/internal/core/domain"
	"uce-trade-ms9/internal/core/services"
)

// MockAnalyticsRepository
type MockAnalyticsRepository struct {
	mock.Mock
}

func (m *MockAnalyticsRepository) SaveFactSale(fact *domain.FactSale) error {
	args := m.Called(fact)
	return args.Error(0)
}

func (m *MockAnalyticsRepository) SaveDimUser(dim *domain.DimUser) error {
	args := m.Called(dim)
	return args.Error(0)
}

func (m *MockAnalyticsRepository) SaveDimVenture(dim *domain.DimVenture) error {
	args := m.Called(dim)
	return args.Error(0)
}

func (m *MockAnalyticsRepository) GetAdminStats(period string) (map[string]interface{}, error) {
	args := m.Called(period)
	return args.Get(0).(map[string]interface{}), args.Error(1)
}

func (m *MockAnalyticsRepository) GetStudentStats(studentID, period string) (map[string]interface{}, error) {
	args := m.Called(studentID, period)
	return args.Get(0).(map[string]interface{}), args.Error(1)
}

func (m *MockAnalyticsRepository) GetVentureSellerID(ventureID string) string {
	args := m.Called(ventureID)
	return args.String(0)
}

// MockNotificationPublisher
type MockNotificationPublisher struct {
	mock.Mock
}

func (m *MockNotificationPublisher) PublishDashboardRefresh(topic string) error {
	args := m.Called(topic)
	return args.Error(0)
}

func TestProcessPayment(t *testing.T) {
	mockRepo := new(MockAnalyticsRepository)
	mockPub := new(MockNotificationPublisher)
	service := services.NewAnalyticsService(mockRepo, mockPub)

	payload := map[string]interface{}{
		"amount":    50.0,
		"ventureId": "v123",
		"studentId": "s123",
	}

	// Expect repository save to be called and succeed
	mockRepo.On("GetVentureSellerID", "v123").Return("s123")
	mockRepo.On("SaveFactSale", mock.MatchedBy(func(fact *domain.FactSale) bool {
		return fact.Amount == 50.0 && fact.VentureID == "v123" && fact.StudentID == "s123"
	})).Return(nil)

	// Expect publisher to be called twice (admin and student)
	mockPub.On("PublishDashboardRefresh", "analytics/admin").Return(nil)
	mockPub.On("PublishDashboardRefresh", "analytics/student/s123").Return(nil)

	err := service.ProcessPayment(payload)

	assert.NoError(t, err)
	mockRepo.AssertExpectations(t)
	mockPub.AssertExpectations(t)
}

func TestProcessPayment_RepoError(t *testing.T) {
	mockRepo := new(MockAnalyticsRepository)
	mockPub := new(MockNotificationPublisher)
	service := services.NewAnalyticsService(mockRepo, mockPub)

	payload := map[string]interface{}{
		"amount":    50.0,
		"ventureId": "v123",
		"studentId": "s123",
	}

	expectedErr := errors.New("db error")
	mockRepo.On("GetVentureSellerID", "v123").Return("s123")
	mockRepo.On("SaveFactSale", mock.Anything).Return(expectedErr)

	err := service.ProcessPayment(payload)

	assert.Error(t, err)
	assert.Equal(t, expectedErr, err)
	mockRepo.AssertExpectations(t)
	// Publisher should NOT be called if db fails
	mockPub.AssertNotCalled(t, "PublishDashboardRefresh")
}

func TestGetAdminDashboards(t *testing.T) {
	mockRepo := new(MockAnalyticsRepository)
	mockPub := new(MockNotificationPublisher)
	service := services.NewAnalyticsService(mockRepo, mockPub)

	expectedData := map[string]interface{}{
		"kpi": map[string]interface{}{
			"revenue": 1000.0,
			"growth":  15.5, // math percentages
		},
	}

	mockRepo.On("GetAdminStats", "MONTHLY").Return(expectedData, nil)

	data, err := service.GetAdminDashboards("MONTHLY")

	assert.NoError(t, err)
	assert.Equal(t, expectedData, data)
	mockRepo.AssertExpectations(t)
}

func TestGetStudentDashboards(t *testing.T) {
	mockRepo := new(MockAnalyticsRepository)
	mockPub := new(MockNotificationPublisher)
	service := services.NewAnalyticsService(mockRepo, mockPub)

	expectedData := map[string]interface{}{
		"kpi": map[string]interface{}{
			"sales": 50,
			"rating": 4.8,
		},
	}

	mockRepo.On("GetStudentStats", "s123", "ALL").Return(expectedData, nil)

	data, err := service.GetStudentDashboards("s123", "ALL")

	assert.NoError(t, err)
	assert.Equal(t, expectedData, data)
	mockRepo.AssertExpectations(t)
}
