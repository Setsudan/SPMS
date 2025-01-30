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

# Création des groupes de ressources
resource "azurerm_resource_group" "rg" {
  for_each = var.locations
  name     = "Porco-Rosso-${each.key}"
  location = each.value
}

# Création des registres ACR avec les noms fixes
resource "azurerm_container_registry" "acr_france" {
  name                = "registrefrance1"
  resource_group_name = azurerm_resource_group.rg["france"].name
  location            = azurerm_resource_group.rg["france"].location
  sku                 = "Basic"
  admin_enabled       = true
}

resource "azurerm_container_registry" "acr_germany" {
  name                = "registreallemagne1"
  resource_group_name = azurerm_resource_group.rg["germany"].name
  location            = azurerm_resource_group.rg["germany"].location
  sku                 = "Basic"
  admin_enabled       = true
}

# Déploiement PostgreSQL
resource "azurerm_container_group" "postgres" {
  for_each            = azurerm_resource_group.rg
  name                = "postgres-container-${each.key}"
  location            = each.value.location
  resource_group_name = each.value.name
  os_type             = "Linux"

  container {
    name   = "postgres"
    image  = "${each.key == "france" ? azurerm_container_registry.acr_france.login_server : azurerm_container_registry.acr_germany.login_server}/postgres:latest"
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
    server   = each.key == "france" ? azurerm_container_registry.acr_france.login_server : azurerm_container_registry.acr_germany.login_server
    username = each.key == "france" ? azurerm_container_registry.acr_france.admin_username : azurerm_container_registry.acr_germany.admin_username
    password = each.key == "france" ? azurerm_container_registry.acr_france.admin_password : azurerm_container_registry.acr_germany.admin_password
  }

  tags = {
    environment = "testing"
  }
}

# Déploiement Redis
resource "azurerm_container_group" "redis" {
  for_each            = azurerm_resource_group.rg
  name                = "redis-container-${each.key}"
  location            = each.value.location
  resource_group_name = each.value.name
  os_type             = "Linux"

  container {
    name   = "redis"
    image  = "${each.key == "france" ? azurerm_container_registry.acr_france.login_server : azurerm_container_registry.acr_germany.login_server}/redis:alpine"
    cpu    = "0.5"
    memory = "1.5"

    ports {
      port     = 6379
      protocol = "TCP"
    }
  }

  image_registry_credential {
    server   = each.key == "france" ? azurerm_container_registry.acr_france.login_server : azurerm_container_registry.acr_germany.login_server
    username = each.key == "france" ? azurerm_container_registry.acr_france.admin_username : azurerm_container_registry.acr_germany.admin_username
    password = each.key == "france" ? azurerm_container_registry.acr_france.admin_password : azurerm_container_registry.acr_germany.admin_password
  }

  tags = {
    environment = "testing"
  }
}
