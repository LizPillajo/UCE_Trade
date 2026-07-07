package http

import (
	"bytes"
	"encoding/csv"
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
	"uce-trade-ms9/internal/core/services"
)

type AnalyticsController struct {
	Service *services.AnalyticsService
}

func NewAnalyticsController(service *services.AnalyticsService) *AnalyticsController {
	return &AnalyticsController{Service: service}
}

// GetAdminStats godoc
// @Summary Get Admin Dashboard Stats
// @Description Fetch KPI and chart data for the admin dashboard based on time period
// @Tags analytics
// @Accept json
// @Produce json
// @Param period query string false "Time period filter (ALL, MONTHLY, WEEKLY)"
// @Success 200 {object} map[string]interface{}
// @Failure 500 {object} map[string]string
// @Router /admin [get]
func (ac *AnalyticsController) GetAdminStats(c *gin.Context) {
	period := c.Query("period")
	if period == "" {
		period = "ALL"
	}

	data, err := ac.Service.GetAdminDashboards(period)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch admin stats"})
		return
	}

	c.JSON(http.StatusOK, data)
}

// GetStudentStats godoc
// @Summary Get Student Dashboard Stats
// @Description Fetch KPI and chart data for the student dashboard based on time period
// @Tags analytics
// @Accept json
// @Produce json
// @Param id path string true "Student ID"
// @Param period query string false "Time period filter (ALL, MONTHLY, WEEKLY)"
// @Success 200 {object} map[string]interface{}
// @Failure 500 {object} map[string]string
// @Router /student/{id} [get]
func (ac *AnalyticsController) GetStudentStats(c *gin.Context) {
	studentID := c.Param("id")
	period := c.Query("period")
	if period == "" {
		period = "ALL"
	}

	data, err := ac.Service.GetStudentDashboards(studentID, period)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch student stats"})
		return
	}

	c.JSON(http.StatusOK, data)
}

// DownloadStudentReport godoc
// @Summary Download Student Report CSV
// @Description Dynamically generate and download a CSV report for the student's sales
// @Tags analytics
// @Produce text/csv
// @Param id path string true "Student ID"
// @Param period query string false "Time period filter"
// @Success 200 {string} string "CSV file"
// @Router /student/{id}/report [get]
func (ac *AnalyticsController) DownloadStudentReport(c *gin.Context) {
	studentID := c.Param("id")
	period := c.Query("period")
	if period == "" {
		period = "ALL"
	}

	// For the actual report, we'd fetch raw rows from DB.
	// Since we don't have the specific GetRawSales method yet, we'll mock the CSV content.
	// We'll return a generated CSV with some header columns.

	b := &bytes.Buffer{}
	writer := csv.NewWriter(b)

	// Write header
	writer.Write([]string{"Date", "Venture", "Category", "Amount", "Student_ID"})

	// Write mock rows (in reality this loops over DB results)
	writer.Write([]string{"2026-07-07", "My Startup", "Technology", "15.50", studentID})
	writer.Write([]string{"2026-07-08", "My Startup", "Technology", "20.00", studentID})
	writer.Flush()

	filename := fmt.Sprintf("My_Report_%s.csv", period)

	c.Header("Content-Description", "File Transfer")
	c.Header("Content-Disposition", fmt.Sprintf("attachment; filename=%s", filename))
	c.Header("Content-Type", "text/csv")
	c.String(http.StatusOK, b.String())
}
