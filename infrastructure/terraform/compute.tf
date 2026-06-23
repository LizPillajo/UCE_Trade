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

  ingress {
    from_port   = 8000
    to_port     = 8000
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

# 3. The Application Load Balancer
resource "aws_lb" "main_alb" {
  name               = "uce-trade-main-alb"
  internal           = false
  load_balancer_type = "application"
  security_groups    = [aws_security_group.alb_sg.id]
  subnets            = [aws_subnet.public_subnet_1a.id, aws_subnet.public_subnet_1b.id]

  tags = {
    Name = "uce-trade-main-alb"
  }
}

# Target Group for API Gateway (port 8000)
resource "aws_lb_target_group" "gateway_tg" {
  name        = "uce-trade-gateway-tg"
  port        = 8000
  protocol    = "HTTP"
  vpc_id      = aws_vpc.main_vpc.id
  target_type = "instance"

  health_check {
    path                = "/actuator/health"
    port                = "8000"
    healthy_threshold   = 3
    unhealthy_threshold = 3
    timeout             = 5
    interval            = 30
    matcher             = "200"
  }
}

# ALB Listener on port 80
resource "aws_lb_listener" "main_listener" {
  load_balancer_arn = aws_lb.main_alb.arn
  port              = "80"
  protocol          = "HTTP"

  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.gateway_tg.arn
  }
}

# 4. Launch Template for API Gateway
resource "aws_launch_template" "gateway_lt" {
  name_prefix   = "uce-trade-gateway-template-"
  image_id      = data.aws_ami.amazon_linux.id
  instance_type = var.instance_type
  key_name      = var.key_name

  network_interfaces {
    associate_public_ip_address = false
    security_groups             = [aws_security_group.microservices_sg.id]
  }

  user_data = base64encode(<<-EOF
    #!/bin/bash
    sudo dnf update -y
    sudo dnf install -y docker
    sudo systemctl start docker
    sudo systemctl enable docker

    sudo docker run -d --restart always -p 8000:8000 \
      -e SPRING_REDIS_HOST=${aws_elasticache_cluster.redis.cache_nodes[0].address} \
      ${var.docker_username}/ms0-api-gateway:qa
  EOF
  )

  lifecycle {
    create_before_destroy = true
  }
}

# 5. Launch Template for MS1 Identity
resource "aws_launch_template" "ms1_lt" {
  name_prefix   = "uce-trade-ms1-template-"
  image_id      = data.aws_ami.amazon_linux.id
  instance_type = var.instance_type
  key_name      = var.key_name

  network_interfaces {
    associate_public_ip_address = false
    security_groups             = [aws_security_group.microservices_sg.id]
  }

  user_data = base64encode(<<-EOF
    #!/bin/bash
    sudo dnf update -y
    sudo dnf install -y docker
    sudo systemctl start docker
    sudo systemctl enable docker

    sudo docker run -d --restart always -p 8080:8080 \
      -e SPRING_DATASOURCE_URL=jdbc:postgresql://${aws_db_instance.ms1_postgres.endpoint}/uce_trade_ms1 \
      -e SPRING_DATASOURCE_USERNAME=${aws_db_instance.ms1_postgres.username} \
      -e SPRING_DATASOURCE_PASSWORD=${aws_db_instance.ms1_postgres.password} \
      ${var.docker_username}/ms1-identity-and-access:qa
  EOF
  )

  lifecycle {
    create_before_destroy = true
  }
}

# 6. Launch Template for MS2 Product Command
resource "aws_launch_template" "ms2_lt" {
  name_prefix   = "uce-trade-ms2-template-"
  image_id      = data.aws_ami.amazon_linux.id
  instance_type = var.instance_type
  key_name      = var.key_name

  network_interfaces {
    associate_public_ip_address = false
    security_groups             = [aws_security_group.microservices_sg.id]
  }

  user_data = base64encode(<<-EOF
    #!/bin/bash
    sudo dnf update -y
    sudo dnf install -y docker
    sudo systemctl start docker
    sudo systemctl enable docker

    sudo docker run -d --restart always -p 8081:8081 \
      -e SPRING_DATASOURCE_URL=jdbc:mysql://${aws_db_instance.ms2_mysql.endpoint}/uce_trade_ms2 \
      -e SPRING_DATASOURCE_USERNAME=${aws_db_instance.ms2_mysql.username} \
      -e SPRING_DATASOURCE_PASSWORD=${aws_db_instance.ms2_mysql.password} \
      -e SPRING_KAFKA_BOOTSTRAP_SERVERS=${aws_msk_cluster.kafka_cluster.bootstrap_brokers} \
      ${var.docker_username}/ms2-product-command:qa
  EOF
  )

  lifecycle {
    create_before_destroy = true
  }
}

