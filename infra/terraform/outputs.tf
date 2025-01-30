output "container_ips" {
  value = { for key, container in azurerm_container_group.postgres : key => container.ip_address }
}
output "acr_credentials" {
  value = {
    france  = azurerm_container_registry.acr_france.admin_username
    germany = azurerm_container_registry.acr_germany.admin_username
  }
  sensitive = true
}
