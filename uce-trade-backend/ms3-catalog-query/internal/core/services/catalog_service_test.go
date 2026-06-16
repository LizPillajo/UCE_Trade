package services

import (
	"testing"
	"uce-trade-ms3/internal/core/domain"
)

// 1. Repository mock to isolate the test
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

// 2. Unit Test for getting the catalog
func TestCatalogService_GetAllVentures(t *testing.T) {
	// Arrange: We prepare the fake data and the injection
	repo := &mockCatalogRepository{
		mockData: []domain.VentureReadModel{
			{ID: "1", Title: "Tutoría de Álgebra", Price: 10.0},
			{ID: "2", Title: "Postres Caseros", Price: 5.5},
		},
	}
	svc := NewCatalogService(repo)

	// Act: We call the service method
	ventures, err := svc.GetAllVentures()

	// Assert: We verify the results
	if err != nil {
		t.Fatalf("No error was expected; the following result was obtained: %v", err)
	}
	
	if len(ventures) != 2 {
		t.Fatalf("Two startups were expected; the following were found: %d", len(ventures))
	}
	
	if ventures[0].Title != "Tutoría de Álgebra" {
		t.Errorf("The title doesn't match. The result was: %s", ventures[0].Title)
	}
}

// 3. Unit Test for Kafka Synchronization
func TestCatalogService_SyncVenture(t *testing.T) {
	// Arrange
	repo := &mockCatalogRepository{
		mockData: []domain.VentureReadModel{},
	}
	svc := NewCatalogService(repo)
	newVenture := domain.VentureReadModel{ID: "3", Title: "Reparación de Laptops"}

	// Act
	err := svc.SyncVenture(newVenture)

	// Assert
	if err != nil {
		t.Fatalf("No error was expected during insertion; the following result was obtained: %v", err)
	}
	
	if len(repo.mockData) != 1 {
		t.Fatalf("One startup was expected to be included in the mock; the following were found: %d", len(repo.mockData))
	}
}