variable "vpc_id" {
  description = "VPC ID"
  type        = string
}

variable "public_subnets" {
  description = "List of public subnet IDs"
  type        = list(string)
}

variable "private_subnets" {
  description = "List of private subnet IDs"
  type        = list(string)
}

variable "environment" {
  description = "Environment name"
  type        = string
}

variable "project" {
  description = "Project name"
  type        = string
  default     = "UCE_Trade"
}

variable "key_name" {
  description = "EC2 Key Pair name"
  type        = string
}

variable "instance_type" {
  description = "EC2 instance type"
  type        = string
}

variable "docker_username" {
  description = "Docker Hub username"
  type        = string
}

variable "docker_tag" {
  description = "Docker image tag"
  type        = string
}

variable "desired_capacity" {
  description = "Desired capacity for ASGs"
  type        = number
}

variable "min_size" {
  description = "Minimum size for ASGs"
  type        = number
}

variable "max_size" {
  description = "Maximum size for ASGs"
  type        = number
}

variable "rds_ms1_endpoint" {
  description = "Endpoint for MS1 RDS"
  type        = string
  default     = ""
}

variable "rds_ms1_username" {
  description = "Username for MS1 RDS"
  type        = string
  default     = ""
}

variable "rds_ms1_password" {
  description = "Password for MS1 RDS"
  type        = string
  default     = ""
}

variable "rds_ms2_endpoint" {
  description = "Endpoint for MS2 RDS"
  type        = string
  default     = ""
}

variable "rds_ms2_username" {
  description = "Username for MS2 RDS"
  type        = string
  default     = ""
}

variable "rds_ms2_password" {
  description = "Password for MS2 RDS"
  type        = string
  default     = ""
}

variable "cassandra_ip" {
  description = "IP address of Cassandra node"
  type        = string
  default     = ""
}

variable "redis_address" {
  description = "Redis address"
  type        = string
  default     = ""
}

variable "kafka_brokers" {
  description = "Kafka brokers address"
  type        = string
  default     = ""
}

variable "elasticsearch_endpoint" {
  description = "ElasticSearch endpoint"
  type        = string
  default     = ""
}

variable "docdb_endpoint" {
  description = "DocumentDB endpoint"
  type        = string
  default     = ""
}
