terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }

  backend "s3" {
    bucket         = "uce-trade-terraform-state-liz"
    key            = "global/s3/terraform.tfstate"
    region         = "us-east-1"
    encrypt        = true
  }
}

provider "aws" {
  region = "us-east-1"

  default_tags {
    tags = {
      Project     = "UCE_Trade"
      Environment = "QA"
      ManagedBy   = "Terraform"
    }
  }
}

variable "rds_snapshot_id" {
  type        = string
  default     = ""
  description = "RDS snapshot ID for restoring the data. Leave blank for first time"
}

# NUEVA VARIABLE PARA KEY PAIR
variable "key_name" {
  type        = string
  default     = "vockey"
  description = "EC2 Key Pair name for SSH access"
}

# NUEVA VARIABLE PARA INSTANCE TYPE
variable "instance_type" {
  type        = string
  default     = "t3.medium"
  description = "EC2 instance type for microservices"
}

# NUEVA VARIABLE PARA DOCKER USERNAME
variable "docker_username" {
  type        = string
  default     = "lizdaisy"
  description = "Docker Hub username"
}