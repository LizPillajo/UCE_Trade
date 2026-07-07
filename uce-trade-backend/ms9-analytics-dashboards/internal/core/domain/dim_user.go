package domain

import "time"

// DimUser represents a dimension table for user analytics
type DimUser struct {
	ID        string    `json:"id"`
	Role      string    `json:"role"`
	CreatedAt time.Time `json:"createdAt"`
}
