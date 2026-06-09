# 1. The ALB requires at least 2 public subnets in different zones. Creating the second one:
resource "aws_subnet" "public_subnet_1b" {
  vpc_id                  = aws_vpc.main_vpc.id
  cidr_block              = "10.0.2.0/24"
  availability_zone       = "us-east-1b"
  map_public_ip_on_launch = true

  tags = {
    Name = "uce-trade-public-1b"
  }
}

# Connect the new public subnet to the existing Internet Gateway
resource "aws_route_table_association" "public_1b_assoc" {
  subnet_id      = aws_subnet.public_subnet_1b.id
  route_table_id = aws_route_table.public_rt.id
}

# 2. Security Group for the Application Load Balancer (ALB)
resource "aws_security_group" "alb_sg" {
  name        = "uce-trade-alb-sg"
  description = "Allow public HTTP traffic to the backend"
  vpc_id      = aws_vpc.main_vpc.id

  ingress {
    from_port   = 80
    to_port     = 80
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
    Name = "uce-trade-alb-sg"
  }
}

# Allow the ALB to communicate with instances in the private subnet
resource "aws_security_group_rule" "allow_alb_to_ms" {
  type                     = "ingress"
  from_port                = 8080
  to_port                  = 8080
  protocol                 = "tcp"
  security_group_id        = aws_security_group.microservices_sg.id
  source_security_group_id = aws_security_group.alb_sg.id
}

# 3. The Application Load Balancer
resource "aws_lb" "ms1_alb" {
  name               = "uce-trade-ms1-alb"
  internal           = false
  load_balancer_type = "application"
  security_groups    = [aws_security_group.alb_sg.id]
  subnets            = [aws_subnet.public_subnet_1a.id, aws_subnet.public_subnet_1b.id]

  tags = {
    Name = "uce-trade-ms1-alb"
  }
}

# Target Group pointing to port 8080 of the containers
resource "aws_lb_target_group" "ms1_tg" {
  name        = "uce-trade-ms1-tg"
  port        = 8080
  protocol    = "HTTP"
  vpc_id      = aws_vpc.main_vpc.id
  target_type = "instance"

  health_check {
    path                = "/api/v1/swagger-ui/index.html" 
    port                = "8080"
    healthy_threshold   = 3
    unhealthy_threshold = 3
    timeout             = 5
    interval            = 30
    matcher             = "200"
  }

}

# ALB Listener on port 80
resource "aws_lb_listener" "ms1_listener" {
  load_balancer_arn = aws_lb.ms1_alb.arn
  port              = "80"
  protocol          = "HTTP"

  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.ms1_tg.arn
  }
}

# 4. Launch Template with automated Docker script
resource "aws_launch_template" "ms1_lt" {
  name_prefix   = "uce-trade-ms1-template-"
  image_id      = data.aws_ami.amazon_linux.id
  instance_type = "t2.micro"
  key_name      = "vockey"

  network_interfaces {
    associate_public_ip_address = false # Completely private and inaccessible from the internet
    security_groups             = [aws_security_group.microservices_sg.id]
  }

  # Automation script: Installs Docker, downloads your image, and runs it connecting to RDS
  user_data = base64encode(<<-EOF
              #!/bin/bash
              sudo dnf update -y
              sudo dnf install -y docker
              sudo systemctl start docker
              sudo systemctl enable docker
              
              # Run the MS1 container injecting the DB credentials created by Terraform
              sudo docker run -d -p 8080:8080 \
                -e SPRING_DATASOURCE_URL=jdbc:postgresql://${aws_db_instance.ms1_postgres.endpoint}/${aws_db_instance.ms1_postgres.db_name} \
                -e SPRING_DATASOURCE_USERNAME=${aws_db_instance.ms1_postgres.username} \
                -e SPRING_DATASOURCE_PASSWORD=root1234 \
                lizpillajo/ms1-identity-and-access:qa
              EOF
  )

  lifecycle {
    create_before_destroy = true
  }
}

# 5. Auto Scaling Group configured for the QA environment (1 fixed instance)
resource "aws_autoscaling_group" "ms1_asg" {
  name_prefix         = "uce-trade-ms1-asg-"
  desired_capacity    = 1 # Setting for the QA environment
  max_size            = 1
  min_size            = 1
  target_group_arns   = [aws_lb_target_group.ms1_tg.arn]
  vpc_zone_identifier = [aws_subnet.private_subnet_1a.id, aws_subnet.private_subnet_1b.id]

  launch_template {
    id      = aws_launch_template.ms1_lt.id
    version = "$Latest"
  }

  # Instance refresh moved INSIDE the autoscaling group
  instance_refresh {
    strategy = "Rolling"
    preferences {
      min_healthy_percentage = 0 # For a 1-instance QA environment, allow 0 during replacement
    }
    triggers = ["tag"]
  }

  lifecycle {
    create_before_destroy = true
  }
}

# Final Public URL to connect from Postman or the React Frontend
output "alb_dns_name" {
  value       = aws_lb.ms1_alb.dns_name
  description = "Public URL of the Load Balancer to access the Microservice"
}