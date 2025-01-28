# URL Shortener Project

## Overview

This project is a **multi-regional URL shortener** with **logging and analytics**, built using **TypeScript** and **Turbo Monorepo** for efficient development. It is designed to be **cloud-native**, containerized with **Docker**, and orchestrated via **Kubernetes (K8s)** for scalability.

## Tech Stack

### **Backend**

- **Language:** TypeScript
- **Framework:** Fastify
- **Database:** PostgreSQL (via Prisma ORM)
- **Cache:** Redis (for fast URL resolution & rate limiting) <- Si j'ai pas la flemme
- **Queue System:** BullMQ (Redis-based job queue for logging analytics asynchronously) <- Si j'ai pas la flemme

### **Frontend**

- **Framework:** Angular
- **Styling:** Scss

### **Infrastructure**

- **Containerization:** Docker
- **Orchestration:** Kubernetes (EKS on AWS / AKS on Azure)
- **CI/CD:** GitHub Actions (automated builds, tests, and deployment)
- **Monitoring:** Prometheus + Grafana (metrics), Loki (logs)
- **Ingress Controller:** Nginx + Cert-Manager (for TLS with Let's Encrypt)

## Project Structure

```
url-shortener/
│── apps/
│   ├── backend/         # Express API (TypeScript)
│   ├── frontend/        # Angular UI
│── infra/               # Kubernetes, Docker, CI/CD
│── .github/workflows/   # GitHub Actions
│── turbo.json           # Turbo configuration
│── package.json         # Root dependencies
│── yarn.lock            # Yarn lockfile
│── README.md
```

## Setup & Installation

### **Prerequisites**

- Node.js & Yarn
- Docker & Kubernetes
- PostgreSQL & Redis

### **1️⃣ Clone the Repository**

```sh
git clone https://github.com/setsudan/url-shortener.git
cd url-shortener
yarn install
```

Entre cette étapes et la suivantes n'oubliez pas de setup vos variables environnementales (voir les .env.example dans `apps/backend` et `infra`)

### **2️⃣ Build & Run Docker Locally**

```sh
docker-compose up -d
```

### **3️⃣ Run Backend Migrations**

```sh
yarn workspace backend prisma migrate dev --name init
```

### **4️⃣ Start the Local Development Environment**

```sh
yarn turbo dev
```

This runs both **backend** & **frontend** in parallel.


## API Endpoints

### **Shorten a URL**

**POST** `/shorten`

#### **Request:**

```json
{
  "url": "https://example.com"
}
```

#### **Response:**

```json
{
  "shortUrl": "http://localhost:3000/abc123"
}
```

### **Redirect to Original URL**

**GET** `/:shortUrl`

#### **Response:**

Redirects to the original URL.

### **Get URL Stats**

**GET** `/stats/:shortUrl`

#### **Response:**

```json
{
  "clicks": 120,
  "createdAt": "2025-01-27T12:00:00Z"
}
```
