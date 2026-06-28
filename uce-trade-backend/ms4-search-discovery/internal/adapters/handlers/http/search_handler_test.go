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
	gin.SetMode(gin.TestMode)
	router := gin.Default()

	mockSvc := &mockSearchService{}
	handler := NewSearchHandler(mockSvc)

	router.GET("/api/v1/search/ventures", handler.Search)

	req, _ := http.NewRequest(http.MethodGet, "/api/v1/search/ventures?q=Go", nil)
	resp := httptest.NewRecorder()

	router.ServeHTTP(resp, req)

	if resp.Code != http.StatusOK {
		t.Errorf("Expected HTTP status 200 OK, but got %d", resp.Code)
	}

	// Parse the new paginated JSON response
	var response map[string]interface{}
	err := json.Unmarshal(resp.Body.Bytes(), &response)
	if err != nil {
		t.Fatalf("Failed to unmarshal JSON response: %v", err)
	}

	// Extract the "content" array
	content, ok := response["content"].([]interface{})
	if !ok || len(content) == 0 {
		t.Fatalf("Response does not contain a valid 'content' array. Got: %v", response)
	}

	// Verify the first item's title
	firstItem := content[0].(map[string]interface{})
	if firstItem["title"] != "Tutoría de Go" {
		t.Errorf("The response does not contain the expected simulated data. We got: %v", firstItem["title"])
	}
}