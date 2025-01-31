# 📖 **Documentation Technique - Student Program Management System**

## 🔹 **Présentation**
Le projet **Student Program Management System** est une plateforme conçue pour la gestion des programmes étudiants, incluant :
- **Authentification des utilisateurs**
- **Profils étudiants** (avec gestion des compétences et réseaux sociaux)
- **Système de mentorat** (demande et acceptation de mentors)
- **Messagerie en temps réel** (WebSocket)
- **Gestion des compétences** (auto-évaluation et évaluation par les pairs)
- **Suivi des promotions et des étudiants**

---

## 🏗 **Architecture du projet**
### 📂 **Structure du Répertoire**
```
student-management-system/
│── apps/
│   ├── backend/         # API Backend (NestJS)
│   ├── frontend/        # Interface utilisateur (Angular)
│── infra/               # Fichiers d'infrastructure (Docker, K8s, CI/CD)
│── .github/workflows/   # Pipelines GitHub Actions
│── turbo.json           # Configuration Turborepo
│── package.json         # Dépendances globales
│── README.md            # Documentation principale
```

---

## 🔧 **Stack Technologique**
| Type         | Technologie |
|-------------|------------|
| **Backend** | NestJS (Fastify adapter), TypeScript, Prisma ORM, PostgreSQL |
| **Frontend** | Angular, SCSS |
| **Infrastructure** | Docker, Kubernetes (EKS/AWS & AKS/Azure), CI/CD (GitHub Actions) |
| **Monitoring** | Prometheus, Grafana, Loki |
| **Auth** | JWT (JSON Web Token) |
| **Messaging** | WebSockets avec NestJS |

---

## ⚙️ **Installation et Configuration**
### 📌 **Prérequis**
- **Node.js** & **Yarn**
- **Docker** & **Kubernetes**
- **PostgreSQL** & **Redis** (pour le cache et la messagerie)
- **Cloudflare Tunnel** (pour exposition des services en local)

### 🏗 **1️⃣ Cloner le projet et installer les dépendances**
```sh
git clone https://github.com/setsudan/student-management-system.git
cd student-management-system
yarn install
```

### ⚠️ **2️⃣ Configuration des variables d'environnement**
- Backend : `apps/backend/.env.example`
- Infrastructure : `infra/.env.example`

Renommer ces fichiers en `.env` et compléter avec vos valeurs.

### 🐳 **3️⃣ Lancer l'application avec Docker**
```sh
docker-compose up -d
```

### 📦 **4️⃣ Exécuter les migrations Prisma**
```sh
yarn workspace backend prisma migrate dev --name init
```

### 📜 **5️⃣ Générer le client Prisma**
```sh
yarn workspace backend prisma generate
```

### 🚀 **6️⃣ Démarrer l’environnement de développement**
```sh
yarn turbo dev
```

Ce qui démarre **le backend (5000) et le frontend (4200) en parallèle**.

---

## 🏗 **Architecture Backend**
### 📂 **Structure du Code Backend**
```
apps/backend/src/
│── auth/                # Module d'authentification (JWT, Guards, Dto)
│── grades/              # Gestion des grades et des étudiants
│── mentorship/          # Système de mentorat
│── messaging/           # Messagerie (WebSocket)
│── metrics/             # Monitoring (Prometheus)
│── prisma/              # ORM Prisma (services & seeders)
│── skill/               # Gestion des compétences
│── user/                # Gestion des utilisateurs
│── main.ts              # Point d’entrée de l’application
│── app.module.ts        # Module principal
│── app.service.ts       # Service principal
│── app.controller.ts    # Contrôleur principal
```

### 🛠 **Technologies Backend**
- **NestJS** (Fastify) pour performance et scalabilité
- **JWT** pour l’authentification
- **Prisma ORM** pour la base de données PostgreSQL
- **Redis** pour le cache et la gestion des files d’attente

### 🔐 **Authentification**
- JWT basé sur `jsonwebtoken`
- Stratégie Passport avec `JwtStrategy`
- Protection des routes avec `JwtAuthGuard`
- API :
  - `POST /auth/register`
  - `POST /auth/login`
  - `GET /users/profile` (Protégé)

### 📨 **Messagerie en temps réel**
- Implémenté avec **WebSockets**
- Gestionnaire WebSocket dans `messaging.gateway.ts`
- Envoi de messages en **temps réel**

---

## 🎨 **Architecture Frontend**
### 📂 **Structure du Code Frontend**
```
apps/frontend/src/
│── app/
│   ├── pages/          # Pages principales (Home, Login, Profile)
│   ├── services/       # Services API (Auth, Users, Messaging)
│   ├── components/     # Composants UI réutilisables
│   ├── guards/         # Garde de route pour l'auth
│   ├── interceptors/   # Intercepteurs pour les requêtes HTTP
│── assets/             # Ressources statiques
│── environments/       # Variables d’environnement Angular
│── main.ts            # Entrée de l’application
│── styles.scss        # Styles globaux
```

### 🛠 **Technologies Frontend**
- **Angular** (Standalone API)
- **SCSS** pour le stylisme
- **Services API** utilisant **HttpClient**
- **WebSockets** pour la messagerie temps réel

### 🔐 **Gestion de l'Authentification**
- Service `auth.service.ts`
- **JWT stocké en `localStorage`**
- **Interceptor** (`auth.interceptor.ts`) pour injecter le token

---

## 🚀 **Déploiement et Infrastructure**
### 🏗 **CI/CD (GitHub Actions)**
- Fichier `.github/workflows/cicd.yml`
- Build + tests + déploiement en **Kubernetes**

### 🏢 **Orchestration avec Kubernetes**
#### 📂 **Manifests K8s**
```
infra/k8s/
│── backend-deployment.yml
│── frontend-deployment.yml
│── grafana.yml
│── prometheus.yml
```
- **Déploiement sur EKS (AWS) et AKS (Azure)**
- **Ingress Nginx avec Cert-Manager**
- **TLS avec Let's Encrypt**

### 📊 **Monitoring**
- **Prometheus** pour les métriques (CPU, RAM, erreurs)
- **Grafana** pour la visualisation
- **Postgres Exporter & Redis Exporter**

---

## 🛠 **Endpoints API**
### 🔑 **Authentification**
| Méthode | Endpoint           | Description               |
|---------|--------------------|---------------------------|
| `POST`  | `/auth/register`   | Inscription utilisateur  |
| `POST`  | `/auth/login`      | Connexion utilisateur    |
| `GET`   | `/users/profile`   | Récupération du profil   |

### 👥 **Gestion des utilisateurs**
| Méthode | Endpoint         | Description                  |
|---------|-----------------|------------------------------|
| `GET`   | `/users/profile` | Récupérer le profil actuel  |
| `PUT`   | `/users/profile` | Mettre à jour le profil     |

### 🎓 **Gestion des grades**
| Méthode | Endpoint               | Description             |
|---------|------------------------|-------------------------|
| `GET`   | `/grades`              | Liste des grades       |
| `GET`   | `/grades/:id/students` | Étudiants d’un grade   |

### 🏆 **Mentorat**
| Méthode | Endpoint               | Description                    |
|---------|------------------------|--------------------------------|
| `POST`  | `/mentorship/request`  | Demande de mentorat            |
| `POST`  | `/mentorship/accept`   | Accepter une demande de mentor |

### 📨 **Messagerie**
| Méthode | Endpoint          | Description       |
|---------|------------------|------------------|
| `POST`  | `/messaging/send` | Envoyer un message |
