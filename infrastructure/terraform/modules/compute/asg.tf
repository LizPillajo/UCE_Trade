# Launch Templates and ASGs

# MS0: API Gateway
resource "aws_launch_template" "gateway_lt" {
  name_prefix   = "${var.project}-${var.environment}-gw-lt-"
  image_id      = data.aws_ami.amazon_linux.id
  instance_type = var.instance_type
  key_name      = var.key_name

  network_interfaces {
    associate_public_ip_address = false
    security_groups             = [aws_security_group.microservices_sg.id]
  }

  iam_instance_profile {
    name = "LabInstanceProfile"
  }

  user_data = base64encode(<<-EOF
    #!/bin/bash
    sudo dnf update -y
    sudo dnf install -y docker
    sudo systemctl start docker
    sudo systemctl enable docker

    # Función para esperar y obtener IPs de forma segura
    get_ip() {
      local asg_pattern=$1
      local ip=""
      local retries=0
      # Intenta hasta 30 veces (aprox 5 minutos)
      while [ -z "$ip" ] && [ $retries -lt 30 ]; do
        ip=$(aws ec2 describe-instances --region us-east-1 --filters "Name=tag:aws:autoscaling:groupName,Values=$asg_pattern" "Name=instance-state-name,Values=running" --query "Reservations[*].Instances[*].PrivateIpAddress" --output text | tr '\t' '\n' | head -n 1)
        if [ -z "$ip" ]; then
          sleep 10
          retries=$((retries+1))
        fi
      done
      echo "$${ip:-localhost}"
    }

    echo "Buscando IPs de los microservicios..."
    MS1_IP=$(get_ip "${var.project}-${var.environment}-ms1-asg*")
    MS2_IP=$(get_ip "${var.project}-${var.environment}-ms2-asg*")
    MS3_IP=$(get_ip "${var.project}-${var.environment}-ms3-asg*")
    MS4_IP=$(get_ip "${var.project}-${var.environment}-ms4-asg*")
    MS5_IP=$(get_ip "${var.project}-${var.environment}-ms5-asg*")

    sudo docker run -d --restart always -p 8000:8000 \
      -e REDIS_HOST=${var.redis_address} \
      -e MS1_URI=http://$MS1_IP:8080 \
      -e MS2_URI=http://$MS2_IP:8081 \
      -e MS3_URI=http://$MS3_IP:8082 \
      -e MS4_URI=http://$MS4_IP:8083 \
      -e MS5_URI=http://$MS5_IP:8084 \
      ${var.docker_username}/ms0-api-gateway:${var.docker_tag}
  EOF
  )

  lifecycle {
    create_before_destroy = true
  }
}

resource "aws_autoscaling_group" "gateway_asg" {
  name_prefix         = "${var.project}-${var.environment}-gw-asg-"
  desired_capacity    = var.desired_capacity
  max_size            = var.max_size
  min_size            = var.min_size
  target_group_arns   = [aws_lb_target_group.gateway_tg.arn]
  vpc_zone_identifier = var.private_subnets

  launch_template {
    id      = aws_launch_template.gateway_lt.id
    version = "$Latest"
  }

  instance_refresh {
    strategy = "Rolling"
    preferences {
      min_healthy_percentage = 0
    }
  }

  lifecycle {
    create_before_destroy = true
  }
}

# MS1: Identity
resource "aws_launch_template" "ms1_lt" {
  name_prefix   = "${var.project}-${var.environment}-ms1-lt-"
  image_id      = data.aws_ami.amazon_linux.id
  instance_type = var.instance_type
  key_name      = var.key_name

  network_interfaces {
    associate_public_ip_address = false
    security_groups             = [aws_security_group.microservices_sg.id]
  }

  iam_instance_profile {
    name = "LabInstanceProfile"
  }

  user_data = base64encode(<<-EOF
    #!/bin/bash
    sudo dnf update -y
    sudo dnf install -y docker
    sudo systemctl start docker
    sudo systemctl enable docker

    sudo docker run -d --restart always -p 8080:8080 \
      -e SPRING_DATASOURCE_URL=jdbc:postgresql://${var.rds_ms1_endpoint}/uce_trade_ms1 \
      -e SPRING_DATASOURCE_USERNAME=${var.rds_ms1_username} \
      -e SPRING_DATASOURCE_PASSWORD=${var.rds_ms1_password} \
      ${var.docker_username}/ms1-identity-and-access:${var.docker_tag}
  EOF
  )

  lifecycle {
    create_before_destroy = true
  }
}

