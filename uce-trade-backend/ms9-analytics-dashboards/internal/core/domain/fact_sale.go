package domain

import "time"

// FactSale represents a denormalized fact table for sales analytics
type FactSale struct {
	ID           string    `json:"id"`
	VentureID    string    `json:"ventureId"`
	StudentID    string    `json:"studentId"` // The owner/seller
	CategoryName string    `json:"categoryName"`
	Amount       float64   `json:"amount"`
	CreatedAt    time.Time `json:"createdAt"`
}
