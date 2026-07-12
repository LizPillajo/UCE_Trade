# Subnet Group
resource "aws_db_subnet_group" "main" {
  name       = "${lower(var.project)}-${var.environment}-db-subnet-group"
  subnet_ids = var.private_subnets

  tags = {
    Name        = "${var.project} DB Subnet Group"
    Environment = var.environment
  }
}

# SG for RDS
resource "aws_security_group" "rds_sg" {
  name        = "${var.project}-${var.environment}-rds-sg"
  description = "Allow database traffic"
  vpc_id      = var.vpc_id

  ingress {
    from_port       = 5432
    to_port         = 5432
    protocol        = "tcp"
    security_groups = [var.microservices_sg_id]
  }

  ingress {
    from_port       = 3306
    to_port         = 3306
    protocol        = "tcp"
    security_groups = [var.microservices_sg_id]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

# MS1 Postgres
resource "aws_db_instance" "ms1_postgres" {
  count                  = var.enable_db ? 1 : 0
  identifier              = "${replace(lower(var.project), "_", "-")}-${var.environment}-ms1-db"
  allocated_storage      = 20
  engine                 = "postgres"
  engine_version         = "15"
  instance_class         = var.db_instance_class
  db_name                = var.rds_snapshot_id == "" ? "uce_trade_ms1" : null
  username               = "postgres"
  password               = "root1234" # For student project only
  parameter_group_name   = "default.postgres15"
  skip_final_snapshot    = true # Changed to true for easier student destroy, otherwise final snapshot conflicts
  snapshot_identifier    = var.rds_snapshot_id != "" ? var.rds_snapshot_id : null
  vpc_security_group_ids = [aws_security_group.rds_sg.id]
  db_subnet_group_name   = aws_db_subnet_group.main.name
  publicly_accessible    = false
}

# MS2 MySQL
resource "aws_db_instance" "ms2_mysql" {
  count                  = var.enable_db ? 1 : 0
  identifier              = "${replace(lower(var.project), "_", "-")}-${var.environment}-ms2-db"
  allocated_storage      = 20
  engine                 = "mysql"
  engine_version         = "8.0"
  instance_class         = var.db_instance_class
  db_name                = var.rds_snapshot_id == "" ? "uce_trade_ms2" : null
  username               = "root"
  password               = "root1234"
  parameter_group_name   = "default.mysql8.0"
  skip_final_snapshot    = true
  snapshot_identifier    = var.rds_snapshot_id != "" ? var.rds_snapshot_id : null
  vpc_security_group_ids = [aws_security_group.rds_sg.id]
  db_subnet_group_name   = aws_db_subnet_group.main.name
  publicly_accessible    = false
}

# Cassandra SG
resource "aws_security_group" "cassandra_sg" {
  name        = "${var.project}-${var.environment}-cassandra-sg"
  description = "Allow Cassandra traffic"
  vpc_id      = var.vpc_id

  ingress {
    from_port       = 9042
    to_port         = 9042
    protocol        = "tcp"
    security_groups = [var.microservices_sg_id]
  }

  ingress {
    from_port       = 9092
    to_port         = 9092
    protocol        = "tcp"
    security_groups = [var.microservices_sg_id]
  }

  ingress {
    from_port       = 27017
    to_port         = 27017
    protocol        = "tcp"
    security_groups = [var.microservices_sg_id]
  }

  ingress {
    from_port       = 9200
    to_port         = 9200
    protocol        = "tcp"
    security_groups = [var.microservices_sg_id]
  }

  ingress {
    from_port       = 1883
    to_port         = 1883
    protocol        = "tcp"
    security_groups = [var.microservices_sg_id]
  }

  ingress {
    from_port       = 9001
    to_port         = 9001
    protocol        = "tcp"
    security_groups = [var.microservices_sg_id]
  }

  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port       = 3306
    to_port         = 3306
    protocol        = "tcp"
    security_groups = [var.microservices_sg_id]
  }

  ingress {
    from_port       = 5672
    to_port         = 5672
    protocol        = "tcp"
    security_groups = [var.microservices_sg_id]
  }

  ingress {
    from_port       = 5432
    to_port         = 5435
    protocol        = "tcp"
    security_groups = [var.microservices_sg_id]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

# Permanent EBS Volume for Cassandra
# This volume survives even if var.enable_db = false
resource "aws_ebs_volume" "cassandra_data" {
  availability_zone = "us-east-1a"
  size              = 10
  type              = "gp2"

  tags = {
    Name        = "${var.project}-${var.environment}-cassandra-data"
    Environment = var.environment
  }
}

# Get latest Amazon Linux 2 AMI
data "aws_ami" "amazon_linux" {
  most_recent = true
  owners      = ["amazon"]

  filter {
    name   = "name"
    values = ["al2023-ami-2023.*-x86_64"]
  }
}

# Cassandra EC2 Instance


resource "aws_volume_attachment" "cassandra_ebs_att" {
  count       = var.enable_db ? 1 : 0
  device_name = "/dev/sdf"
  volume_id   = aws_ebs_volume.cassandra_data.id
  instance_id = aws_instance.shared_dbs[0].id

  # Allow stopping instance without waiting for attachment destroy
  skip_destroy = true
}