resource "aws_autoscaling_group" "ms1_asg" {
  name_prefix         = "${var.project}-${var.environment}-ms1-asg-"
  desired_capacity    = var.desired_capacity
  max_size            = var.max_size
  min_size            = var.min_size
  vpc_zone_identifier = var.private_subnets

  launch_template {
    id      = aws_launch_template.ms1_lt.id
    version = "$Latest"
  }

  instance_refresh {
    strategy = "Rolling"
    preferences {
      min_healthy_percentage = 0
    }
  }
}

# MS2: Product Command
resource "aws_launch_template" "ms2_lt" {
  name_prefix   = "${var.project}-${var.environment}-ms2-lt-"
  image_id      = data.aws_ami.amazon_linux.id
  instance_type = var.instance_type
  key_name      = var.key_name

  network_interfaces {
    associate_public_ip_address = false
    security_groups             = [aws_security_group.microservices_sg.id]
  }

  iam_instance_profile {
    name = "LabInstanceProfile"
  }

  user_data = base64encode(<<-EOF
    #!/bin/bash
    sudo dnf update -y
    sudo dnf install -y docker
    sudo systemctl start docker
    sudo systemctl enable docker

    sudo docker run -d --restart always -p 8081:8081 \
      -e SPRING_DATASOURCE_URL=jdbc:mysql://${var.rds_ms2_endpoint}/uce_trade_ms2 \
      -e SPRING_DATASOURCE_USERNAME=${var.rds_ms2_username} \
      -e SPRING_DATASOURCE_PASSWORD=${var.rds_ms2_password} \
      -e SPRING_KAFKA_BOOTSTRAP_SERVERS=${var.kafka_brokers} \
      -e SUPABASE_URL=${var.supabase_url} \
      -e SUPABASE_BUCKET=${var.supabase_bucket} \
      -e SUPABASE_KEY=${var.supabase_key} \
      ${var.docker_username}/ms2-product-command:${var.docker_tag}
  EOF
  )
}

resource "aws_autoscaling_group" "ms2_asg" {
  name_prefix         = "${var.project}-${var.environment}-ms2-asg-"
  desired_capacity    = var.desired_capacity
  max_size            = var.max_size
  min_size            = var.min_size
  vpc_zone_identifier = var.private_subnets

  launch_template {
    id      = aws_launch_template.ms2_lt.id
    version = "$Latest"
  }

  instance_refresh {
    strategy = "Rolling"
    preferences {
      min_healthy_percentage = 0
    }
  }
}

# MS3: Catalog Query
resource "aws_launch_template" "ms3_lt" {
  name_prefix   = "${var.project}-${var.environment}-ms3-lt-"
  image_id      = data.aws_ami.amazon_linux.id
  instance_type = var.instance_type
  key_name      = var.key_name

  network_interfaces {
    associate_public_ip_address = false
    security_groups             = [aws_security_group.microservices_sg.id]
  }

  iam_instance_profile {
    name = "LabInstanceProfile"
  }

  user_data = base64encode(<<-EOF
    #!/bin/bash
    sudo dnf update -y
    sudo dnf install -y docker
    sudo systemctl start docker
    sudo systemctl enable docker

    sudo docker run -d --restart always -p 8082:8082 \
      -e MONGO_URI=mongodb://${var.docdb_endpoint}:27017 \
      -e KAFKA_BROKERS=${var.kafka_brokers} \
      ${var.docker_username}/ms3-catalog-query:${var.docker_tag}
  EOF
  )
}

resource "aws_autoscaling_group" "ms3_asg" {
  name_prefix         = "${var.project}-${var.environment}-ms3-asg-"
  desired_capacity    = var.desired_capacity
  max_size            = var.max_size
  min_size            = var.min_size
  vpc_zone_identifier = var.private_subnets

  launch_template {
    id      = aws_launch_template.ms3_lt.id
    version = "$Latest"
  }

  instance_refresh {
    strategy = "Rolling"
    preferences {
      min_healthy_percentage = 0
    }
  }
}

