# Zorvyn API Documentation

## Overview
Zorvyn is a financial management API built with Node.js, TypeScript, and MongoDB. It provides user authentication, financial record management, and analytics features with role-based access control.

## Base URL
```
http://localhost:3000
```

## Authentication
The API uses **JWT (JSON Web Tokens)** for authentication. Include the token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

## Rate Limiting
All endpoints are rate-limited to **100 requests per 15 minutes**.

---

## Authentication Endpoints

### 1. Create User (Register)
- **Endpoint**: `POST /createUser`
- **Authentication**: None required
- **Rate Limited**: Yes
- **Description**: Register a new user account

**Request Body**:
```json
{
  "email": "user@example.com",
  "password": "securePassword123",
  "name": "John Doe"
}
```

**Response**:
```json
{
  "success": true,
  "data": {
    "_id": "userId",
    "email": "user@example.com",
    "name": "John Doe"
  }
}
```

---

### 2. Login User
- **Endpoint**: `POST /loginUser`
- **Authentication**: None required
- **Rate Limited**: Yes
- **Description**: Authenticate user and receive JWT token

**Request Body**:
```json
{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

**Response**:
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "data": {
    "_id": "userId",
    "email": "user@example.com",
    "role": "ADMIN"
  }
}
```

---

## User Management Endpoints (Admin Only)

### 3. Get All Users
- **Endpoint**: `GET /getallusers`
- **Authentication**: Required (Admin role)
- **Rate Limited**: Yes
- **Description**: Retrieve all users with pagination

**Query Parameters**:
- `page` (optional, default: 1) - Page number
- `limit` (optional, default: 10, max: 50) - Records per page

**Response**:
```json
{
  "success": true,
  "data": [
    {
      "_id": "userId",
      "email": "user@example.com",
      "name": "John Doe",
      "isActive": true,
      "role": "USER"
    }
  ],
  "pagination": {
    "current": 1,
    "pages": 5,
    "total": 50,
    "hasNext": true,
    "hasPrev": false
  }
}
```

---

### 4. Get User by ID
- **Endpoint**: `GET /getuserid/:id`
- **Authentication**: Required (Admin role)
- **Rate Limited**: Yes
- **Description**: Get specific user details

**URL Parameters**:
- `id` (required) - User ID

**Response**:
```json
{
  "success": true,
  "data": {
    "_id": "userId",
    "email": "user@example.com",
    "name": "John Doe",
    "isActive": true,
    "role": "USER"
  }
}
```

---

### 5. Update User Status
- **Endpoint**: `PUT /upadatestatus/:id`
- **Authentication**: Required (Admin role)
- **Rate Limited**: Yes
- **Description**: Activate or deactivate a user account

**URL Parameters**:
- `id` (required) - User ID

**Request Body**:
```json
{
  "isActive": true
}
```

**Response**:
```json
{
  "success": true,
  "data": {
    "_id": "userId",
    "email": "user@example.com",
    "isActive": true,
    "name": "John Doe"
  }
}
```

---

### 6. Delete User
- **Endpoint**: `DELETE /delteuser/:id`
- **Authentication**: Required (Admin role)
- **Rate Limited**: Yes
- **Description**: Permanently delete a user account

**URL Parameters**:
- `id` (required) - User ID

**Response**:
```json
{
  "success": true,
  "msg": "User deleted successfully"
}
```

---

## Financial Records Endpoints (Admin Only)

### 7. Create Financial Record
- **Endpoint**: `POST /createRecord`
- **Authentication**: Required (Admin role)
- **Rate Limited**: Yes
- **Description**: Create a new financial record

**Request Body**:
```json
{
  "amount": 1500.50,
  "type": "income",
  "category": "salary",
  "date": "2024-03-15T10:30:00Z",
  "description": "Monthly salary",
  "tags": ["salary", "monthly"]
}
```

**Response**:
```json
{
  "success": true,
  "data": {
    "_id": "recordId",
    "amount": 1500.50,
    "type": "income",
    "category": "salary",
    "date": "2024-03-15T10:30:00Z",
    "description": "Monthly salary",
    "tags": ["salary", "monthly"],
    "createdBy": "userId",
    "createdAt": "2024-03-15T10:30:00Z"
  }
}
```

---

### 8. Get Financial Records
- **Endpoint**: `GET /getRecords`
- **Authentication**: Required (Admin role)
- **Rate Limited**: Yes
- **Description**: Retrieve financial records with filtering and pagination

**Query Parameters**:
- `page` (optional, default: 1) - Page number
- `limit` (optional, default: 10, max: 50) - Records per page
- `startDate` (optional) - Filter from date (ISO 8601 format)
- `endDate` (optional) - Filter to date (ISO 8601 format)
- `category` (optional) - Filter by category
- `type` (optional) - Filter by type (income/expense)

**Response**:
```json
{
  "success": true,
  "count": 15,
  "pagination": {
    "current": 1,
    "pages": 3,
    "total": 32,
    "hasNext": true,
    "hasPrev": false
  },
  "data": [
    {
      "_id": "recordId",
      "amount": 1500.50,
      "type": "income",
      "category": "salary",
      "date": "2024-03-15T10:30:00Z",
      "description": "Monthly salary"
    }
  ]
}
```

