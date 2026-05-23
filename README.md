# DevPulse – Internal Tech Issue & Feature Tracker

DevPulse is a backend API for software teams to report bugs, suggest feature requests, and manage issue workflow with role-based access control.

## Live URL

```txt
https://my-project-gamma-drab.vercel.app
```

## Features

- User registration and login
- JWT based authentication
- Role based authorization
- Two user roles:
  - contributor
  - maintainer
- Contributor can:
  - Register and login
  - Create issues
  - View all issues
  - Update own open issues
- Maintainer can:
  - Update any issue
  - Change issue status
  - Delete any issue
- Issue filtering by:
  - type
  - status
  - sort order
- Passwords are hashed using bcrypt
- PostgreSQL database with raw SQL queries
- Deployed backend on Vercel

## Tech Stack

- Node.js
- TypeScript
- Express.js
- PostgreSQL
- pg
- Raw SQL
- bcryptjs
- jsonwebtoken
- Vercel
- NeonDB

## Project Setup

### 1. Clone the repository

```bash
git clone <your-repository-url>
cd my_project
```

### 2. Install dependencies

```bash
npm install
```

### 3. Create `.env` file

Create a `.env` file in the root folder.

```env
CONNECTIONSTRING=your_postgresql_connection_string
PORT=5000
jwt_secret=your_jwt_secret
```

### 4. Run the project locally

```bash
npm run dev
```

Local server will run on:

```txt
http://localhost:5000
```

### 5. Build the project

```bash
npm run build
```

### 6. Deploy to Vercel

```bash
vercel --prod
```

## API Endpoints

### Root Route

```txt
GET /
```

Response:

```json
{
  "message": "express server",
  "author": "next level"
}
```

---

## Authentication Module

### 1. User Registration

```txt
POST /api/auth/signup
```

Access: Public

Request body:

```json
{
  "name": "John Doe",
  "email": "john.doe@devpulse.com",
  "password": "securePassword123",
  "role": "contributor"
}
```

Success response:

```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "id": 1,
    "name": "John Doe",
    "email": "john.doe@devpulse.com",
    "role": "contributor",
    "created_at": "2026-01-20T09:00:00Z",
    "updated_at": "2026-01-20T09:00:00Z"
  }
}
```

---

### 2. User Login

```txt
POST /api/auth/login
```

Access: Public

Request body:

```json
{
  "email": "john.doe@devpulse.com",
  "password": "securePassword123"
}
```

Success response:

```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "jwt_token_here",
    "user": {
      "id": 1,
      "name": "John Doe",
      "email": "john.doe@devpulse.com",
      "role": "contributor",
      "created_at": "2026-01-20T09:00:00Z",
      "updated_at": "2026-01-20T09:00:00Z"
    }
  }
}
```

---

## Issues Module

### 3. Create Issue

```txt
POST /api/issues
```

Access: Authenticated users

Headers:

```txt
Authorization: JWT_TOKEN
Content-Type: application/json
```

Request body:

```json
{
  "title": "Database connection timeout under load",
  "description": "Pool exhausts after 50+ concurrent queries, causing 500 errors",
  "type": "bug"
}
```

Success response:

```json
{
  "success": true,
  "message": "Issue created successfully",
  "data": {
    "id": 45,
    "title": "Database connection timeout under load",
    "description": "Pool exhausts after 50+ concurrent queries, causing 500 errors",
    "type": "bug",
    "status": "open",
    "reporter_id": 1,
    "created_at": "2026-01-20T10:30:00Z",
    "updated_at": "2026-01-20T10:30:00Z"
  }
}
```

---

### 4. Get All Issues

```txt
GET /api/issues
```

Access: Public

Optional query parameters:

```txt
sort=newest
sort=oldest
type=bug
type=feature_request
status=open
status=in_progress
status=resolved
```

Example:

```txt
GET /api/issues?sort=newest&type=bug&status=open
```

