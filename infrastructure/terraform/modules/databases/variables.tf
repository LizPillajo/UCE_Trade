variable "vpc_id" {
  description = "VPC ID"
  type        = string
}

variable "private_subnets" {
  description = "Private subnets for DBs"
  type        = list(string)
}

variable "microservices_sg_id" {
  description = "Microservices SG to allow traffic from"
  type        = string
}

variable "environment" {
  description = "Environment name"
  type        = string
}

variable "project" {
  description = "Project name"
  type        = string
}

variable "enable_db" {
  description = "Enable databases (set to false to sleep databases)"
  type        = bool
  default     = true
}

variable "rds_snapshot_id" {
  description = "Snapshot ID to restore from"
  type        = string
  default     = ""
}

variable "db_instance_class" {
  description = "Instance class for RDS"
  type        = string
  default     = "db.t3.micro"
}

variable "key_name" {
  description = "Key pair for EC2 (Cassandra)"
  type        = string
}

variable "cassandra_instance_type" {
  description = "Instance type for Cassandra"
  type        = string
  default     = "t3.medium"
}

variable "cassandra_public_subnet" {
  description = "Subnet for Cassandra (using one of the private subnets)"
  type        = string
}
