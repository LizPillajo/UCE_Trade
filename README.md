# UCE Trade - Microservices Architecture (MS2 & MS3)

This repository contains the source code and deployment configuration for two core microservices of the UCE Trade platform, designed using a Cloud Native and event-driven architecture.

## Project Architecture

The system implements the **CQRS (Command and Query Responsibility Segregation)** pattern to separate write and read operations, optimizing performance and scalability. Asynchronous communication between services is handled via **Apache Kafka**.

* **MS2 - Product Command (Java/Spring Boot):** Microservice responsible for receiving venture creation requests. It persists relational data in MySQL, uploads media files to cloud storage buckets (Supabase), and publishes domain events to Kafka.
* **MS3 - Catalog Query (Go/Gin):** Consumer microservice that listens to Kafka events, synchronizes denormalized data into MongoDB, and exposes high-performance read endpoints to list the catalog.

## Documented Environment Variables

To run this project, the following environment variables must be configured. For security reasons, the actual sensitive values are not exposed in this repository and must be injected directly into the QA and Production environments.

| Service | Variable | Description | Example (Do not use in Prod) |
| :--- | :--- | :--- | :--- |
| **MS2 (Java)** | `SPRING_DATASOURCE_USERNAME` | MySQL database username. | `root` |
| **MS2 (Java)** | `SPRING_DATASOURCE_PASSWORD` | MySQL database password. | `secure_password` |
| **MS2 (Java)** | `SUPABASE_URL` | Supabase Cloud project URL. | `https://xxxx.supabase.co` |
| **MS2 (Java)** | `SUPABASE_KEY` | API Key to access the image storage bucket. | `eyJh...` |
| **MS3 (Go)** | `MONGO_URI` | Primary connection string for MongoDB. | `mongodb://localhost:27017` |
| **MS3 (Go)** | `MONGODB_URI` | Secondary connection string for synchronization. | `mongodb://localhost:27017` |

## Required Configuration Files (Deployment)

The deployment of the underlying infrastructure (Databases, Kafka) and the microservices is done using `docker-compose`. Below is the required configuration template to provision the environments:

```yaml
services:
  ms2-mysql:
    image: mysql:5.7
    container_name: uce_trade_ms2_db
    environment:
      MYSQL_ROOT_PASSWORD: ${DB_PASSWORD}
      MYSQL_DATABASE: uce_trade_ms2
    ports:
      - "3306:3306"
    volumes:
      - ms2_db_data:/var/lib/mysql
    
  kafka:
    image: apache/kafka:latest
    container_name: uce_trade_kafka
    ports:
      - "9092:9092"
    environment:
      - KAFKA_NODE_ID=1
      - KAFKA_PROCESS_ROLES=broker,controller
      - KAFKA_LISTENERS=PLAINTEXT://:9092,CONTROLLER://:9093
      - KAFKA_ADVERTISED_LISTENERS=PLAINTEXT://localhost:9092
      - KAFKA_LISTENER_SECURITY_PROTOCOL_MAP=CONTROLLER:PLAINTEXT,PLAINTEXT:PLAINTEXT
      - KAFKA_CONTROLLER_QUORUM_VOTERS=1@kafka:9093
      - KAFKA_CONTROLLER_LISTENER_NAMES=CONTROLLER

  ms3-mongo:
    image: mongo:6.0
    container_name: uce_trade_ms3_db
    ports:
      - "27017:27017"

  ms2-java:
    image: lizdaisy/ms2-product-command:prod
    container_name: ms2-java
    network_mode: "host"
    environment:
      - SPRING_DATASOURCE_USERNAME=${DB_USER}
      - SPRING_DATASOURCE_PASSWORD=${DB_PASSWORD}
      - SUPABASE_URL=${SUPA_URL}
      - SUPABASE_KEY=${SUPA_KEY}
    depends_on:
      - ms2-mysql
      - kafka

  ms3-go:
    image: lizdaisy/ms3-catalog-query:prod
    container_name: ms3-go
    network_mode: "host"
    environment:
      - MONGO_URI=mongodb://localhost:27017
      - MONGODB_URI=mongodb://localhost:27017
    depends_on:
      - ms3-mongo
      - kafka

volumes:
  ms2_db_data:
