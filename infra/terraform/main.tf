provider "azurerm" {
  features {}

  subscription_id = var.subscription_id
  client_id       = var.client_id
  client_secret   = var.client_secret
  tenant_id       = var.tenant_id
}
variable "locations" {
  default = {
    france  = "France Central"
    germany = "Germany West Central"
  }
}
resource "azurerm_resource_group" "rg" {
  for_each = var.locations
  name     = "Porco-Rosso-${each.key}"
  location = each.value
}

resource "azurerm_container_group" "postgres" {
  for_each            = azurerm_resource_group.rg
  name                = "postgres-container-${each.key}"
  location            = each.value.location
  resource_group_name = each.value.name
  os_type             = "Linux"

  container {
    name   = "postgres"
    image  = "registre${each.key}.azurecr.io/postgres:latest"
    cpu    = "1"
    memory = "1.5"

    ports {
      port     = 5432
      protocol = "TCP"
    }

    environment_variables = {
      POSTGRES_USER     = "admin"
      POSTGRES_PASSWORD = "securepassword"
    }
  }

  image_registry_credential {
    server   = "registre${each.key}.azurecr.io"
    username = var.acr_username
    password = var.acr_password
  }
}
resource "azurerm_container_group" "redis" {
  for_each            = azurerm_resource_group.rg
  name                = "redis-container-${each.key}"
  location            = each.value.location
  resource_group_name = each.value.name
  os_type             = "Linux"

  container {
    name   = "redis"
    image  = "registre${each.key}.azurecr.io/redis:alpine"
    cpu    = "0.5"
    memory = "0.5"

    ports {
      port     = 6379
      protocol = "TCP"
    }
  }

  image_registry_credential {
    server   = "registre${each.key}.azurecr.io"
    username = var.acr_username
    password = var.acr_password
  }
}

