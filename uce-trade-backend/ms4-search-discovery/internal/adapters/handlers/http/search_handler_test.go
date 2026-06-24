// uce-trade-backend/ms4-search-discovery/internal/adapters/handlers/http/search_handler_test.go
package http

import (
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"
	"uce-trade-ms4/internal/core/domain"

	"github.com/gin-gonic/gin"
)

// 1. Create a service mock to isolate the test and avoid relying on Elasticsearch
type mockSearchService struct{}

func (m *mockSearchService) Search(query string, category string) ([]domain.Venture, error) {
	// Simulate that the search always returns this result
	return []domain.Venture{
		{ID: "1", Title: "Tutoría de Go", Category: "Tutorials", Price: 10.0},
	}, nil
}

func (m *mockSearchService) IndexVenture(v domain.Venture) error {
	return nil
}

func (m *mockSearchService) GetMyVentures(email string) ([]domain.Venture, error) {
	return []domain.Venture{
		{ID: "2", Title: "Mis Tutorías", Category: "Tutorials", Price: 15.0, StudentId: email},
	}, nil
}

func (m *mockSearchService) GetVentureById(id string) (*domain.Venture, error) {
	return &domain.Venture{ID: id, Title: "Venture Detalle", Category: "Category", Price: 10.0}, nil
}

// 2. The Unitary Test 
func TestSearchHandler_Search_Success(t *testing.T) {
	// Set up Gin in test mode so it doesn't clutter the console
	gin.SetMode(gin.TestMode)
	router := gin.Default()

	// Inject the mock instead of the actual service
	mockSvc := &mockSearchService{}
	handler := NewSearchHandler(mockSvc)

	router.GET("/api/v1/search/ventures", handler.Search)

	// Create a fake HTTP request simulating what the React Frontend would do
	req, _ := http.NewRequest(http.MethodGet, "/api/v1/search/ventures?q=Go", nil)
	resp := httptest.NewRecorder() // Record the response

	// Execute the request on the router
	router.ServeHTTP(resp, req)

	// Verifications (Asserts)
	if resp.Code != http.StatusOK {
		t.Errorf("Expected HTTP status 200 OK, but got %d", resp.Code)
	}

	// Parsing the JSON response
	var response []domain.Venture
	err := json.Unmarshal(resp.Body.Bytes(), &response)
	if err != nil {
			t.Fatalf("Failed to unmarshal JSON response: %v", err)
		}

	// Verify that the response contains the fake data
	if len(response) == 0 || response[0].Title != "Tutoría de Go" {
		t.Errorf("The response does not contain the expected simulated data. We got: %v", response)
	}
}