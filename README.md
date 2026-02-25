# Full-Stack Task Manager

A full-stack Task Management application built with Next.js, NestJS, and MongoDB.

## Prerequisites

Before you begin, ensure you have the following installed on your machine:

- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [npm](https://www.npmjs.com/) (usually comes with Node.js)
- [MongoDB](https://www.mongodb.com/try/download/community) running locally (default port 27017)

## Getting Started

Follow these step-by-step instructions to run the project locally.

### 1. Backend Setup (NestJS)

1. Open a terminal and navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install the dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the root of the `/backend` directory based on the provided example. It should contain:
   ```env
   MONGODB_URI=mongodb://localhost:27017/task-manager
   JWT_SECRET=super_secret_dev_key
   PORT=3001
   ```
4. Start the NestJS development server:
   ```bash
   npm run start:dev
   ```
   _The backend will start on `http://localhost:3001`._

### 2. Frontend Setup (Next.js)

1. Open a **new** terminal window and navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install the dependencies:
   ```bash
   npm install
   ```
3. Create a `.env.local` file in the root of the `/frontend` directory. It should contain:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:3001
   ```
4. Start the Next.js development server:
   ```bash
   npm run dev
   ```
   _The frontend will start on `http://localhost:3000`._

### 3. Usage

Open your browser and navigate to `http://localhost:3000`. You can now register a new user, log in, and begin managing tasks.

## Documentation

- See `ARCHITECTURE.md` for a detailed breakdown of the system design, schemas, and API endpoints.
- See `AI_LOG.md` for documentation regarding the use of AI tools during development.
