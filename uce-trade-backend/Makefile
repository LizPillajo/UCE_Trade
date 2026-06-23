.PHONY: build-all build-java build-go run-all

build-all: build-java build-go

build-java:
	./gradlew build -x test

build-go:
	cd ms3-catalog-query && go build -o build/api ./cmd/api
	cd ms4-search-discovery && go build -o build/api ./cmd/api

run-all:
	cd .. && docker compose -f docker-compose.yml -f docker-compose.apps.yml up -d