Success response:

```json
{
  "success": true,
  "data": [
    {
      "id": 45,
      "title": "Database connection timeout under load",
      "description": "Pool exhausts after 50+ concurrent queries, causing 500 errors",
      "type": "bug",
      "status": "open",
      "reporter": {
        "id": 1,
        "name": "John Doe",
        "role": "contributor"
      },
      "created_at": "2026-01-20T10:30:00Z",
      "updated_at": "2026-01-20T14:45:00Z"
    }
  ]
}
```

---

### 5. Get Single Issue

```txt
GET /api/issues/:id
```

Access: Public

Example:

```txt
GET /api/issues/45
```

Success response:

```json
{
  "success": true,
  "data": {
    "id": 45,
    "title": "Database connection timeout under load",
    "description": "Pool exhausts after 50+ concurrent queries, causing 500 errors",
    "type": "bug",
    "status": "open",
    "reporter": {
      "id": 1,
      "name": "John Doe",
      "role": "contributor"
    },
    "created_at": "2026-01-20T10:30:00Z",
    "updated_at": "2026-01-20T14:45:00Z"
  }
}
```

---

### 6. Update Issue

```txt
PATCH /api/issues/:id
```

Access:

- Maintainer can update any issue
- Contributor can update only own issue if status is open

Headers:

```txt
Authorization: JWT_TOKEN
Content-Type: application/json
```

Request body:

```json
{
  "title": "Updated issue title",
  "description": "Updated description with reproduction steps",
  "type": "bug"
}
```

Success response:

```json
{
  "success": true,
  "message": "Issue updated successfully",
  "data": {
    "id": 45,
    "title": "Updated issue title",
    "description": "Updated description with reproduction steps",
    "type": "bug",
    "status": "open",
    "reporter_id": 1,
    "created_at": "2026-01-20T10:30:00Z",
    "updated_at": "2026-01-20T14:45:00Z"
  }
}
```

---

### 7. Delete Issue

```txt
DELETE /api/issues/:id
```

Access: Maintainer only

Headers:

```txt
Authorization: JWT_TOKEN
```

Success response:

```json
{
  "success": true,
  "message": "Issue deleted successfully"
}
```

---

## Database Schema Summary

### users Table

| Field | Type | Description |
|---|---|---|
| id | SERIAL PRIMARY KEY | Auto-increment user id |
| name | VARCHAR | User full name |
| email | VARCHAR UNIQUE | User email address |
| password | TEXT | Hashed password |
| role | VARCHAR | contributor or maintainer |
| created_at | TIMESTAMP | Account created time |
| updated_at | TIMESTAMP | Account updated time |

### issues Table

| Field | Type | Description |
|---|---|---|
| id | SERIAL PRIMARY KEY | Auto-increment issue id |
| title | VARCHAR(150) | Issue title |
| description | TEXT | Issue description |
| type | VARCHAR | bug or feature_request |
| status | VARCHAR | open, in_progress, resolved |
| reporter_id | INT | User id of issue creator |
| created_at | TIMESTAMP | Issue created time |
| updated_at | TIMESTAMP | Issue updated time |

## Authentication Flow

1. User signs up or logs in.
2. Server validates email and password.
3. Password is compared using bcrypt.
4. Server returns a JWT token.
5. Client sends token in Authorization header.
6. Server verifies token before protected actions.
7. Role is checked before maintainer-only operations.

## Testing

Example live API test:

```txt
GET https://my-project-gamma-drab.vercel.app/
```

```txt
GET https://my-project-gamma-drab.vercel.app/api/issues
```

```txt
POST https://my-project-gamma-drab.vercel.app/api/auth/login
```

## Security Notes

- Passwords are never returned in API responses.
- Passwords are hashed before saving to database.
- Protected routes require JWT token.
- Role permissions are checked before update and delete operations.
- `.env` file should not be committed to GitHub.

## Author

Next Level Developer
