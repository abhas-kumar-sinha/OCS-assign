# Office of Career Services (OCS) - Technical Team Recruitment Project

## Project Overview

This project demonstrates a full-stack solution for securely accessing and displaying user data from a PostgreSQL database hosted on Supabase. It features a Next.js frontend and backend API routes that work together to implement role-based access control. User authentication is handled securely by never transmitting raw passwords; instead, MD5 hashing is used on the client-side before sending credentials to the server. The application ensures that sensitive data is never exposed to the client and that users can only access data relevant to their role (admin or regular user).

### Key Features:

- **Secure Data Fetching**: Retrieves user data from a Supabase PostgreSQL database.
- **Password Protection**: Employs MD5 hashing for password protection to avoid transmitting raw passwords.
- **Role-Based Access Control (RBAC)**: Implements RBAC to display user data conditionally based on the user's role. Admins can view all user data, while regular users can only view their own.
- **Next.js Frontend**: Built with Next.js to provide a responsive and secure user interface.
- **API Endpoint Security**: Utilizes a protected API endpoint to handle authentication and data retrieval securely.
- **Environment Variable Configuration**: Uses environment variables for sensitive configuration to enhance security.

## Technologies Used

- **Frontend**:
  - [Next.js](https://nextjs.org/) - React framework for building performant web applications.
  - [React](https://reactjs.org/) - JavaScript library for building user interfaces.
- **Backend**:
  - [Next.js API Routes](https://nextjs.org/docs/api-routes/introduction) - Serverless functions for handling API requests.
- **Database**:
  - [Supabase](https://supabase.com/) - Cloud-based PostgreSQL database service.
- **Authentication**:
  - Role-Based Access Control (RBAC)
- **Password Hashing**:
  - [MD5](https://en.wikipedia.org/wiki/MD5) - Cryptographic hash function used to hash passwords on the client-side.

## Architecture Diagram

```
+-------------------+       +-------------------------+       +---------------------+
|    Next.js        |       |   Next.js API Route     |       |      Supabase       |
|   (Frontend)      |       |      (Backend)         |       |   (PostgreSQL DB)   |
+-------------------+       +-------------------------+       +---------------------+
| 1. User Input     |------>| 2. Receive credentials  |------>| 4. Verify credentials|
| (userID, password)|       | (userID, password_hash) |       | against password_hash|
+-------------------+       +-------------------------+       +---------------------+
| 6. Display Data   |<------| 5. Fetch user data      |<------| 3. Return User Role  |
| (based on role)   |       | (based on user role)    |       |  and hashed password |
+-------------------+       +-------------------------+       +---------------------+
```

## How It Works

1. **User Authentication**:
   - The user enters their `userID` and `password` on the frontend.
   - The password is immediately hashed on the client-side using MD5.
   - The `userID` and the MD5 hash of the password (`password_hash`) are sent to the server via a POST request to the `/api/3j54K1-protected-endpoint` API endpoint.

2. **Backend Verification**:
   - The server receives the `userID` and `password_hash`.
   - It queries the Supabase database to retrieve the user's stored `password_hash` and `role`.
   - The server compares the received `password_hash` with the stored `password_hash` to authenticate the user.

3. **Role-Based Data Retrieval**:
   - If the user is authenticated, the server checks the user's `role`.
   - If the `role` is `admin`, the server fetches all user data from the database.
   - If the `role` is a regular user, the server fetches only the data associated with the logged-in `userID`.

4. **Data Transmission**:
   - The server sends the fetched user data back to the frontend.

5. **Frontend Display**:
   - The frontend receives the user data and displays it to the user. The display is conditional based on the user’s role, ensuring that sensitive information is hidden and that users only see the data they are authorized to view.

## Setup Instructions

### Prerequisites

- [Node.js](https://nodejs.org/) (v16 or higher)
- [npm](https://www.npmjs.com/) (v7 or higher)
- [Supabase Account](https://supabase.com/) - Required to set up the database.
- [Git](https://git-scm.com/)

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

- Create a `.env.local` file in the root directory.
- Copy the contents of `.env.example` and fill in the necessary details.

```bash
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
JWT_SECRET=your-jwt-secret-key
```

> **Note**: Replace `your-supabase-url`, `your-supabase-anon-key`, and `your-jwt-secret-key` with your actual Supabase URL, Supabase anon key, and a secure JWT secret key.  Keep the `JWT_SECRET` key highly secure for the application's security.

### 4. Supabase Database Setup

1.  **Create a Supabase Project**:
    - Go to [Supabase](https://supabase.com/) and create a new project.
2.  **Create a Table**:
    - In your Supabase project, create a table named `users` with the following schema:

    ```sql
    CREATE TABLE users (
        id SERIAL PRIMARY KEY,
        userid VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        role VARCHAR(50) NOT NULL,
        email VARCHAR(255),
        full_name VARCHAR(255),
        created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT now()
    );
    ```

3.  **Insert Sample Data**:
    - Insert sample user data into the `users` table:

    ```sql
    INSERT INTO users (userid, password_hash, role, email, full_name) VALUES
    ('admin', '21232f297a57a5a743894a0e4a801fc3', 'admin', 'admin@example.com', 'Admin User'),
    ('user1', 'b45cffe084b980d234951a09a927194a', 'user', 'user1@example.com', 'User One'),
    ('user2', '1a779714fa65c4967088093f399c6b6a', 'user', 'user2@example.com', 'User Two');
    ```

    > **Note**: The `password_hash` values are MD5 hashes of the passwords. For example, the password for `admin` is `admin`, for `user1` is `password`, and for `user2` is `12345`.

### 5. Run the Development Server

```bash
npm run dev
```

The application will be running on `http://localhost:3000`.

### 6. API Endpoint

The backend API endpoint is located at `/api/3j54K1-protected-endpoint`. This endpoint accepts POST requests with `userid` and `password_hash` in the request body.

Example request:

```json
{
  "userid": "sampleuser",
  "password_hash": "hashed_password"
}
```

You can test this endpoint using tools like `curl` or `Postman`.

### 7. Deployment

The application is deployed on Vercel.

- Live link: [https://ocs-assign.vercel.app/](https://ocs-assign.vercel.app/)

> **Note**: To deploy your own version, connect your GitHub repository to Vercel and follow the deployment instructions on the Vercel platform. Make sure to set the environment variables in your Vercel project settings.

## Issues Faced and Solutions

1. **Security Concerns**:
   - **Issue**: Ensuring that no sensitive data (like `raw_password`) is transmitted between the client and server.
   - **Solution**: Implemented client-side MD5 hashing to hash the password before sending it to the server. This ensures that the raw password is never exposed.

2. **Supabase Integration**:
   - **Issue**: Ensuring proper handling of user authentication and role-based access control.
   - **Solution**: Implemented role-based checks in the API endpoint to verify the user's role and return data accordingly. Used Supabase's built-in security features to protect the database.

3. **Data Fetching**:
   - **Issue**: Ensuring that the data is fetched in a secure and optimal way without exposing any sensitive information.
   - **Solution**: Implemented server-side data filtering based on the user's role. The server only returns the data that the user is authorized to access.

## Future Enhancements

- **Implement JWT (JSON Web Tokens)**: Enhance security by using JWT for session management and authentication.
- **Implement Input Validation**: Add input validation on both the frontend and backend to prevent injection attacks and ensure data integrity.
- **Improve Password Security**: Consider using more robust password hashing algorithms like bcrypt or Argon2 instead of MD5.
- **Add Logging**: Implement logging to track user activity and monitor the application for potential security threats.
- **Implement Rate Limiting**: Protect the API endpoint by implementing rate limiting to prevent abuse.

## Conclusion

This project demonstrates a secure full-stack web application with role-based access control and user data fetching from Supabase. The frontend provides a clean UI while ensuring that no sensitive data is exposed to the client-side, thus keeping the application secure. The application implements key security measures, such as password hashing and role-based access control, to protect user data and prevent unauthorized access.
