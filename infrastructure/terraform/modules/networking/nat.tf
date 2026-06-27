# Elastic IP for NAT Gateway
resource "aws_eip" "nat_eip" {
  domain = "vpc"

  tags = {
    Name        = "${var.project}-${var.environment}-nat-eip"
    Environment = var.environment
  }
}

# NAT Gateway
resource "aws_nat_gateway" "nat" {
  allocation_id = aws_eip.nat_eip.id
  subnet_id     = aws_subnet.public_1a.id

  tags = {
    Name        = "${var.project}-${var.environment}-nat-gateway"
    Environment = var.environment
  }

  depends_on = [aws_internet_gateway.igw]
}

# Private Route Table
resource "aws_route_table" "private_rt" {
  vpc_id = aws_vpc.main.id

  route {
    cidr_block     = "0.0.0.0/0"
    nat_gateway_id = aws_nat_gateway.nat.id
  }

  tags = {
    Name        = "${var.project}-${var.environment}-private-rt"
    Environment = var.environment
  }
}

resource "aws_route_table_association" "private_1a_assoc" {
  subnet_id      = aws_subnet.private_1a.id
  route_table_id = aws_route_table.private_rt.id
}

resource "aws_route_table_association" "private_1b_assoc" {
  subnet_id      = aws_subnet.private_1b.id
  route_table_id = aws_route_table.private_rt.id
}
