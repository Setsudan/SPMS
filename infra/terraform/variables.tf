variable "acr_username_france" {
  description = "Nom d'utilisateur pour le registre ACR France"
  type        = string
}

variable "acr_password_france" {
  description = "Mot de passe pour le registre ACR France"
  type        = string
  sensitive   = true
}

variable "acr_username_germany" {
  description = "Nom d'utilisateur pour le registre ACR Allemagne"
  type        = string
}

variable "acr_password_germany" {
  description = "Mot de passe pour le registre ACR Allemagne"
  type        = string
  sensitive   = true
}
variable "subscription_id" {}
variable "tenant_id" {}
variable "client_id" {}
variable "client_secret" {}
variable "resource_group_name" {
  default = "Porco-Rosso-France"
}
