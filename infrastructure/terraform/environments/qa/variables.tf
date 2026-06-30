# infrastructure/terraform/environments/qa/variables.tf

variable "docker_username" {
  description = "Docker Hub username"
  type        = string
  default     = "lizdaisy"
}

variable "key_name" {
  description = "EC2 Key Pair name"
  type        = string
  default     = "vockey"
}

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