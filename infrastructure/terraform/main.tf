terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }

  # Configuring the S3 bucket for the .tfstate file
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
  description = "RDS snapshot ID for restoring the data. Leave this blank if this is your first time."
}