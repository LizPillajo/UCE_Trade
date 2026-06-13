# UCE Trade - Backend Ecosystem

## Overview
This repository houses the distributed backend system for UCE Trade, an entrepreneurship platform for university students. 

## Distributed Architecture Components
1.  **MS1 Identity and Access:** Handles security and user profiles (Spring Boot + PostgreSQL).
2.  **MS2 Product Command:** Manages creation and updates of ventures using event-driven architecture (Spring Boot + MySQL + Kafka).
3.  **MS3 Catalog Query:** Optimized read-model for fast querying and catalog exploration (Golang + MongoDB + Kafka).

## Infrastructure & CI/CD
* **Infrastructure as Code (IaC):** AWS environment provisioned using Terraform (VPC, ALB, ASG, RDS, EC2 Bastion).
* **Pipelines:** GitHub Actions automates testing, Docker image creation, and pushes to Docker Hub.