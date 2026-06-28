package services

import (
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"
	"uce-trade-ms3/internal/core/domain"
)

// 1. Repository mock para aislar la prueba de MongoDB
type mockCatalogRepository struct {
	mockData []domain.VentureReadModel
}

func (m *mockCatalogRepository) FindAll() ([]domain.VentureReadModel, error) {
	return m.mockData, nil
}

func (m *mockCatalogRepository) InsertVenture(v domain.VentureReadModel) error {
	m.mockData = append(m.mockData, v)
	return nil
}

// 2. Test para GetAllVentures() con mock de HTTP
func TestCatalogService_GetAllVentures(t *testing.T) {
	mockVentures := []domain.VentureReadModel{
		{ID: "1", StudentId: "user-123", Title: "Algebra Tutoring", Price: 10.0},
		{ID: "2", StudentId: "user-456", Title: "Homemade Desserts", Price: 5.5},
	}

	// Fake (mock) HTTP server that simulates MS1
	mockServer := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		// It is verified that the route is as expected
		if r.URL.Path == "/api/v1/users/user-123" {
			// An Owner is returned for user-123
			owner := domain.Owner{
				ID:          "user-123",
				FullName:    "Liz Pillajo",
				Faculty:     "Engineering and Applied Sciences",
				PhoneNumber: "0987654321",
				Email:       "liz@uce.edu.ec",
			}
			w.Header().Set("Content-Type", "application/json")
			json.NewEncoder(w).Encode(owner)
		} else if r.URL.Path == "/api/v1/users/user-456" {
			// An Owner is returned for user-456
			owner := domain.Owner{
				ID:          "user-456",
				FullName:    "Juan Pérez",
				Faculty:     "Medical Sciences",
				PhoneNumber: "0998877665",
				Email:       "juan@uce.edu.ec",
			}
			w.Header().Set("Content-Type", "application/json")
			json.NewEncoder(w).Encode(owner)
		} else {
			// If the route is not recognized, we return 404
			w.WriteHeader(http.StatusNotFound)
		}
	}))
	defer mockServer.Close()

	// The URL of the mock server is injected into our service
	repo := &mockCatalogRepository{mockData: mockVentures}
	
	// The service is created using the mock URL
	svc := &catalogService{
		repo:      repo,
		ms1BaseURL: mockServer.URL, 
	}

	// Act: Call the method you want to test
	ventures, err := svc.GetAllVentures()

	// Assert: The results are verified
	if err != nil {
		t.Fatalf("No error was expected, but one occurred: %v", err)
	}

	if len(ventures) != 2 {
		t.Fatalf("2 startups were expected, but found: %d", len(ventures))
	}

	// Verificamos que el Owner se haya poblado correctamente
	if ventures[0].Owner == nil {
		t.Error("2 startups were expected, but found: %d", len(ventures))
	} else {
		if ventures[0].Owner.FullName != "Liz Pillajo" {
			t.Errorf("Incorrect owner name. ‘Liz Pillajo’ was expected, but the following was found: %s", ventures[0].Owner.FullName)
		}
		if ventures[0].Owner.Faculty != "Engineering and Applied Sciences" {
			t.Errorf("Incorrect owner faculty. ‘Engineering and Applied Sciences’ was expected, but the following was found: %s", ventures[0].Owner.Faculty)
		}
	}

	if ventures[1].Owner == nil {
		t.Error("2 startups were expected, but found: %d", len(ventures))
	} else {
		if ventures[1].Owner.FullName != "Juan Pérez" {
			t.Errorf("Incorrect owner name. ‘Juan Pérez’ was expected, but the following was found: %s", ventures[1].Owner.FullName)
		}
	}
}

// 3. Test para SyncVenture 
func TestCatalogService_SyncVenture(t *testing.T) {
	// Arrange
	repo := &mockCatalogRepository{
		mockData: []domain.VentureReadModel{},
	}
	svc := &catalogService{repo: repo}
	newVenture := domain.VentureReadModel{ID: "3", Title: "Laptop Repair"}

	// Act
	err := svc.SyncVenture(newVenture)

	// Assert
	if err != nil {
		t.Fatalf("No error was expected during insertion, but one occurred: %v", err)
	}

	if len(repo.mockData) != 1 {
		t.Fatalf("1 startup was expected in the mock, but found: %d", len(repo.mockData))
	}
}