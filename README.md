# Employee Management System

A full-stack Employee Management System built with React, Apollo Client, Express, Apollo Server, GraphQL, and MongoDB. The app supports employee records, employee community groups, recreation activities, activity registration, and a simple tic-tac-toe recreation page.

## Features

- View employee records
- Add new employees
- Manage employee community groups
- Register for recreation activities
- Browse recreation events and gallery
- Play a built-in tic-tac-toe game
- GraphQL API backed by MongoDB

## Tech Stack

Frontend:

- React 18
- React Router
- Apollo Client
- Bootstrap / React Bootstrap
- React Hook Form
- React Calendar

Backend:

- Node.js
- Express
- Apollo Server
- GraphQL
- MongoDB
- Mongoose

## Project Structure

```text
Employee Management System/
+-- ems-back/        # Express, Apollo Server, GraphQL, MongoDB backend
+-- ems-front/       # React frontend
+-- README.md
+-- LICENSE
+-- .gitignore
```

## Prerequisites

- Node.js
- npm
- MongoDB Atlas or a local MongoDB connection string

## Environment Variables

Create a backend environment file from the example:

```powershell
cd ems-back
Copy-Item .env.example .env
```

Update `ems-back/.env`:

```env
MONGO_URI=your_mongodb_connection_string
PORT=4000
ADMIN_USERNAME=admin
ADMIN_PASSWORD=change-me
AUTH_SECRET=change-this-long-random-secret
```

The real `.env` file is ignored by Git and should not be committed.

## Installation

Install backend dependencies:

```powershell
cd ems-back
npm install
```

Install frontend dependencies:

```powershell
cd ../ems-front
npm install
```

## Run Locally

Start the backend:

```powershell
cd ems-back
npm start
```

The GraphQL API runs at:

```text
http://localhost:4000/graphql
```

Start the frontend in a second terminal:

```powershell
cd ems-front
npm start
```

The React app runs at:

```text
http://localhost:3000
```

## Build

Create a production frontend build:

```powershell
cd ems-front
npm run build
```

## Git Notes

This repository is configured to ignore local-only files and generated folders:

- `.env`
- `node_modules/`
- `build/`

## License

This project is licensed under the MIT License.
