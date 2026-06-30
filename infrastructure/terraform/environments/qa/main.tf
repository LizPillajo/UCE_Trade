# infrastructure/terraform/environments/qa/main.tf

terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }

  backend "s3" {
    bucket  = "uce-trade-terraform-state-liz-qa"
    key     = "qa/terraform.tfstate"
    region  = "us-east-1"
    encrypt = true
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

# ✅ TODAS LAS VARIABLES ESTÁN EN variables.tf
# NO DECLARES VARIABLES AQUÍ

module "networking" {
  source      = "../../modules/networking"
  environment = "qa"
  vpc_cidr    = "10.0.0.0/16"
}

module "databases" {
  source                  = "../../modules/databases"
  environment             = "qa"
  project                 = "UCE_Trade"
  vpc_id                  = module.networking.vpc_id
  private_subnets         = [module.networking.private_subnet_1a_id, module.networking.private_subnet_1b_id]
  microservices_sg_id     = module.compute.microservices_sg_id
  enable_db               = true
  db_instance_class       = "db.t3.micro"
  cassandra_instance_type = "t2.micro"
  key_name                = var.key_name
  cassandra_public_subnet = module.networking.private_subnet_1a_id
}

module "compute" {
  source           = "../../modules/compute"
  environment      = "qa"
  project          = "UCE_Trade"
  vpc_id           = module.networking.vpc_id
  public_subnets   = [module.networking.public_subnet_1a_id, module.networking.public_subnet_1b_id]
  private_subnets  = [module.networking.private_subnet_1a_id, module.networking.private_subnet_1b_id]
  key_name         = var.key_name
  instance_type    = "t2.small"
  docker_username  = var.docker_username
  docker_tag       = "qa"
  desired_capacity = 1
  min_size         = 1
  max_size         = 2

  rds_ms1_endpoint = module.databases.rds_ms1_endpoint
  rds_ms1_username = module.databases.rds_ms1_username
  rds_ms1_password = module.databases.rds_ms1_password
  rds_ms2_endpoint = module.databases.rds_ms2_endpoint
  rds_ms2_username = module.databases.rds_ms2_username
  rds_ms2_password = module.databases.rds_ms2_password
  cassandra_ip     = module.databases.cassandra_ip

  redis_address          = module.databases.redis_endpoint
  kafka_brokers          = module.databases.kafka_brokers
  elasticsearch_endpoint = module.databases.elasticsearch_endpoint
  docdb_endpoint         = module.databases.mongodb_endpoint

  supabase_url    = var.supabase_url
  supabase_bucket = var.supabase_bucket
  supabase_key    = var.supabase_key
}

output "alb_dns_name" {
  value = module.compute.alb_dns_name
}

output "bastion_public_ip" {
  value = module.compute.bastion_public_ip
}

output "rds_ms1_endpoint" {
  value = module.databases.rds_ms1_endpoint
}

output "rds_ms2_endpoint" {
  value = module.databases.rds_ms2_endpoint
}

output "shared_dbs_ip" {
  value = module.databases.cassandra_ip
  description = "IP del servidor consolidado que corre Mongo, ES, Kafka y Cassandra"
}

output "redis_endpoint" {
  value = module.databases.redis_endpoint
}