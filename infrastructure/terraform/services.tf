# ========================================
# 1. MONGODB (DocumentDB) - Para MS3
# ========================================
resource "aws_docdb_cluster" "mongodb_cluster" {
  cluster_identifier      = "uce-trade-mongodb"
  engine                  = "docdb"
  master_username         = "admin"
  master_password         = "docdb1234"
  backup_retention_period = 1
  preferred_backup_window = "07:00-09:00"
  skip_final_snapshot     = true
  db_subnet_group_name    = aws_db_subnet_group.db_subnet_group.name
  vpc_security_group_ids  = [aws_security_group.microservices_sg.id]
}

resource "aws_docdb_cluster_instance" "mongodb_instance" {
  cluster_identifier = aws_docdb_cluster.mongodb_cluster.id
  instance_class     = "db.t4g.medium"
}

# ========================================
# 2. ELASTICSEARCH - Para MS4
# ========================================
resource "aws_elasticsearch_domain" "es_cluster" {
  domain_name           = "uce-trade-es"
  elasticsearch_version = "7.10"

  cluster_config {
    instance_type  = "t3.medium.elasticsearch"
    instance_count = 1
  }

  ebs_options {
    ebs_enabled = true
    volume_size = 10
  }

  vpc_options {
    subnet_ids         = [aws_subnet.private_subnet_1a.id, aws_subnet.private_subnet_1b.id]
    security_group_ids = [aws_security_group.microservices_sg.id]
  }

  encrypt_at_rest {
    enabled = true
  }

  tags = {
    Name = "uce-trade-elasticsearch"
  }
}

# ========================================
# 3. KAFKA (Amazon MSK) - Para todos los MS
# ========================================
resource "aws_msk_cluster" "kafka_cluster" {
  cluster_name           = "uce-trade-kafka"
  kafka_version          = "2.8.1"
  number_of_broker_nodes = 2

  broker_node_group_info {
    instance_type   = "kafka.t3.small"
    client_subnets  = [aws_subnet.private_subnet_1a.id, aws_subnet.private_subnet_1b.id]
    security_groups = [aws_security_group.microservices_sg.id]

    storage_info {
      ebs_storage_info {
        volume_size = 10
      }
    }
  }

  encryption_info {
    encryption_in_transit {
      client_broker = "PLAINTEXT"
      in_cluster    = true
    }
  }

  tags = {
    Name = "uce-trade-kafka"
  }
}

# ========================================
# 4. REDIS (ElastiCache) - Para API Gateway
# ========================================
resource "aws_elasticache_cluster" "redis" {
  cluster_id           = "uce-trade-redis"
  engine               = "redis"
  node_type            = "cache.t3.micro"
  num_cache_nodes      = 1
  parameter_group_name = "default.redis7"
  port                 = 6379
  subnet_group_name    = aws_elasticache_subnet_group.redis_subnet_group.name
  security_group_ids   = [aws_security_group.microservices_sg.id]
}

resource "aws_elasticache_subnet_group" "redis_subnet_group" {
  name       = "uce-trade-redis-subnet"
  subnet_ids = [aws_subnet.private_subnet_1a.id, aws_subnet.private_subnet_1b.id]
}

# ========================================
# OUTPUTS - URLs para configurar
# ========================================
output "kafka_brokers" {
  value       = aws_msk_cluster.kafka_cluster.bootstrap_brokers
  description = "Kafka bootstrap brokers"
}

output "elasticsearch_endpoint" {
  value       = aws_elasticsearch_domain.es_cluster.endpoint
  description = "Elasticsearch endpoint"
}

output "mongodb_endpoint" {
  value       = aws_docdb_cluster.mongodb_cluster.endpoint
  description = "MongoDB endpoint"
}

output "redis_endpoint" {
  value       = aws_elasticache_cluster.redis.cache_nodes[0].address
  description = "Redis endpoint"
}