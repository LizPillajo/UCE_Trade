package main

import (
	"testing"
)

// To verify that the model is instantiated correctly
func TestVentureReadModel_Creation(t *testing.T) {
	expectedTitle := "Emprendimiento de Prueba"
	expectedPrice := 15.50

	venture := VentureReadModel{
		ID:    "123",
		Title: expectedTitle,
		Price: expectedPrice,
	}

	if venture.Title != expectedTitle {
		t.Errorf("Error en el título: esperaba %s, pero obtuve %s", expectedTitle, venture.Title)
	}

	if venture.Price != expectedPrice {
		t.Errorf("Error en el precio: esperaba %f, pero obtuve %f", expectedPrice, venture.Price)
	}
}