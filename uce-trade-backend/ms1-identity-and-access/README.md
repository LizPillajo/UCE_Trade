# MS1: Identity and Access Management

## Overview
This microservice handles user authentication, authorization, and profile management for the UCE Trade platform. It acts as the primary security gateway, validating Firebase OAuth tokens and persisting user roles in a relational database.

## Architecture
Developed using **Hexagonal Architecture** (Ports and Adapters) with **Spring Boot 3**.
* **Domain:** User entities and business rules.
* **Application:** Auth/Profile Use Cases (Services).
* **Infrastructure (Adapters):** * Input: REST Web Controllers.
    * Output: PostgreSQL via Spring Data JPA, Firebase Admin SDK integration.

## Key Endpoints
* `POST /api/v1/auth/login`: Validates Firebase token and returns user context.
* `GET /api/v1/users/{uid}`: Retrieves user profile details.
* `PUT /api/v1/users/{uid}`: Updates user academic/profile details.

## Environment Variables required
* `SPRING_DATASOURCE_URL`, `SPRING_DATASOURCE_USERNAME`, `SPRING_DATASOURCE_PASSWORD`
* `firebase-service-account.json` (Injected via CI/CD Secrets)