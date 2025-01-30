# 🚀 Déploiement Infrastructure & Docker Images avec Terraform

Ce projet configure et déploie une infrastructure multi-régionale sur **Azure** en utilisant **Terraform**. Il automatise également le **tag** et le **push** des images Docker vers **Azure Container Registry (ACR)**.

## 📌 **Table des matières**
- [🛠 Prérequis](#prérequis)
- [⚙️ Configuration de Terraform](#configuration-de-terraform)
- [🚀 Déploiement de l'infrastructure avec Terraform](#déploiement-de-linfrastructure-avec-terraform)
- [🔄 Connexion et Push des images Docker](#connexion-et-push-des-images-docker)
- [🚀 Finaliser le déploiement avec Terraform](#finaliser-le-déploiement-avec-terraform)
- [📝 Vérification du déploiement](#vérification-du-déploiement)

---

## 🛠 **Prérequis**
Avant de commencer, assurez-vous d'avoir installé :

1. **Terraform** : [Télécharger Terraform](https://developer.hashicorp.com/terraform/downloads)
2. **Azure CLI** : [Installer Azure CLI](https://docs.microsoft.com/fr-fr/cli/azure/install-azure-cli)
3. **Docker** : [Installer Docker](https://www.docker.com/get-started/)
4. Un abonnement **Azure** avec les droits suffisants (Owner ou Contributor sur la souscription)

---

## ⚙️ **Configuration de Terraform**
### 1️⃣ **Initialiser Terraform**
Exécutez la commande suivante pour initialiser le projet Terraform :

```powershell
cd infra/terraform
terraform init
```

### 2️⃣ **Configurer les variables Azure**
Ajoutez un fichier `terraform.tfvars` avec vos identifiants Azure :

```hcl
subscription_id = "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
tenant_id       = "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
client_id       = "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
client_secret   = "xxxxxxxxxxxxxxxxxxxxxxxxxxxx"
```

> 📌 **Note :** Ne partagez jamais ce fichier. Ajoutez-le à `.gitignore` !

### 3️⃣ **Vérifier la configuration**
Avant d'appliquer les changements, testez le plan Terraform :

```powershell
terraform plan
```

---

## 🚀 **Déploiement de l'infrastructure avec Terraform**
Lancez un premier déploiement pour créer les ressources de base :

```powershell
terraform apply
```
📌 Tapez **`yes`** pour confirmer.

---

## 🔄 **Connexion et Push des images Docker**
### 1️⃣ **Connexion à Azure ACR**
#### 🇫🇷 France
```powershell
az acr login --name registrefrance1
```

#### 🇩🇪 Allemagne
```powershell
az acr login --name registreallemagne1
```

### 2️⃣ **Tagger et Pousser les images Docker**
#### 🇫🇷 France
```powershell
docker tag postgres:latest registrefrance1.azurecr.io/postgres:latest
docker tag redis:alpine registrefrance1.azurecr.io/redis:alpine

docker push registrefrance1.azurecr.io/postgres:latest
docker push registrefrance1.azurecr.io/redis:alpine
```

#### 🇩🇪 Allemagne
```powershell
docker tag postgres:latest registreallemagne1.azurecr.io/postgres:latest
docker tag redis:alpine registreallemagne1.azurecr.io/redis:alpine

docker push registreallemagne1.azurecr.io/postgres:latest
docker push registreallemagne1.azurecr.io/redis:alpine
```

---

## 🚀 **Finaliser le déploiement avec Terraform**
Après avoir tagué et poussé les images Docker, appliquez une dernière fois Terraform pour attacher les images aux instances :

```powershell
terraform apply
```
📌 Tapez **`yes`** pour confirmer.

---

## 📝 **Vérification du déploiement**

### ✅ **Lister les containers déployés**
```powershell
az container list --resource-group Porco-Rosso-France --output table
az container list --resource-group Porco-Rosso-Germany --output table
```

### ✅ **Vérifier les logs d'un container**
```powershell
az container logs --resource-group Porco-Rosso-France --name postgres-container-france
```

### ✅ **Tester la connexion PostgreSQL**
```powershell
psql -h <IP> -U admin -d postgres
```

### ✅ **Tester la connexion Redis**
```powershell
redis-cli -h <IP> -p 6379
```

---

## 🎯 **Résumé des commandes principales**

| **Action** | **Commande** |
|------------|--------------|
| **Initialiser Terraform** | `terraform init` |
| **Vérifier le plan Terraform** | `terraform plan` |
| **Premier déploiement Terraform** | `terraform apply` |
| **Connexion à ACR (France)** | `az acr login --name registrefrance1` |
| **Connexion à ACR (Allemagne)** | `az acr login --name registreallemagne1` |
| **Tag & Push des images (France)** | `docker tag <image> registrefrance1.azurecr.io/<image>` + `docker push registrefrance1.azurecr.io/<image>` |
| **Tag & Push des images (Allemagne)** | `docker tag <image> registreallemagne1.azurecr.io/<image>` + `docker push registreallemagne1.azurecr.io/<image>` |
| **Finaliser le déploiement Terraform** | `terraform apply` |
| **Lister les containers** | `az container list --resource-group Porco-Rosso-France --output table` |
| **Vérifier les logs d'un container** | `az container logs --resource-group Porco-Rosso-France --name postgres-container-france` |

---

## 🎉 **Félicitations !**
Votre infrastructure et vos images Docker sont maintenant déployées sur **Azure** avec Terraform ! 🚀🔥