# 7. Launch Template for MS3 Catalog Query
resource "aws_launch_template" "ms3_lt" {
  name_prefix   = "uce-trade-ms3-template-"
  image_id      = data.aws_ami.amazon_linux.id
  instance_type = var.instance_type
  key_name      = var.key_name

  network_interfaces {
    associate_public_ip_address = false
    security_groups             = [aws_security_group.microservices_sg.id]
  }

  user_data = base64encode(<<-EOF
    #!/bin/bash
    sudo dnf update -y
    sudo dnf install -y docker
    sudo systemctl start docker
    sudo systemctl enable docker

    sudo docker run -d --restart always -p 8082:8082 \
      -e MONGO_URI=mongodb://${aws_docdb_cluster.mongodb_cluster.endpoint}:27017 \
      -e KAFKA_BROKERS=${aws_msk_cluster.kafka_cluster.bootstrap_brokers} \
      ${var.docker_username}/ms3-catalog-query:qa
  EOF
  )

  lifecycle {
    create_before_destroy = true
  }
}

# 8. Launch Template for MS4 Search Discovery
resource "aws_launch_template" "ms4_lt" {
  name_prefix   = "uce-trade-ms4-template-"
  image_id      = data.aws_ami.amazon_linux.id
  instance_type = var.instance_type
  key_name      = var.key_name

  network_interfaces {
    associate_public_ip_address = false
    security_groups             = [aws_security_group.microservices_sg.id]
  }

  user_data = base64encode(<<-EOF
    #!/bin/bash
    sudo dnf update -y
    sudo dnf install -y docker
    sudo systemctl start docker
    sudo systemctl enable docker

    sudo docker run -d --restart always -p 8083:8083 \
      -e ES_HOSTS=http://${aws_elasticsearch_domain.es_cluster.endpoint}:9200 \
      -e KAFKA_BROKERS=${aws_msk_cluster.kafka_cluster.bootstrap_brokers} \
      ${var.docker_username}/ms4-search-discovery:qa
  EOF
  )

  lifecycle {
    create_before_destroy = true
  }
}

# 9. Auto Scaling Group for API Gateway
resource "aws_autoscaling_group" "gateway_asg" {
  name_prefix         = "uce-trade-gateway-asg-"
  desired_capacity    = 1
  max_size            = 1
  min_size            = 1
  target_group_arns   = [aws_lb_target_group.gateway_tg.arn]
  vpc_zone_identifier = [aws_subnet.private_subnet_1a.id, aws_subnet.private_subnet_1b.id]

  launch_template {
    id      = aws_launch_template.gateway_lt.id
    version = "$Latest"
  }

  instance_refresh {
    strategy = "Rolling"
    preferences {
      min_healthy_percentage = 0
    }
    triggers = ["tag"]
  }

  lifecycle {
    create_before_destroy = true
  }
}

# 10. Auto Scaling Group for MS1
resource "aws_autoscaling_group" "ms1_asg" {
  name_prefix         = "uce-trade-ms1-asg-"
  desired_capacity    = 1
  max_size            = 1
  min_size            = 1
  vpc_zone_identifier = [aws_subnet.private_subnet_1a.id, aws_subnet.private_subnet_1b.id]

  launch_template {
    id      = aws_launch_template.ms1_lt.id
    version = "$Latest"
  }

  instance_refresh {
    strategy = "Rolling"
    preferences {
      min_healthy_percentage = 0
    }
    triggers = ["tag"]
  }

  lifecycle {
    create_before_destroy = true
  }
}

# 11. Auto Scaling Group for MS2
resource "aws_autoscaling_group" "ms2_asg" {
  name_prefix         = "uce-trade-ms2-asg-"
  desired_capacity    = 1
  max_size            = 1
  min_size            = 1
  vpc_zone_identifier = [aws_subnet.private_subnet_1a.id, aws_subnet.private_subnet_1b.id]

  launch_template {
    id      = aws_launch_template.ms2_lt.id
    version = "$Latest"
  }

  instance_refresh {
    strategy = "Rolling"
    preferences {
      min_healthy_percentage = 0
    }
    triggers = ["tag"]
  }

  lifecycle {
    create_before_destroy = true
  }
}

# 12. Auto Scaling Group for MS3
resource "aws_autoscaling_group" "ms3_asg" {
  name_prefix         = "uce-trade-ms3-asg-"
  desired_capacity    = 1
  max_size            = 1
  min_size            = 1
  vpc_zone_identifier = [aws_subnet.private_subnet_1a.id, aws_subnet.private_subnet_1b.id]

  launch_template {
    id      = aws_launch_template.ms3_lt.id
    version = "$Latest"
  }

  instance_refresh {
    strategy = "Rolling"
    preferences {
      min_healthy_percentage = 0
    }
    triggers = ["tag"]
  }

  lifecycle {
    create_before_destroy = true
  }
}

# 13. Auto Scaling Group for MS4
resource "aws_autoscaling_group" "ms4_asg" {
  name_prefix         = "uce-trade-ms4-asg-"
  desired_capacity    = 1
  max_size            = 1
  min_size            = 1
  vpc_zone_identifier = [aws_subnet.private_subnet_1a.id, aws_subnet.private_subnet_1b.id]

  launch_template {
    id      = aws_launch_template.ms4_lt.id
    version = "$Latest"
  }

  instance_refresh {
    strategy = "Rolling"
    preferences {
      min_healthy_percentage = 0
    }
    triggers = ["tag"]
  }

  lifecycle {
    create_before_destroy = true
  }
}

# Final Public URL
output "alb_dns_name" {
  value       = aws_lb.main_alb.dns_name
  description = "Public URL of the Load Balancer"
}