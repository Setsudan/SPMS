# 🏫 Student Collaboration Platform - Backend

This is the **backend** for the Student Collaboration Platform, built with **NestJS, Prisma, PostgreSQL, and JWT authentication**. It provides **student profiles, mentorship requests, messaging, skills tracking**, and **grades management**.

## 🚀 Features

- **User Authentication** (JWT-based)
- **Student Profiles** (Editable bio, social links, and skills)
- **Mentorship System** (Request & accept mentors)
- **Messaging System** (Direct messages between students)
- **Skills Management** (Self-evaluated skills)
- **Grades & Enrollment** (Program tracking for students)
- **API Documentation** (Swagger)

---

## ⚙️ Tech Stack

- **Backend**: [NestJS](https://nestjs.com/) with TypeScript
- **Database**: [PostgreSQL](https://www.postgresql.org/) with [Prisma ORM](https://www.prisma.io/)
- **Authentication**: JWT (JSON Web Tokens)
- **API Docs**: Swagger UI

---

## 📥 Installation

1. **Install dependencies**

   ```sh
   yarn install
   ```

2. **Set up environment variables**

   ```sh
   cp .env.example .env
   ```

---

## 🔧 Environment Variables (.env)

| Variable       | Description                       | Example                                    |
| -------------- | --------------------------------- | ------------------------------------------ |
| `DATABASE_URL` | PostgreSQL connection string      | `postgresql://user:pass@localhost:5432/db` |
| `JWT_SECRET`   | Secret key for JWT authentication | `your_jwt_secret`                          |
| `PORT`         | Port to run the server            | `5000`                                     |

---

## 🛠 Database Setup

1. **Run migrations**

   ```sh
   npx prisma migrate dev --name init
   ```

2. **Generate Prisma Client**

   ```sh
   npx prisma generate
   ```

---

## 🏃‍♂️ Running the Server

1. **Start the development server**

   ```sh
   yarn start:dev
   ```

2. **Start the production server**

   ```sh
   yarn build
   yarn start
   ```

---

## 📜 API Documentation (Swagger)

Once the server is running, open your browser and visit:

```
http://localhost:5000/api/docs
```

## 📌 Available API Routes

### **Auth**

| Method   | Endpoint         | Description         | Authentication  |
| -------- | ---------------- | ------------------- | --------------- |
| **POST** | `/auth/register` | Register a new user | No              |
| **POST** | `/auth/login`    | Login & get JWT     | No              |
| **GET**  | `/auth/me`       | Get logged-in user  | ✅ Bearer Token |

### **User**

| Method    | Endpoint          | Description                    | Authentication  |
| --------- | ----------------- | ------------------------------ | --------------- |
| **GET**   | `/user/profile`   | Get your profile               | ✅ Bearer Token |
| **PATCH** | `/user/profile`   | Edit bio, social links, skills | ✅ Bearer Token |
| **PATCH** | `/user/admin/:id` | Admin updates user profile     | ✅ Admin Only   |

### **Skills**

| Method   | Endpoint      | Description           | Authentication |
| -------- | ------------- | --------------------- | -------------- |
| **GET**  | `/skills`     | Get all skills        | No             |
| **GET**  | `/skills/:id` | Get specific skill    | No             |
| **POST** | `/skills`     | Add new skill (Admin) | ✅ Admin Only  |

### **Grades**

| Method  | Endpoint               | Description             | Authentication |
| ------- | ---------------------- | ----------------------- | -------------- |
| **GET** | `/grades`              | Get all grades          | No             |
| **GET** | `/grades/:id/students` | Get students in a grade | ✅ Admin Only  |

### **Mentorship**

| Method   | Endpoint              | Description               | Authentication  |
| -------- | --------------------- | ------------------------- | --------------- |
| **POST** | `/mentorship/request` | Request a mentor          | ✅ Bearer Token |
| **POST** | `/mentorship/accept`  | Accept mentorship request | ✅ Mentor Only  |

### **Messaging**

| Method   | Endpoint          | Description  | Authentication  |
| -------- | ----------------- | ------------ | --------------- |
| **POST** | `/messaging/send` | Send message | ✅ Bearer Token |

# Test

## Auth

### Register

✅ Should throw BadRequestException if user with the email already exists
✅ Should throw BadRequestException if grade is not found
✅ Should successfully register the user and return an access token

### Login

✅ Should throw UnauthorizedException for invalid credentials
✅ Should throw UnauthorizedException if user is not found
✅ Should successfully login and return an access token

## Grades

### Grades controller

✅ Should be defined
✅ Should return all grades
✅ Should return students for a specific grade

### Grades service

✅ Should return all grades
✅ Should return students by grade
✅ Should return empty array if no students in grade

## Mentorship

### Mentorship service

#### requestMentorship

✅ Should throw NotFoundException if receiver is not found
✅ Should create mentorship request if receiver is found

#### acceptMentorship

✅ Should throw NotFoundException if request is not found
✅ Should throw ForbiddenException if user is not authorized to accept the request
✅ Should create mentorship and update request status if request is accepted

### Mentorship controller

#### requestMentorship

✅ Should throw NotFoundException if receiver is not found
✅ Should create mentorship request if receiver is found

#### acceptMentorship

✅ Should throw NotFoundException if request is not found
✅ Should throw ForbiddenException if user is not authorized to accept the request
✅ Should create mentorship and update request status if request is accepted

## Messaging

### Messaging service

#### getUserMessages

✅ Should return messages for a given user
✅ Should return an empty array when there are no messages for a given user

#### sendMessage

✅ Should send a message successfully
✅ Should throw NotFoundException if receiver does not exist

### Messaging controller

#### sendMessage

✅ Should call sendMessage service method when user is authenticated
✅ Should throw an error when user is not authenticated

#### getUserMessages

✅ Should call getUserMessages service method when user is authenticated
✅ Should throw an error when user is not authenticated

## Prisma

### Prisma service

✅ Should be defined
✅ Should connect to the database on module init
✅ Should disconnect from the database on module destroy
✅ Should return the PrismaClient instance

## Skill

### SkillService

#### getAllSkills

✅ Should return an array of skills
✅ Should return an empty array if no skills are found

#### getSkillByName

✅ Should return a skill if found
✅ Should throw NotFoundException if skill is not found
