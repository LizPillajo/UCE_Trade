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
	var buf bytes.Buffer
	
	mustClauses := []map[string]interface{}{}
	
	if query != "" {
		mustClauses = append(mustClauses, map[string]interface{}{
			"multi_match": map[string]interface{}{
				"query":  query,
				"fields": []string{"title^2", "description", "category"},
			},
		})
	} else {
		mustClauses = append(mustClauses, map[string]interface{}{
			"match_all": map[string]interface{}{},
		})
	}

	filterClauses := []map[string]interface{}{}
	if category != "" && category != "All" {
		filterClauses = append(filterClauses, map[string]interface{}{
			"term": map[string]interface{}{
				"category.keyword": category,
			},
		})
	}

	searchQuery := map[string]interface{}{
		"query": map[string]interface{}{
			"bool": map[string]interface{}{
				"must": mustClauses,
				"filter": filterClauses,
			},
		},
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
		if res.StatusCode == 404 {
			return []domain.Venture{}, nil
		}
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

func (r *esRepository) IndexVenture(v domain.Venture) error {
	// Convert a Go struct to JSON
	data, err := json.Marshal(v)
	if err != nil {
		return err
	}

	// The document is sent to Elasticsearch using its ID
	res, err := r.client.Index(
		r.index,
		bytes.NewReader(data),
		r.client.Index.WithDocumentID(v.ID),
		r.client.Index.WithRefresh("true"), // Resfresh to make it searchable immediately
	)
	if err != nil {
		return err
	}
	defer res.Body.Close()

	if res.IsError() {
		return fmt.Errorf("Error indexing document in ES: %s", res.Status())
	}

	return nil
}

func (r *esRepository) GetMyVentures(email string) ([]domain.Venture, error) {
	var buf bytes.Buffer
	searchQuery := map[string]interface{}{
		"query": map[string]interface{}{
			"match": map[string]interface{}{
				"studentId": email,
			},
		},
	}

	if err := json.NewEncoder(&buf).Encode(searchQuery); err != nil {
		return nil, err
	}

	res, err := r.client.Search(
		r.client.Search.WithContext(context.Background()),
		r.client.Search.WithIndex(r.index),
		r.client.Search.WithBody(&buf),
	)
	if err != nil {
		return nil, err
	}
	defer res.Body.Close()

	if res.IsError() {
		if res.StatusCode == 404 {
			return []domain.Venture{}, nil
		}
		return nil, fmt.Errorf("error in response: %s", res.String())
	}

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

func (r *esRepository) GetVentureById(id string) (*domain.Venture, error) {
	res, err := r.client.Get(r.index, id)
	if err != nil {
		return nil, err
	}
	defer res.Body.Close()

	if res.IsError() {
		if res.StatusCode == 404 {
			return nil, nil // Not found
		}
		return nil, fmt.Errorf("error getting document: %s", res.Status())
	}

	var rMap map[string]interface{}
	if err := json.NewDecoder(res.Body).Decode(&rMap); err != nil {
		return nil, err
	}

	source := rMap["_source"]
	sourceBytes, _ := json.Marshal(source)
	var venture domain.Venture
	json.Unmarshal(sourceBytes, &venture)

	return &venture, nil
}