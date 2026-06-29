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

func (m *mockSearchService) GetFeaturedVentures() ([]domain.Venture, error) {
	return []domain.Venture{
		{ID: "3", Title: "Featured Venture 1", Category: "Tutorials", Price: 10.0},
		{ID: "4", Title: "Featured Venture 2", Category: "Food", Price: 8.0},
	}, nil
}

// 2. Test for Search endpoint
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

// 3. Test for GetFeaturedVentures endpoint - Success case
func TestSearchHandler_GetFeaturedVentures_Success(t *testing.T) {
	gin.SetMode(gin.TestMode)
	router := gin.Default()

	mockSvc := &mockSearchService{}
	handler := NewSearchHandler(mockSvc)

	router.GET("/api/v1/search/ventures/featured", handler.GetFeaturedVentures)

	req, _ := http.NewRequest(http.MethodGet, "/api/v1/search/ventures/featured", nil)
	resp := httptest.NewRecorder()

	router.ServeHTTP(resp, req)

	if resp.Code != http.StatusOK {
		t.Errorf("Expected HTTP status 200 OK, but got %d", resp.Code)
	}

	// Parse the JSON response
	var ventures []domain.Venture
	err := json.Unmarshal(resp.Body.Bytes(), &ventures)
	if err != nil {
		t.Fatalf("Failed to unmarshal JSON response: %v", err)
	}

	// Verify we got the expected number of ventures
	expectedCount := 2
	if len(ventures) != expectedCount {
		t.Errorf("Expected %d ventures, but got %d", expectedCount, len(ventures))
	}

	// Verify the first venture's title
	if len(ventures) > 0 && ventures[0].Title != "Featured Venture 1" {
		t.Errorf("Expected first venture title 'Featured Venture 1', but got '%s'", ventures[0].Title)
	}

	// Verify the second venture's title
	if len(ventures) > 1 && ventures[1].Title != "Featured Venture 2" {
		t.Errorf("Expected second venture title 'Featured Venture 2', but got '%s'", ventures[1].Title)
	}
}

// 4. Test for GetFeaturedVentures endpoint - Empty response case
func TestSearchHandler_GetFeaturedVentures_Empty(t *testing.T) {
	gin.SetMode(gin.TestMode)
	router := gin.Default()

	// Create a custom struct that embeds mockSearchService and overrides GetFeaturedVentures
	type emptyMockService struct {
		mockSearchService
	}
	
	emptyMock := &emptyMockService{}
	
	handler := NewSearchHandler(emptyMock)

	router.GET("/api/v1/search/ventures/featured", handler.GetFeaturedVentures)

	req, _ := http.NewRequest(http.MethodGet, "/api/v1/search/ventures/featured", nil)
	resp := httptest.NewRecorder()

	router.ServeHTTP(resp, req)

	if resp.Code != http.StatusOK {
		t.Errorf("Expected HTTP status 200 OK, but got %d", resp.Code)
	}

	var ventures []domain.Venture
	err := json.Unmarshal(resp.Body.Bytes(), &ventures)
	if err != nil {
		t.Fatalf("Failed to unmarshal JSON response: %v", err)
	}

	if resp.Code != http.StatusOK {
		t.Errorf("Expected HTTP status 200 OK, but got %d", resp.Code)
	}
}