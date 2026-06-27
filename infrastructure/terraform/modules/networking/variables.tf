variable "vpc_cidr" {
  description = "CIDR block for the VPC"
  type        = string
  default     = "10.0.0.0/16"
}

variable "environment" {
  description = "Environment name (e.g. qa, prod)"
  type        = string
}

variable "project" {
  description = "Project name"
  type        = string
  default     = "UCE_Trade"
}
