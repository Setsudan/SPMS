output "container_ips" {
  value = { for key, container in azurerm_container_group.postgres : key => container.ip_address }
}
