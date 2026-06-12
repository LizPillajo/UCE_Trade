# Create a second private subnet 
resource "aws_subnet" "private_subnet_1b" {
  vpc_id            = aws_vpc.main_vpc.id
  cidr_block        = "10.0.11.0/24"
  availability_zone = "us-east-1b"

  tags = {
    Name = "uce-trade-private-1b"
  }
}

# Group the two private subnets for the database
resource "aws_db_subnet_group" "db_subnet_group" {
  name       = "uce-trade-db-subnet-group"
  subnet_ids = [aws_subnet.private_subnet_1a.id, aws_subnet.private_subnet_1b.id]

  tags = {
    Name = "UCE Trade DB Subnet Group"
  }
}

# Security Group for PostgreSQL
resource "aws_security_group" "rds_sg" {
  name        = "uce-trade-rds-sg"
  description = "Allow database traffic from microservices and the Bastion"
  vpc_id      = aws_vpc.main_vpc.id

  ingress {
    from_port       = 5432
    to_port         = 5432
    protocol        = "tcp"
    security_groups = [aws_security_group.microservices_sg.id, aws_security_group.bastion_sg.id]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "uce-trade-rds-sg"
  }
}

# PostgreSQL instance 
resource "aws_db_instance" "ms1_postgres" {
  identifier             = "uce-trade-ms1-db"
  allocated_storage      = 20
  engine                 = "postgres"
  engine_version         = "15" 
  instance_class         = "db.t3.micro"
  db_name                = var.rds_snapshot_id == "" ? "uce_trade_ms1" : null 
  username               = "postgres"
  password               = "root1234" 
  parameter_group_name   = "default.postgres15"
  skip_final_snapshot    = false 
  final_snapshot_identifier = "uce-trade-ms1-final-snapshot"  
  snapshot_identifier    = var.rds_snapshot_id != "" ? var.rds_snapshot_id : null
  vpc_security_group_ids = [aws_security_group.rds_sg.id]
  db_subnet_group_name   = aws_db_subnet_group.db_subnet_group.name

  tags = {
    Name = "MS1 Identity Database"
  }
}

# Output to obtain the connection URL at the end
output "rds_endpoint" {
  value       = aws_db_instance.ms1_postgres.endpoint
  description = "Endpoint de conexion a PostgreSQL"
}