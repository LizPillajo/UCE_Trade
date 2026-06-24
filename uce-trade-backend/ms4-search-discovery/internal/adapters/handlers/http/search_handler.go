package http

import (
	"encoding/base64"
	"encoding/json"
	"log"
	"net/http"
	"strings"
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

func (h *SearchHandler) GetMyVentures(c *gin.Context) {
	authHeader := c.GetHeader("Authorization")
	if authHeader == "" || len(authHeader) < 8 {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Missing or invalid token"})
		return
	}

	token := authHeader[7:] // Remove "Bearer "
	parts := strings.Split(token, ".")
	if len(parts) != 3 {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid JWT format"})
		return
	}

	payload, err := base64.RawURLEncoding.DecodeString(parts[1])
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Failed to decode token"})
		return
	}

	var claims map[string]interface{}
	if err := json.Unmarshal(payload, &claims); err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Failed to parse token payload"})
		return
	}

	email, ok := claims["email"].(string)
	if !ok || email == "" {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Email not found in token"})
		return
	}

	results, err := h.service.GetMyVentures(email)
	if err != nil {
		log.Printf("Error getting my ventures: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch data"})
		return
	}

	if results == nil {
		results = []domain.Venture{}
	}

	c.JSON(http.StatusOK, results)
}

func (h *SearchHandler) GetVentureById(c *gin.Context) {
	id := c.Param("id")
	if id == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Missing venture ID"})
		return
	}

	venture, err := h.service.GetVentureById(id)
	if err != nil {
		log.Printf("Error getting venture by id: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch data"})
		return
	}

	if venture == nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Venture not found"})
		return
	}

	c.JSON(http.StatusOK, venture)
}