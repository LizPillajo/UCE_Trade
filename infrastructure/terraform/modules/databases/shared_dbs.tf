# ========================================
# SHARED DATABASES EC2 (Consolidado)
# ========================================
# AWS Academy tiene un límite estricto de ~9 instancias EC2.
# Para evitar este límite, consolidamos Mongo, ES, Kafka y Cassandra en UNA sola instancia t3.medium.

resource "aws_instance" "shared_dbs" {
  count                  = var.enable_db ? 1 : 0
  ami                    = data.aws_ami.amazon_linux.id
  instance_type          = "t3.medium" # 2 vCPU, 4GB RAM para aguantar las 4 DBs
  subnet_id              = var.cassandra_public_subnet
  vpc_security_group_ids = [aws_security_group.cassandra_sg.id]
  key_name               = var.key_name

  user_data = base64encode(<<-EOF
    #!/bin/bash
    sudo dnf update -y
    sudo dnf install -y docker
    sudo systemctl start docker
    sudo systemctl enable docker

    LOCAL_IP=$(curl -s http://169.254.169.254/latest/meta-data/local-ipv4)

    # Esperar y montar volumen EBS de Cassandra
    sleep 30
    DEVICE=$(lsblk -dp | grep -v "xvda" | grep -v "nvme0n1" | head -n 1 | awk '{print $1}')
    if [ -n "$DEVICE" ]; then
      if ! blkid $DEVICE; then
        mkfs -t xfs $DEVICE
      fi
      mkdir -p /mnt/cassandra_data
      mount $DEVICE /mnt/cassandra_data
      echo "$DEVICE /mnt/cassandra_data xfs defaults,nofail 0 2" >> /etc/fstab
    else
      mkdir -p /mnt/cassandra_data
    fi

    # 1. MongoDB
    sudo docker run -d --name mongodb --restart always -p 27017:27017 \
      mongo:latest --wiredTigerCacheSizeGB 0.25

    # 2. ElasticSearch (Requiere max_map_count)
    sudo sysctl -w vm.max_map_count=262144
    echo "vm.max_map_count=262144" | sudo tee -a /etc/sysctl.conf
    sudo docker run -d --name elasticsearch --restart always -p 9200:9200 -p 9300:9300 \
      -e "discovery.type=single-node" \
      -e "xpack.security.enabled=false" \
      -e "ES_JAVA_OPTS=-Xms512m -Xmx512m" \
      docker.elastic.co/elasticsearch/elasticsearch:7.10.2

    # 3. Zookeeper & Kafka
    sudo docker run -d --name zookeeper --restart always -p 2181:2181 \
      -e ALLOW_ANONYMOUS_LOGIN=yes \
      bitnami/zookeeper:latest

    sudo docker run -d --name kafka --restart always -p 9092:9092 \
      --link zookeeper:zookeeper \
      -e KAFKA_CFG_ZOOKEEPER_CONNECT=zookeeper:2181 \
      -e KAFKA_CFG_LISTENERS=PLAINTEXT://:9092 \
      -e ALLOW_PLAINTEXT_LISTENER=yes \
      -e KAFKA_CFG_ADVERTISED_LISTENERS=PLAINTEXT://$LOCAL_IP:9092 \
      -e KAFKA_HEAP_OPTS="-Xmx256M -Xms256M" \
      bitnami/kafka:latest

    # 4. Cassandra
    sudo docker run -d --name cassandra-db --restart always -p 9042:9042 \
      -v /mnt/cassandra_data:/var/lib/cassandra \
      -e CASSANDRA_CLUSTER_NAME=UCECluster \
      -e MAX_HEAP_SIZE="512M" -e HEAP_NEWSIZE="100M" \
      cassandra:latest

    # 5. MariaDB (MS6)
    sudo docker run -d --name mariadb-ms6 --restart always -p 3306:3306 \
      -e MARIADB_ROOT_PASSWORD=root \
      -e MARIADB_DATABASE=uce_trade_ms6 \
      mariadb:10.11

    # 6. RabbitMQ (MS6)
    sudo docker run -d --name rabbitmq --restart always -p 5672:5672 -p 15672:15672 \
      rabbitmq:3-management
  EOF
  )

  tags = {
    Name = "${var.project}-${var.environment}-shared-dbs"
  }
}
