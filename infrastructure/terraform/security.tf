# Security Group for the Bastion Host
resource "aws_security_group" "bastion_sg" {
  name        = "uce-trade-bastion-sg"
  description = "Permitir acceso SSH solo al Bastion"
  vpc_id      = aws_vpc.main_vpc.id

  # Inbound rule: Allow SSH (Port 22) from anywhere 
  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # Outbound rule: Allow the Bastion to connect to everything inside
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
  description = "Permitir trafico solo desde el Bastion y Load Balancers"
  vpc_id      = aws_vpc.main_vpc.id

  # The MS1 will be at the 8080. 
  ingress {
    from_port       = 8080
    to_port         = 8080
    protocol        = "tcp"
    security_groups = [aws_security_group.bastion_sg.id, aws_security_group.alb_sg.id] 
  }

  # Internal SSH from the bastion host to access and review logs
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