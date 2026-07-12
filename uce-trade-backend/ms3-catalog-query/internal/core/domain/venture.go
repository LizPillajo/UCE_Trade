package domain

// How data is read in this microservice
type VentureReadModel struct {
	ID          string  `json:"id" bson:"_id"`
	StudentId   string  `json:"studentId" bson:"student_id"`
	Title       string  `json:"title" bson:"title"`
	Description string  `json:"description" bson:"description"`
	Price       float64 `json:"price" bson:"price"`
	ImageUrl    string  `json:"imageUrl" bson:"image_url"`
	Status      string  `json:"status" bson:"status"`
	Owner       *Owner  `json:"owner,omitempty" bson:"-"`
}

// Owner represents the user details from MS1
type Owner struct {
	ID          string `json:"uid"`
	FullName    string `json:"fullName"`
	Faculty     string `json:"faculty"`
	PhoneNumber string `json:"phoneNumber"`
	Email       string `json:"email"`
}
