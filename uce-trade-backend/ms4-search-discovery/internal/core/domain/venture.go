package domain

type Owner struct {
	ID          string `json:"id"`
	FullName    string `json:"fullName"`
	Faculty     string `json:"faculty"`
	PhoneNumber string `json:"phoneNumber"`
	Email       string `json:"email"`
}

type Venture struct {
	ID          string  `json:"id"`
	StudentId   string  `json:"studentId"`
	Title       string  `json:"title"`
	Description string  `json:"description"`
	Category    string  `json:"category"`
	Price       float64 `json:"price"`
	ImageUrl    string  `json:"imageUrl"`
	Status      string  `json:"status"`
	Owner       *Owner  `json:"owner,omitempty"`
}