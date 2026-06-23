# Security Group for the Bastion Host
resource "aws_security_group" "bastion_sg" {
  name        = "uce-trade-bastion-sg"
  description = "Allow SSH access to Bastion"
  vpc_id      = aws_vpc.main_vpc.id

  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "uce-trade-bastion-sg"
  }
}

# Security Group for Microservices
resource "aws_security_group" "microservices_sg" {
  name        = "uce-trade-microservices-sg"
  description = "Allow traffic only from Bastion and Load Balancers"
  vpc_id      = aws_vpc.main_vpc.id

  # Allow all microservice ports from ALB and Bastion (Ahora hasta el 8084 para el MS5)
  ingress {
    from_port       = 8000
    to_port         = 8084
    protocol        = "tcp"
    security_groups = [aws_security_group.bastion_sg.id, aws_security_group.alb_sg.id]
  }

  # SSH from Bastion
  ingress {
    from_port       = 22
    to_port         = 22
    protocol        = "tcp"
    security_groups = [aws_security_group.bastion_sg.id]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "uce-trade-microservices-sg"
  }
}