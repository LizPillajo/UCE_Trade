package http

import (
	"net/http"
	"uce-trade-ms3/internal/core/ports"

	"github.com/gin-gonic/gin"
)

type CatalogHandler struct {
	service ports.CatalogService
}

func NewCatalogHandler(service ports.CatalogService) *CatalogHandler {
	return &CatalogHandler{service: service}
}

// @Summary Get all ventures
// @Description Retrieve the full catalog of ventures (Read-Only)
// @Tags catalog
// @Accept json
// @Produce json
// @Success 200 {array} domain.VentureReadModel
// @Failure 500 {object} map[string]string
// @Router /api/v1/catalog/ventures [get]
func (h *CatalogHandler) GetCatalog(c *gin.Context) {
	ventures, err := h.service.GetAllVentures()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch data"})
		return
	}

	c.JSON(http.StatusOK, ventures)
}
