# Principal VPC
resource "aws_vpc" "main_vpc" {
  cidr_block           = "10.0.0.0/16"
  enable_dns_hostnames = true
  enable_dns_support   = true

  tags = {
    Name = "uce-trade-vpc"
  }
}

# Internet Gateway 
resource "aws_internet_gateway" "igw" {
  vpc_id = aws_vpc.main_vpc.id

  tags = {
    Name = "uce-trade-igw"
  }
}

# Public Subnet  (Load Balancer and EC2 Bastion)
resource "aws_subnet" "public_subnet_1a" {
  vpc_id                  = aws_vpc.main_vpc.id
  cidr_block              = "10.0.1.0/24"
  availability_zone       = "us-east-1a"
  map_public_ip_on_launch = true

  tags = {
    Name = "uce-trade-public-1a"
  }
}

# Private Subnet (Microservices and Data Bases)
resource "aws_subnet" "private_subnet_1a" {
  vpc_id            = aws_vpc.main_vpc.id
  cidr_block        = "10.0.10.0/24"
  availability_zone = "us-east-1a"

  tags = {
    Name = "uce-trade-private-1a"
  }
}