output "rds_ms1_endpoint" {
  value = var.enable_db ? aws_db_instance.ms1_postgres[0].endpoint : ""
}

output "rds_ms1_username" {
  value = var.enable_db ? aws_db_instance.ms1_postgres[0].username : ""
}

output "rds_ms1_password" {
  value = var.enable_db ? aws_db_instance.ms1_postgres[0].password : ""
}

output "rds_ms2_endpoint" {
  value = var.enable_db ? aws_db_instance.ms2_mysql[0].endpoint : ""
}

output "rds_ms2_username" {
  value = var.enable_db ? aws_db_instance.ms2_mysql[0].username : ""
}

output "rds_ms2_password" {
  value = var.enable_db ? aws_db_instance.ms2_mysql[0].password : ""
}

output "cassandra_ip" {
  value = var.enable_db ? aws_instance.shared_dbs[0].private_ip : ""
}

output "kafka_brokers" {
  value = var.enable_db ? "${aws_instance.shared_dbs[0].private_ip}:9092" : ""
}

output "elasticsearch_endpoint" {
  value = var.enable_db ? aws_instance.shared_dbs[0].private_ip : ""
}

output "mongodb_endpoint" {
  value = var.enable_db ? aws_instance.shared_dbs[0].private_ip : ""
}

output "redis_endpoint" {
  value = var.enable_db ? aws_elasticache_cluster.redis[0].cache_nodes[0].address : ""
}

output "mariadb_endpoint" {
  value = var.enable_db ? aws_instance.shared_dbs[0].private_ip : ""
}

output "rabbitmq_endpoint" {
  value = var.enable_db ? aws_instance.shared_dbs[0].private_ip : ""
}