# MS4: Search Discovery
resource "aws_launch_template" "ms4_lt" {
  name_prefix   = "${var.project}-${var.environment}-ms4-lt-"
  image_id      = data.aws_ami.amazon_linux.id
  instance_type = var.instance_type
  key_name      = var.key_name

  network_interfaces {
    associate_public_ip_address = false
    security_groups             = [aws_security_group.microservices_sg.id]
  }

  iam_instance_profile {
    name = "LabInstanceProfile"
  }

  user_data = base64encode(<<-EOF
    #!/bin/bash
    sudo dnf update -y
    sudo dnf install -y docker
    sudo systemctl start docker
    sudo systemctl enable docker

    # Función para esperar y obtener IPs de forma segura
    get_ip() {
      local asg_pattern=$1
      local ip=""
      local retries=0
      # Intenta hasta 30 veces (aprox 5 minutos)
      while [ -z "$ip" ] && [ $retries -lt 30 ]; do
        ip=$(aws ec2 describe-instances --region us-east-1 --filters "Name=tag:aws:autoscaling:groupName,Values=$asg_pattern" "Name=instance-state-name,Values=running" --query "Reservations[*].Instances[*].PrivateIpAddress" --output text | tr '\t' '\n' | head -n 1)
        if [ -z "$ip" ]; then
          sleep 10
          retries=$((retries+1))
        fi
      done
      echo "$${ip:-localhost}"
    }

    echo "Buscando IP de MS1..."
    MS1_IP=$(get_ip "${var.project}-${var.environment}-ms1-asg*")

    sudo docker run -d --restart always -p 8083:8083 \
      -e ELASTICSEARCH_URL=http://${var.elasticsearch_endpoint}:9200 \
      -e KAFKA_BROKERS=${var.kafka_brokers} \
      -e MS1_URI=http://$MS1_IP:8080 \
      ${var.docker_username}/ms4-search-discovery:${var.docker_tag}
  EOF
  )
}

resource "aws_autoscaling_group" "ms4_asg" {
  name_prefix         = "${var.project}-${var.environment}-ms4-asg-"
  desired_capacity    = var.desired_capacity
  max_size            = var.max_size
  min_size            = var.min_size
  vpc_zone_identifier = var.private_subnets

  launch_template {
    id      = aws_launch_template.ms4_lt.id
    version = "$Latest"
  }

  instance_refresh {
    strategy = "Rolling"
    preferences {
      min_healthy_percentage = 0
    }
  }
}

# MS5: Interactions
resource "aws_launch_template" "ms5_lt" {
  name_prefix   = "${var.project}-${var.environment}-ms5-lt-"
  image_id      = data.aws_ami.amazon_linux.id
  instance_type = var.instance_type
  key_name      = var.key_name

  network_interfaces {
    associate_public_ip_address = false
    security_groups             = [aws_security_group.microservices_sg.id]
  }

  iam_instance_profile {
    name = "LabInstanceProfile"
  }

  user_data = base64encode(<<-EOF
    #!/bin/bash
    sudo dnf update -y
    sudo dnf install -y docker
    sudo systemctl start docker
    sudo systemctl enable docker

    sudo docker run -d --restart always -p 8084:8084 \
      -e CASSANDRA_HOST=${var.cassandra_ip} \
      -e KAFKA_BROKER=${var.kafka_brokers} \
      ${var.docker_username}/ms5-interactions-reviews:${var.docker_tag}
  EOF
  )
}

resource "aws_autoscaling_group" "ms5_asg" {
  name_prefix         = "${var.project}-${var.environment}-ms5-asg-"
  desired_capacity    = var.desired_capacity
  max_size            = var.max_size
  min_size            = var.min_size
  vpc_zone_identifier = var.private_subnets

  launch_template {
    id      = aws_launch_template.ms5_lt.id
    version = "$Latest"
  }

  instance_refresh {
    strategy = "Rolling"
    preferences {
      min_healthy_percentage = 0
    }
  }
}
