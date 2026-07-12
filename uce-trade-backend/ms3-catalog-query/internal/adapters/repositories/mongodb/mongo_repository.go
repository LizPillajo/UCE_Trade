package mongodb

import (
	"context"
	"uce-trade-ms3/internal/core/domain"
	"uce-trade-ms3/internal/core/ports"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

type mongoRepository struct {
	collection *mongo.Collection
}

func NewMongoRepository(client *mongo.Client, dbName, collectionName string) ports.CatalogRepository {
	collection := client.Database(dbName).Collection(collectionName)
	return &mongoRepository{collection: collection}
}

func (r *mongoRepository) FindAll() ([]domain.VentureReadModel, error) {
	var ventures []domain.VentureReadModel

	// Sort by _id descending (MongoDB ObjectId contains timestamp)
	opts := options.Find().SetSort(bson.D{{Key: "_id", Value: -1}})

	cursor, err := r.collection.Find(context.TODO(), bson.D{{}}, opts)
	if err != nil {
		return nil, err
	}
	defer cursor.Close(context.TODO())

	if err = cursor.All(context.TODO(), &ventures); err != nil {
		return nil, err
	}

	if ventures == nil {
		ventures = []domain.VentureReadModel{}
	}

	return ventures, nil
}

func (r *mongoRepository) InsertVenture(venture domain.VentureReadModel) error {
	filter := bson.M{"id": venture.ID}
	opts := options.Replace().SetUpsert(true)
	_, err := r.collection.ReplaceOne(context.TODO(), filter, venture, opts)
	return err
}
