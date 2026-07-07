FROM golang:1.26-alpine AS builder

WORKDIR /app

# Install dependencies
COPY go.mod go.sum ./
RUN go mod download

# Copy source code
COPY . .

# Build the Go application
RUN CGO_ENABLED=0 GOOS=linux go build -o ms9-app ./cmd/main.go

# Final stage
FROM alpine:latest

WORKDIR /app

# Copy the built binary
COPY --from=builder /app/ms9-app .

EXPOSE 3009

CMD ["./ms9-app"]
