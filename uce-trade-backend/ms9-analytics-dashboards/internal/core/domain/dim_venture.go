package domain

import "time"

// DimVenture represents a dimension table for venture analytics
type DimVenture struct {
	ID           string    `json:"id"`
	StudentID    string    `json:"studentId"`
	CategoryName string    `json:"categoryName"`
	Status       string    `json:"status"`
	CreatedAt    time.Time `json:"createdAt"`
}
