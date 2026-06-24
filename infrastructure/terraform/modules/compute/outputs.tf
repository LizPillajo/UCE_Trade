output "alb_dns_name" {
  value = aws_lb.main_alb.dns_name
}

output "microservices_sg_id" {
  value = aws_security_group.microservices_sg.id
}

output "bastion_public_ip" {
  value = aws_instance.bastion.public_ip
}