---

### 9. Update Financial Record
- **Endpoint**: `PUT /updateRecord/:id`
- **Authentication**: Required (Admin role)
- **Rate Limited**: Yes
- **Description**: Update an existing financial record

**URL Parameters**:
- `id` (required) - Record ID

**Request Body**:
```json
{
  "amount": 1600,
  "description": "Updated salary"
}
```

**Response**:
```json
{
  "success": true,
  "data": {
    "_id": "recordId",
    "amount": 1600,
    "type": "income",
    "category": "salary",
    "description": "Updated salary",
    "updatedBy": "userId"
  }
}
```

---

### 10. Delete Financial Record
- **Endpoint**: `DELETE /deleteRecord/:id`
- **Authentication**: Required (Admin role)
- **Rate Limited**: Yes
- **Description**: Soft delete a financial record (marks as deleted, doesn't remove from DB)

**URL Parameters**:
- `id` (required) - Record ID

**Response**:
```json
{
  "success": true,
  "msg": "Record deleted successfully"
}
```

---

## Financial Analytics Endpoints (Viewer, Analyst, Admin)

### 11. Monthly Summary
- **Endpoint**: `GET /monthlysummary`
- **Authentication**: Required (Viewer, Analyst, or Admin)
- **Rate Limited**: Yes
- **Description**: Get monthly financial summary (income, expense, balance)

**Query Parameters**:
- `month` (required) - Month number (1-12)
- `year` (required) - Year (e.g., 2024)

**Response**:
```json
{
  "success": true,
  "data": {
    "totalIncome": 5000,
    "totalExpense": 2500,
    "balance": 2500
  }
}
```

---

### 12. Yearly Summary
- **Endpoint**: `GET /yearlysummary`
- **Authentication**: Required (Viewer, Analyst, or Admin)
- **Rate Limited**: Yes
- **Description**: Get yearly financial summary

**Query Parameters**:
- `year` (required) - Year (e.g., 2024)

**Response**:
```json
{
  "success": true,
  "data": {
    "totalIncome": 60000,
    "totalExpense": 30000,
    "balance": 30000
  }
}
```

---

### 13. User Summary
- **Endpoint**: `GET /usersummary/:id`
- **Authentication**: Required (Viewer, Analyst, or Admin)
- **Rate Limited**: Yes
- **Description**: Get financial summary for a specific user

**URL Parameters**:
- `id` (required) - User ID

**Response**:
```json
{
  "success": true,
  "data": {
    "totalIncome": 60000,
    "totalExpense": 30000,
    "balance": 30000,
    "userId": "userId",
    "username": "John Doe"
  }
}
```

---

### 14. Overall Summary
- **Endpoint**: `GET /summary`
- **Authentication**: Required (Viewer, Analyst, or Admin)
- **Rate Limited**: Yes
- **Description**: Get overall financial summary for all records

**Response**:
```json
{
  "success": true,
  "data": {
    "totalIncome": 100000,
    "totalExpense": 50000,
    "balance": 50000,
    "recordCount": 250
  }
}
```

---

## User Roles & Permissions

| Role | Access |
|------|--------|
| **ADMIN** | ✅ User management, Record management, All analytics |
| **ANALYST** | ✅ Analytics only (all summary endpoints) |
| **VIEWER** | ✅ Analytics only (read-only summary endpoints) |
| **USER** | ❌ No access to admin/analytics endpoints |

---

## Error Responses

### 400 - Bad Request
```json
{
  "success": false,
  "msg": "Invalid request data"
}
```

### 401 - Unauthorized
```json
{
  "success": false,
  "msg": "Unauthorized"
}
```

### 404 - Not Found
```json
{
  "success": false,
  "msg": "User not found"
}
```

### 500 - Server Error
```json
{
  "success": false,
  "msg": "Server Error"
}
```

---

## Data Security
- **Passwords** are never returned in responses (excluded with `.select("-password")`)
- **Client-Side Field Level Encryption (CSFLE)** is implemented for sensitive data
- **Soft Deletes** are used for records (marked as deleted, not removed from database)
- **JWT tokens** expire after a configured duration
- **Rate limiting** prevents abuse (100 requests per 15 minutes)

---

## Example Usage

### Register & Login Flow
```bash
# 1. Create user
curl -X POST http://localhost:3000/createUser \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"securePassword123","name":"John Doe"}'

# 2. Login
curl -X POST http://localhost:3000/loginUser \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"securePassword123"}'

# 3. Use token for subsequent requests
curl -X GET http://localhost:3000/getallusers \
  -H "Authorization: Bearer <your_jwt_token>"
```

---

## Environment Setup
Create a `.env` file with:
```env
MONGODB_URI=mongodb://localhost:27017/zorvyn
KEY_VAULT_NAMESPACE=encryption.__keyVault
LOCAL_MASTER_KEY=your_base64_encoded_96_byte_key
JWT_SECRET=your_jwt_secret
PORT=3000
```

---

## Support
For issues or questions, visit: https://github.com/ash213-gif/zorvyn_
