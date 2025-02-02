# Office of Career Services (OCS) - Technical Team Recruitment

## Project Overview

This project is built to demonstrate an API and frontend solution for accessing and displaying data from an SQL table hosted on Supabase. The backend fetches data from the SQL database and securely displays it on the frontend based on the user's role (admin or regular user). The sensitive information like the raw password is never transferred between the client and the server.

### Key Features:
- Fetches data from a Supabase SQL database.
- Uses MD5 hashing for password protection.
- Displays user data conditionally based on the role of the requester (admin can see all users; non-admins can see only their data).
- The frontend is built using Next.js, with a UI that hides sensitive data and ensures security during the communication process.

## Technologies Used
- **Frontend**: Next.js
- **Backend**: Next.js API routes
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Role-based access control (RBAC)
- **Password Hashing**: MD5

## How It Works

1. **Frontend**:
   - The user enters their `userID` and `password` on the frontend.
   - The password is hashed on the client-side using MD5.
   - The `userID` and the MD5 hash of the password are sent to the server via an API request.
   - The server checks the `role` of the user. If the user is an `admin`, all users' data is returned. Otherwise, only the current user's data is returned.

2. **Backend**:
   - The server verifies the password by checking the hashed value against the `password_hash` stored in the database.
   - It returns user data based on the role. If the role is `admin`, all data is returned; otherwise, only the data for the logged-in user is returned.

## Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/ocs-tech-recruitment.git
cd ocs-tech-recruitment
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables
       - Create a `.env` file in the root directory.
       - Copy the contents of `.env.example` and fill in the necessary details.

```bash
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
JWT_SECRET=your-jwt-secret-key
```

### 4. Run the Development Server

```bash
npm run dev
```
The application will be running on http://localhost:3000.

### 5. API Endpoint
The backend API endpoint is located at /api/3j54K1-protected-endpoint. This is a POST request that accepts userID and password_hash as the body.

Example request:
```bash
{
  "userid": "sampleuser",
  "password_hash": "hashed_password"
}
```

### 6. Deployed
The application is deployed on vercel.
live link - https://ocs-assign.vercel.app/

## Issues Faced and Solutions

1. **Security Concerns**:
   - Ensuring that no sensitive data (like `raw_password`) is transferred between the client and server.

2. **Supabase Integration**:
   - Had to ensure proper handling of user authentication and role-based access control.

3. **Data Fetching**:
   - Ensuring that the data is fetched in a secure and optimal way without exposing any sensitive information.

## Conclusion
This project showcases how to develop a secure full-stack web application with role-based access and user data fetching from Supabase. The frontend provides a clean UI while ensuring that no sensitive data is exposed to the client-side, keeping the application secure.