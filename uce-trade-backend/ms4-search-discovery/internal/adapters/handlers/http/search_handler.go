package http

import (
	"net/http"
	"uce-trade-ms4/internal/core/ports"

	"github.com/gin-gonic/gin"
)

type SearchHandler struct {
	service ports.SearchService
}

func NewSearchHandler(service ports.SearchService) *SearchHandler {
	return &SearchHandler{service: service}
}

func (h *SearchHandler) Search(c *gin.Context) {
	query := c.Query("q")
	category := c.Query("category")

	results, err := h.service.Search(query, category)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch data"})
		return
	}

	// Preventing null values in the React frontend
	if results == nil {
		results = []domain.Venture{}
	}

	c.JSON(http.StatusOK, results)
}