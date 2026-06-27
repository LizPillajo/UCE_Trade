# ========================================
# REDIS (ElastiCache) - Para API Gateway
# ========================================
resource "aws_elasticache_subnet_group" "redis_subnet_group" {
  name       = "${replace(lower(var.project), "_", "-")}-${var.environment}-redis-subnet"
  subnet_ids = var.private_subnets
}

resource "aws_elasticache_cluster" "redis" {
  count                = var.enable_db ? 1 : 0
  cluster_id           = "${replace(lower(var.project), "_", "-")}-${var.environment}-redis"
  engine               = "redis"
  node_type            = "cache.t3.micro"
  num_cache_nodes      = 1
  parameter_group_name = "default.redis7"
  port                 = 6379
  subnet_group_name    = aws_elasticache_subnet_group.redis_subnet_group.name
  security_group_ids   = [var.microservices_sg_id]
}
