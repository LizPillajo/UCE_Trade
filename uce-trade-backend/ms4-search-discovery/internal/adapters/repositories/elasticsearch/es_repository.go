package elasticsearch

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"uce-trade-ms4/internal/core/domain"
	"uce-trade-ms4/internal/core/ports"

	"github.com/elastic/go-elasticsearch/v8"
)

type esRepository struct {
	client *elasticsearch.Client
	index  string
}

func NewESRepository(client *elasticsearch.Client, index string) ports.SearchRepository {
	return &esRepository{client: client, index: index}
}

func (r *esRepository) SearchVentures(query string, category string) ([]domain.Venture, error) {
	// Basic Multi-Match Query for Elasticsearch
	var buf bytes.Buffer
	searchQuery := map[string]interface{}{
		"query": map[string]interface{}{
			"multi_match": map[string]interface{}{
				"query":  query,
				"fields": []string{"title^2", "description", "category"},
			},
		},
	}

	if query == "" {
		searchQuery["query"] = map[string]interface{}{"match_all": map[string]interface{}{}}
	}

	if err := json.NewEncoder(&buf).Encode(searchQuery); err != nil {
		return nil, err
	}

	res, err := r.client.Search(
		r.client.Search.WithContext(context.Background()),
		r.client.Search.WithIndex(r.index),
		r.client.Search.WithBody(&buf),
		r.client.Search.WithTrackTotalHits(true),
	)
	if err != nil {
		return nil, err
	}
	defer res.Body.Close()

	if res.IsError() {
		return nil, fmt.Errorf("error in response: %s", res.String())
	}

	// Parse the response from ES
	var rMap map[string]interface{}
	if err := json.NewDecoder(res.Body).Decode(&rMap); err != nil {
		return nil, err
	}

	var ventures []domain.Venture
	hits := rMap["hits"].(map[string]interface{})["hits"].([]interface{})
	for _, hit := range hits {
		source := hit.(map[string]interface{})["_source"]
		sourceBytes, _ := json.Marshal(source)
		var venture domain.Venture
		json.Unmarshal(sourceBytes, &venture)
		ventures = append(ventures, venture)
	}

	return ventures, nil
}