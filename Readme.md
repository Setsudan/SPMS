# **Student Program Management System**

## **Overview**

This project is a **student program management system** designed to handle **user authentication, student profiles, mentorship programs, messaging, and skill tracking**. Built with **Angular** for the frontend and **NestJS** for the backend, it uses **Turborepo** for efficient monorepo management.

## **Tech Stack**

### **Backend**

- **Language:** TypeScript
- **Framework:** NestJS (Fastify adapter)
- **Database:** PostgreSQL (via Prisma ORM)
- **Authentication:** JWT-based authentication
- **Caching (Optional):** Redis (for performance enhancements)
- **Queue System (Optional):** BullMQ (Redis-based job queue)

### **Frontend**

- **Framework:** Angular
- **Styling:** SCSS

### **Infrastructure**

- **Containerization:** Docker
- **Orchestration:** Kubernetes (EKS on AWS / AKS on Azure)
- **CI/CD:** GitHub Actions (automated builds, tests, and deployment)
- **Monitoring:** Prometheus + Grafana (metrics), Loki (logs)
- **Ingress Controller:** Nginx + Cert-Manager (for TLS with Let's Encrypt)

## **Project Structure**

```
student-management-system/
│── apps/
│   ├── backend/         # NestJS API
│   ├── frontend/        # Angular UI
│── infra/               # Kubernetes, Docker, CI/CD
|   ├── terraform        # Terraform with Azure
│── .github/workflows/   # GitHub Actions
│── turbo.json           # Turbo configuration
│── package.json         # Root dependencies
│── yarn.lock            # Yarn lockfile
│── README.md
```

## **Setup & Installation**

### **Prerequisites**

- Node.js & Yarn
- Docker & Kubernetes
- PostgreSQL & Redis (if using cache or queue)

### **1️⃣ Clone the Repository**

```sh
git clone https://github.com/setsudan/student-management-system.git
cd student-management-system
yarn install
```

| Yes the url is not this one yet we're waiting some changes before updating it |

⚠️ Before proceeding, make sure to configure your environment variables by checking `.env.example` files in `apps/backend` and `infra`.

### **2️⃣ Build & Run Docker Locally**

```sh
docker-compose up -d
```

### **3️⃣ Run Backend Migrations**

```sh
yarn workspace backend prisma migrate dev --name init
```

### **4️⃣ Generate Prisma Client**

```sh
yarn workspace backend prisma generate
```

### **5️⃣ Start the Local Development Environment**

```sh
yarn turbo dev
```

This runs both **backend** & **frontend** in parallel.

---

## **API Endpoints**

You can also access it on [http://localhost:5000/api/docs](http://localhost:5000/api/docs) once the project is running.

### **Authentication**

#### **Register a User**

**POST** `/auth/register`

**Request:**

```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "johndoe@example.com",
  "password": "securepassword",
  "gradeId": "bachelor-web-2025"
}
```

**Response:**

```json
{
  "message": "User registered successfully",
  "user": {
    "id": "123",
    "firstName": "John",
    "lastName": "Doe",
    "email": "johndoe@example.com",
    "grade": "Bachelor Développeur Web",
    "graduationYear": "P2025"
  }
}
```

#### **Login**

**POST** `/auth/login`

**Request:**

```json
{
  "email": "johndoe@example.com",
  "password": "securepassword"
}
```

**Response:**

```json
{
  "access_token": "JWT_TOKEN_HERE"
}
```

---

### **User Profile**

#### **Get Current User Profile**

**GET** `/users/profile`

**Headers:**

```json
{
  "Authorization": "Bearer JWT_TOKEN_HERE"
}
```

**Response:**

```json
{
  "id": "123",
  "firstName": "John",
  "lastName": "Doe",
  "email": "johndoe@example.com",
  "bio": "I am a developer",
  "face": "https://example.com/avatar.jpg",
  "grade": {
    "name": "Bachelor Développeur Web",
    "graduationYear": "P2025"
  },
  "socialLinks": [
    { "type": "GitHub", "url": "https://github.com/johndoe" }
  ],
  "skills": [
    { "skill": { "name": "JavaScript" }, "ability": 4 }
  ]
}
```

#### **Update User Profile**

**PUT** `/users/profile`

**Headers:**

```json
{
  "Authorization": "Bearer JWT_TOKEN_HERE"
}
```

**Request:**

```json
{
  "bio": "Updated bio",
  "face": "https://example.com/new-avatar.jpg",
  "socialLinks": [
    { "type": "LinkedIn", "url": "https://linkedin.com/in/johndoe" }
  ],
  "skills": [
    { "skillId": "typescript", "ability": 5 }
  ]
}
```

**Response:**

```json
{
  "id": "123",
  "bio": "Updated bio",
  "face": "https://example.com/new-avatar.jpg",
  "socialLinks": [
    { "type": "LinkedIn", "url": "https://linkedin.com/in/johndoe" }
  ],
  "skills": [
    { "skill": { "name": "TypeScript" }, "ability": 5 }
  ]
}
```

---

### **Skills Management**

#### **Get All Skills**

**GET** `/skills`
**Response:**

```json
[
  { "id": "javascript", "name": "JavaScript", "description": "Frontend & Backend development" },
  { "id": "typescript", "name": "TypeScript", "description": "Strictly typed JavaScript" }
]
```

#### **Get Skill by Name**

**GET** `/skills/:name`
**Response:**

```json
{
  "id": "typescript",
  "name": "TypeScript",
  "description": "Strictly typed JavaScript"
}
```

#### **Add a Skill to User Profile**

**POST** `/users/profile/skills`

**Headers:**

```json
{
  "Authorization": "Bearer JWT_TOKEN_HERE"
}
```

**Request:**

```json
{
  "skillId": "typescript",
  "ability": 4
}
```

**Response:**

```json
{
  "message": "Skill added successfully",
  "skill": {
    "skill": { "name": "TypeScript" },
    "ability": 4
  }
}
```

---

### **Grades & Students**

#### **Get All Grades**

**GET** `/grades`
**Response:**

```json
[
  { "id": "bachelor-web-2025", "name": "Bachelor Développeur Web", "graduationYear": "P2025" },
  { "id": "grande-ecole-2027", "name": "Programme Grande École", "graduationYear": "P2027" }
]
```

#### **Get Students by Grade**

**GET** `/grades/:gradeId/students`
**Response:**

```json
[
  { "id": "123", "firstName": "John", "lastName": "Doe", "email": "johndoe@example.com" },
  { "id": "124", "firstName": "Jane", "lastName": "Smith", "email": "janesmith@example.com" }
]
```

---

## **Running Tests**

To run unit tests:

```sh
yarn turbo test
```

---

## **Deployment**

Using Docker:

```sh
docker-compose up --build -d
```

Using Kubernetes:

```sh
kubectl apply -f infra/k8s/deployment.yml
```
