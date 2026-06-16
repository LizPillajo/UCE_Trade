package domain

type Venture struct {
	ID          string  `json:"id"`
	StudentId   string  `json:"studentId"`
	Title       string  `json:"title"`
	Description string  `json:"description"`
	Category    string  `json:"category"`
	Price       float64 `json:"price"`
	ImageUrl    string  `json:"imageUrl"`
	Status      string  `json:"status"`
}