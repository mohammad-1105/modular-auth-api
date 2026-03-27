# Modular Social Backend 🚀

_A scalable, feature-based backend for building social media applications_

---

## 🧠 Overview

This project is a **production-oriented backend starter** for social media applications.

It is designed to help developers:

- understand real-world backend architecture
- integrate easily with any frontend (React, Next.js, mobile apps, etc.)
- learn how to structure scalable systems from day one

The codebase follows a **feature-based modular architecture** with strict separation of concerns.

---

## 🎯 Purpose

This is not just a demo project.

It is built to:

- serve as a **learning reference**
- act as a **starter backend**
- demonstrate **clean architecture in practice**

You should be able to clone this repo and directly plug it into your frontend.

---

## 🏗️ Architecture

- **Feature-Based Modular Monolith**
- Each feature is isolated and self-contained

### Layers inside each module:

- **Controller** → handles HTTP (req/res)
- **Service** → contains business logic
- **Repository** → interacts with database

---

## ⚙️ Tech Stack

- Node.js
- Express.js
- MongoDB (Mongoose) and much more

---

## 🔌 How to Use with Frontend

1. Run this backend locally
2. Connect your frontend to API endpoints
3. Use standard REST calls (fetch / axios)

Example:

```
POST /api/v1/user/register
POST /api/v1/user/login
```

This backend is framework-agnostic — it works with any frontend.

---

## 🧩 Design Principles

- No fat controllers
- No direct DB access in controllers
- Clear separation of concerns
- Explicit error handling
- Consistent API responses
- Environment-based configuration

---

## 🚨 Anti-Patterns Avoided

- Business logic inside routes
- God services
- Tight coupling between modules
- Hardcoded values
- Skipping validation

---

## 🚀 Getting Started

```bash
git clone https://github.com/mohammad-1105/modular-social-backend.git
cd modular-social-backend
pnpm install
```

### Run the server

```bash
pnpm run dev
```

---

## 📄 License

MIT License
