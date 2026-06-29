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
