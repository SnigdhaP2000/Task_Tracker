# Task_Tracker
(https://roadmap.sh/projects/task-tracker)

A RESTful API for managing tasks, built with Node.js, Express.js, and TypeScript using a clean folder structure (Routes, Controllers, Middleware, Services). Powered by PostgreSQL and integrated with Redis and JWT-based authentication for secure access.

## 🧩 Project Highlights

- 📌 Create, update, delete, and list tasks
- 🧠 Follows a modular structure: `routes/`, `controllers/`, `middleware/`, and `services/`
- 🔐 Secure endpoints using JWT authentication and Redis for token storage
- 🧭 Role-based access and user permission checks via middleware
- 🔄 Uses same DB structure and session logic as the authentication service

## 🛠️ Tech Stack

- **Language:** TypeScript  
- **Backend:** Node.js, Express.js  
- **Database:** PostgreSQL  
- **Authentication:** JWT + Redis  
- **Cloud Services:** AWS SSM for secrets (optional, if integrating with existing auth system)

## 📂 Folder Structure
src/
│
├── routes/ # Defines all API routes
├── controllers/ # Handles request logic
├── middleware/ # Auth, logging, error handling
├── services/ # Business logic and DB queries
└── utils/ # Utility functions (e.g., DB connection, token helpers)

## 📮 Postman Collection

You can use the following public Postman collection to test the Task Tracker API:

🔗 [View Postman Collection](https://www.postman.com/satellite-administrator-61745711/my-microservices/collection/uq2e1w5/my-microservices?origin=tab-menu)

This collection includes:
- All key endpoints for authentication and task operations
- Pre-configured requests with example headers and payloads
- JWT-based auth flows and role-based access testing
- Environment variables for quick setup and reuse

Import the collection into Postman to start testing the full flow from user login to task management.
