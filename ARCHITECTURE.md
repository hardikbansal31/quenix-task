# Architecture Document

## 1. System Overview

This is a full-stack Task Management application built to manage daily tasks securely. The system consists of three distinct layers:

1. **Frontend (Next.js):** Handles the user interface, routing, and state. It communicates with the backend via a REST API using a custom Axios instance.
2. **Backend (NestJS):** Acts as the central API gateway. It validates incoming requests, enforces authentication/authorization, and executes business logic.
3. **Database (MongoDB):** A NoSQL database that persistently stores user credentials and task records, accessed by the backend via Mongoose.

## 2. Folder Structure

The repository is split into two primary directories to separate concerns:

- **`/frontend`:** Built with Next.js using the modern App Router (`src/app`).
  - `src/app`: Contains page-level routing (`/login`, `/register`, and the `/` dashboard).
  - `src/lib`: Contains utility files, notably the `api.ts` Axios interceptor to keep components clean of token-attachment logic.
- **`/backend`:** Built with NestJS, utilizing a domain-driven structure.
  - `src/auth`: Contains the User schema, authentication service, controller, and JWT passport strategy.
  - `src/tasks`: Contains the Task schema, CRUD service, controller, and DTOs for validation.
  - Structuring by domain (Auth vs Tasks) ensures that as the application grows, features remain isolated and maintainable.

## 3. Database Schema

We use two primary Mongoose schemas:

**User Schema**

```typescript
@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, unique: true })
  email: string; // Type: String. Purpose: Unique identifier for login.

  @Prop({ required: true })
  password: string; // Type: String. Purpose: Stores the bcrypt-hashed password.
}
```

**Task Schema**

```typescript
@Schema({ timestamps: true })
export class Task {
  @Prop({ required: true })
  title: string; // Type: String. Purpose: The main heading of the task.

  @Prop({ required: true, enum: TaskStatus, default: TaskStatus.PENDING })
  status: TaskStatus; // Type: Enum (PENDING, IN_PROGRESS, COMPLETED). Purpose: Tracks progress.

  @Prop({ required: true, type: Date })
  dueDate: Date; // Type: Date. Purpose: Deadline for the task.

  @Prop({ required: true, enum: TaskPriority, default: TaskPriority.MEDIUM })
  priority: TaskPriority; // Type: Enum (LOW, MEDIUM, HIGH). Purpose: Sorting urgency.

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: "User", required: true })
  user: User; // Type: ObjectId. Purpose: Creates a relational link to the User who created the task, ensuring data privacy.
}
```

## 4. API Endpoints

| Method | Path             | Auth Required | Request Body                               | Response Shape            |
| :----- | :--------------- | :------------ | :----------------------------------------- | :------------------------ |
| POST   | `/auth/register` | No            | `{ email, password }`                      | `{ message: string }`     |
| POST   | `/auth/login`    | No            | `{ email, password }`                      | `{ accessToken: string }` |
| GET    | `/tasks`         | Yes           | _Query params (optional)_                  | `Task[]`                  |
| POST   | `/tasks`         | Yes           | `{ title, dueDate }`                       | `Task`                    |
| PATCH  | `/tasks/:id`     | Yes           | `{ title?, status?, priority?, dueDate? }` | `Task`                    |
| DELETE | `/tasks/:id`     | Yes           | None                                       | `Task`                    |

## 5. Auth Flow

Authentication is handled via JSON Web Tokens (JWT):

1. **Register:** User submits an email and password. The backend hashes the password using `bcrypt` and saves the User to MongoDB.
2. **Login:** User submits credentials. Backend verifies the password with `bcrypt`. If valid, it signs a JWT containing the user's `email` and `_id` and returns it.
3. **Token Storage:** The Next.js client stores the JWT in the browser's `localStorage`.
4. **Protected Routes:** A custom Axios interceptor automatically attaches this JWT as a `Bearer` token in the `Authorization` header of all outbound requests.
5. **Backend Validation:** NestJS routes protected by `@UseGuards(AuthGuard())` intercept the request, validate the JWT signature via Passport, and inject the verified User object into the request context for the controller to use.

## 6. AI Tools Used

- **Tool:** Gemini
- **Parts Built:** Scaffolded the initial NestJS boilerplate, generated the Next.js Tailwind UI code, and helped draft this architecture document.
- **Review & Changes:** I actively reviewed the AI's generated code. For instance, I noticed the initial CRUD generation did not securely link Tasks to the Users who created them. I prompted the AI to refactor the data model, add a custom `@GetUser()` decorator, and update the database queries to filter by the authenticated user's ID. I also manually debugged a CORS issue between the two local ports.

## 7. Decisions & Trade-offs

- **Decision:** Used Tailwind CSS for the frontend.
  - _Why:_ Prioritized a clean, functional UI over a heavily customized design to move quickly and ensure readability.
- **Decision:** Centralized Axios instance with an interceptor.
  - _Why:_ Prevented code duplication. Rather than manually grabbing the token and setting headers in every single API call, the interceptor handles it invisibly.
- **Trade-off:** Storing the JWT in `localStorage`.
  - _Why/Improvement:_ This is easy to implement but vulnerable to Cross-Site Scripting (XSS) attacks. With more time, I would implement HttpOnly cookies to store the token, requiring a slightly more complex backend setup but providing significantly better security.
