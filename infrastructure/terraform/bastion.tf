# Find the latest Amazon Linux 2023 image
data "aws_ami" "amazon_linux" {
  most_recent = true
  owners      = ["amazon"]

  filter {
    name   = "name"
    values = ["al2023-ami-2023.*-x86_64"]
  }
}

# EC2 instance for the bastion host
resource "aws_instance" "bastion" {
  ami           = data.aws_ami.amazon_linux.id
  instance_type = "t2.micro" 
  
  subnet_id                   = aws_subnet.public_subnet_1a.id
  vpc_security_group_ids      = [aws_security_group.bastion_sg.id]
  key_name                    = "vockey" 
  associate_public_ip_address = true     

  tags = {
    Name = "uce-trade-jump-box"
  }
}

# Output to print the public IP address upon completion
output "bastion_public_ip" {
  value       = aws_instance.bastion.public_ip
  description = "Direccion IP publica del Bastion Host"
}