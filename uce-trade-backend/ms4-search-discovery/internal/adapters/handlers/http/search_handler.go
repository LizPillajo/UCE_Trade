package http

import (
	"log"
	"net/http"
	"uce-trade-ms4/internal/core/domain"
	"uce-trade-ms4/internal/core/ports"

	"github.com/gin-gonic/gin"
)

type SearchHandler struct {
	service ports.SearchService
}

func NewSearchHandler(service ports.SearchService) *SearchHandler {
	return &SearchHandler{service: service}
}

// @Summary Buscar emprendimientos
// @Description Busca emprendimientos en Elasticsearch por término y/o categoría
// @Tags search
// @Accept json
// @Produce json
// @Param q query string false "Término de búsqueda"
// @Param category query string false "Filtro de categoría"
// @Success 200 {array} domain.Venture
// @Failure 500 {object} map[string]string
// @Router /api/v1/search/ventures [get]
func (h *SearchHandler) Search(c *gin.Context) {
	query := c.Query("q")
	category := c.Query("category")

	results, err := h.service.Search(query, category)
	if err != nil {
		log.Printf("Error searching in Elasticsearch: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch data"})
		return
	}

	// Preventing null values in the React frontend
	if results == nil {
		results = []domain.Venture{}
	}

	c.JSON(http.StatusOK, results)
}