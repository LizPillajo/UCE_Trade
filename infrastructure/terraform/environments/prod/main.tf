terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }

  backend "s3" {
    bucket  = "uce-trade-terraform-state-liz-prod"
    key     = "prod/terraform.tfstate"
    region  = "us-east-1"
    encrypt = true
  }
}

provider "aws" {
  region = "us-east-1"
  # Cuenta 2: Produccion
  # access_key = var.aws_access_key
  # secret_key = var.aws_secret_key

  default_tags {
    tags = {
      Project     = "UCE_Trade"
      Environment = "PROD"
      ManagedBy   = "Terraform"
    }
  }
}

variable "docker_username" { default = "lizdaisy" }
variable "key_name" { default = "vockey" }

# ✅ FIX: Variables de entorno para Supabase (leer desde secrets)
variable "supabase_url" {
  description = "Supabase API URL"
  type        = string
}

variable "supabase_bucket" {
  description = "Supabase Storage Bucket Name"
  type        = string
}

variable "supabase_key" {
  description = "Supabase Service Role Key"
  type        = string
  sensitive   = true
}

variable "stripe_secret_key" {
  description = "Stripe Secret Key"
  type        = string
  sensitive   = true
}

# MODO AHORRO (DORMIR PRODUCCION):
# Cambia desired_capacity = 0 y enable_db = false
variable "desired_capacity" { default = 0 } # 0 para apagar, 2 para redundancia
variable "enable_db" { default = true }     # false para apagar bases de datos


module "networking" {
  source      = "../../modules/networking"
  environment = "prod"
  vpc_cidr    = "10.1.0.0/16"
}

module "databases" {
  source              = "../../modules/databases"
  environment         = "prod"
  project             = "UCE_Trade"
  vpc_id              = module.networking.vpc_id
  private_subnets     = [module.networking.private_subnet_1a_id, module.networking.private_subnet_1b_id]
  microservices_sg_id = module.compute.microservices_sg_id

  # Aqui controlamos si la base de datos se crea o se detiene
  enable_db = var.enable_db

  db_instance_class       = "db.t3.micro"
  cassandra_instance_type = "t2.micro"
  key_name                = var.key_name
  cassandra_public_subnet = module.networking.private_subnet_1a_id
}

module "compute" {
  source          = "../../modules/compute"
  environment     = "prod"
  vpc_id          = module.networking.vpc_id
  public_subnets  = [module.networking.public_subnet_1a_id, module.networking.public_subnet_1b_id]
  private_subnets = [module.networking.private_subnet_1a_id, module.networking.private_subnet_1b_id]
  key_name        = var.key_name
  instance_type   = "t2.small"
  docker_username = var.docker_username
  docker_tag      = "prod"

  # Aqui controlamos si los microservicios se apagan
  desired_capacity = var.desired_capacity
  min_size         = var.desired_capacity == 0 ? 0 : 2
  max_size         = 4

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
  stripe_secret_key = var.stripe_secret_key
  mariadb_endpoint  = module.databases.mariadb_endpoint
  rabbitmq_endpoint = module.databases.rabbitmq_endpoint
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
