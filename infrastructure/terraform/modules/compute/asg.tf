# Launch Templates and ASGs

# Node 1: Gateway, MS1, MS2, MS3
resource "aws_launch_template" "node1_lt" {
  name_prefix   = "${var.project}-${var.environment}-node1-lt-"
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
    # Configurar SWAP de 2GB
    sudo dd if=/dev/zero of=/swapfile bs=1M count=2048
    sudo chmod 600 /swapfile
    sudo mkswap /swapfile
    sudo swapon /swapfile
    echo '/swapfile swap swap defaults 0 0' | sudo tee -a /etc/fstab

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

    echo "Obteniendo IP local de Node 1..."
    TOKEN=$(curl -X PUT "http://169.254.169.254/latest/api/token" -H "X-aws-ec2-metadata-token-ttl-seconds: 21600")
    NODE1_IP=$(curl -s -H "X-aws-ec2-metadata-token: $TOKEN" http://169.254.169.254/latest/meta-data/local-ipv4)

    echo "Iniciando MS1 (Identity)..."
    sudo docker run -d --restart always -p 8080:8080 \
      -e SPRING_DATASOURCE_URL=jdbc:postgresql://${var.rds_ms1_endpoint}/uce_trade_ms1 \
      -e SPRING_DATASOURCE_USERNAME=${var.rds_ms1_username} \
      -e SPRING_DATASOURCE_PASSWORD=${var.rds_ms1_password} \
      ${var.docker_username}/ms1-identity-and-access:${var.docker_tag}

    echo "Iniciando MS2 (Product Command)..."
    sudo docker run -d --restart always -p 8081:8081 \
      -e SPRING_DATASOURCE_URL=jdbc:mysql://${var.rds_ms2_endpoint}/uce_trade_ms2 \
      -e SPRING_DATASOURCE_USERNAME=${var.rds_ms2_username} \
      -e SPRING_DATASOURCE_PASSWORD=${var.rds_ms2_password} \
      -e SPRING_KAFKA_BOOTSTRAP_SERVERS=${var.kafka_brokers} \
      -e SUPABASE_URL=${var.supabase_url} \
      -e SUPABASE_BUCKET=${var.supabase_bucket} \
      -e SUPABASE_KEY=${var.supabase_key} \
      ${var.docker_username}/ms2-product-command:${var.docker_tag}

    echo "Iniciando MS3 (Catalog Query)..."
    sudo docker run -d --restart always -p 8082:8082 \
      -e MONGO_URI=mongodb://${var.docdb_endpoint}:27017 \
      -e KAFKA_BROKERS=${var.kafka_brokers} \
      ${var.docker_username}/ms3-catalog-query:${var.docker_tag}

    echo "Buscando IP de Node 2 (MS4, MS5, MS6)..."
    NODE2_IP=$(get_ip "${var.project}-${var.environment}-node2-asg*")

    echo "Iniciando MS0 (API Gateway)..."
    sudo docker run -d --restart always -p 8000:8000 \
      -e REDIS_HOST=${var.redis_address} \
      -e MS1_URI=http://$NODE1_IP:8080 \
      -e MS2_URI=http://$NODE1_IP:8081 \
      -e MS3_URI=http://$NODE1_IP:8082 \
      -e MS4_URI=http://$NODE2_IP:8083 \
      -e MS5_URI=http://$NODE2_IP:8084 \
      -e MS6_URI=http://$NODE2_IP:8085 \
      ${var.docker_username}/ms0-api-gateway:${var.docker_tag}
  EOF
  )

  lifecycle {
    create_before_destroy = true
  }
}

resource "aws_autoscaling_group" "node1_asg" {
  name_prefix         = "${var.project}-${var.environment}-node1-asg-"
  desired_capacity    = var.desired_capacity
  max_size            = var.max_size
  min_size            = var.min_size
  target_group_arns   = [aws_lb_target_group.gateway_tg.arn]
  vpc_zone_identifier = var.private_subnets

  launch_template {
    id      = aws_launch_template.node1_lt.id
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

# Node 2: MS4, MS5, MS6
resource "aws_launch_template" "node2_lt" {
  name_prefix   = "${var.project}-${var.environment}-node2-lt-"
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
    # Configurar SWAP de 2GB
    sudo dd if=/dev/zero of=/swapfile bs=1M count=2048
    sudo chmod 600 /swapfile
    sudo mkswap /swapfile
    sudo swapon /swapfile
    echo '/swapfile swap swap defaults 0 0' | sudo tee -a /etc/fstab

    sudo dnf update -y
    sudo dnf install -y docker
    sudo systemctl start docker
    sudo systemctl enable docker

    # Función para obtener IP del Node 1 si MS4 la necesita
    get_ip() {
      local asg_pattern=$1
      local ip=""
      local retries=0
      while [ -z "$ip" ] && [ $retries -lt 30 ]; do
        ip=$(aws ec2 describe-instances --region us-east-1 --filters "Name=tag:aws:autoscaling:groupName,Values=$asg_pattern" "Name=instance-state-name,Values=running" --query "Reservations[*].Instances[*].PrivateIpAddress" --output text | tr '\t' '\n' | head -n 1)
        if [ -z "$ip" ]; then
          sleep 10
          retries=$((retries+1))
        fi
      done
      echo "$${ip:-localhost}"
    }

    echo "Buscando IP de Node 1 (MS1)..."
    NODE1_IP=$(get_ip "${var.project}-${var.environment}-node1-asg*")

    echo "Iniciando MS4 (Search Discovery)..."
    sudo docker run -d --restart always -p 8083:8083 \
      -e ELASTICSEARCH_URL=http://${var.elasticsearch_endpoint}:9200 \
      -e KAFKA_BROKERS=${var.kafka_brokers} \
      -e MS1_URI=http://$NODE1_IP:8080 \
      ${var.docker_username}/ms4-search-discovery:${var.docker_tag}

    echo "Iniciando MS5 (Interactions)..."
    sudo docker run -d --restart always -p 8084:8084 \
      -e CASSANDRA_HOST=${var.cassandra_ip} \
      -e KAFKA_BROKER=${var.kafka_brokers} \
      ${var.docker_username}/ms5-interactions-reviews:${var.docker_tag}

    echo "Iniciando MS6 (Payments)..."
    sudo docker run -d --restart always -p 8085:8085 \
      -e SPRING_DATASOURCE_URL=jdbc:mariadb://${var.mariadb_endpoint}:3306/uce_trade_ms6 \
      -e SPRING_DATASOURCE_USERNAME=root \
      -e SPRING_DATASOURCE_PASSWORD=root \
      -e RABBITMQ_HOST=${var.rabbitmq_endpoint} \
      -e STRIPE_SECRET_KEY=${var.stripe_secret_key} \
      ${var.docker_username}/ms6-payments:${var.docker_tag}
  EOF
  )

  lifecycle {
    create_before_destroy = true
  }
}

resource "aws_autoscaling_group" "node2_asg" {
  name_prefix         = "${var.project}-${var.environment}-node2-asg-"
  desired_capacity    = var.desired_capacity
  max_size            = var.max_size
  min_size            = var.min_size
  vpc_zone_identifier = var.private_subnets

  launch_template {
    id      = aws_launch_template.node2_lt.id
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
