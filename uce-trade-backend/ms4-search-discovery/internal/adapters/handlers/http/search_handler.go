package http

import (
	"encoding/base64"
	"encoding/json"
	"fmt"
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
// @Success 200 {object} map[string]interface{}
// @Failure 500 {object} map[string]string
// @Router /api/v1/search/ventures [get]
func (h *SearchHandler) Search(c *gin.Context) {
	query := c.Query("q")
	category := c.Query("category")
	pageStr := c.Query("page")
	sizeStr := c.Query("size")
	sort := c.Query("sort")

	page := 0
	if pageStr != "" {
		fmt.Sscanf(pageStr, "%d", &page)
	}

	size := 10
	if sizeStr != "" {
		fmt.Sscanf(sizeStr, "%d", &size)
	}

	results, total, err := h.service.Search(query, category, page, size, sort)
	if err != nil {
		log.Printf("Error searching in Elasticsearch: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch data"})
		return
	}

	// Preventing null values in the React frontend
	if results == nil {
		results = []domain.Venture{}
	}

	totalPages := total / size
	if total%size > 0 {
		totalPages++
	}

	// Pagination wrapper expected by React frontend (ExplorePage.jsx)
	response := gin.H{
		"content":       results,
		"totalElements": total,
		"totalPages":    totalPages,
	}

	c.JSON(http.StatusOK, response)
}

func (h *SearchHandler) GetMyVentures(c *gin.Context) {
	var token string
	authHeader := c.GetHeader("Authorization")
	if authHeader != "" && len(authHeader) > 7 {
		token = authHeader[7:]
	} else {
		cookie, err := c.Cookie("access_token")
		if err == nil && cookie != "" {
			token = cookie
		}
	}

	if token == "" {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Missing or invalid token"})
		return
	}

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

	// Extract user_id or sub (Firebase UID) instead of email to match StudentId logic
	uid, ok := claims["user_id"].(string)
	if !ok || uid == "" {
		uid, _ = claims["sub"].(string)
	}

	if uid == "" {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User ID not found in token"})
		return
	}

	results, err := h.service.GetMyVentures(uid)
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

// @Summary Get featured ventures
// @Description Get top 4 ventures sorted by rating and sales
// @Tags search
// @Accept json
// @Produce json
// @Success 200 {array} domain.Venture
// @Failure 500 {object} map[string]string
// @Router /api/v1/search/ventures/featured [get]
func (h *SearchHandler) GetFeaturedVentures(c *gin.Context) {
	ventures, err := h.service.GetFeaturedVentures()
	if err != nil {
		log.Printf("Error getting featured ventures: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch featured data"})
		return
	}

	if ventures == nil {
		ventures = []domain.Venture{}
	}

	c.JSON(http.StatusOK, ventures)
}
