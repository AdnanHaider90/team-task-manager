===========================================================
  TEAM TASK MANAGER - Full Stack Web Application
  Built for: Ethara.AI Software Engineer Assessment
  Developer: Md. Adnan Haider
===========================================================

PROJECT OVERVIEW
----------------
A full-stack Team Task Manager web application where users can create
projects, assign tasks, and track progress with role-based access control
(Admin / Member).

TECH STACK
----------
Backend  : Java 17 + Spring Boot 3.2 + Spring Security + JWT
Frontend : React 18 + Vite + React Router
Database : MySQL 8
Deploy   : Railway

KEY FEATURES
------------
1. Authentication & Authorization
   - User Registration and Login with JWT tokens
   - Role-based access: ADMIN and MEMBER roles
   - Secure password hashing with BCrypt

2. Project Management
   - Create, edit, delete projects (Admin/Creator only)
   - Add team members to projects
   - View all projects you are part of

3. Task Management
   - Create tasks with title, description, priority (LOW/MEDIUM/HIGH)
   - Task statuses: TODO -> IN_PROGRESS -> DONE
   - Assign tasks to team members
   - Set due dates with overdue detection

4. Dashboard
   - Live stats: total projects, tasks, in-progress, overdue count
   - Task completion progress bars
   - Recent tasks overview
   - Overdue tasks alert section

5. Kanban View (Project Detail)
   - Tasks organized in 3 columns: To Do / In Progress / Done
   - One-click status transitions
   - Filter by status

API ENDPOINTS
-------------
Auth:
  POST /api/auth/register    - Register new user
  POST /api/auth/login       - Login and get JWT

Projects:
  GET    /api/projects       - Get all projects for current user
  POST   /api/projects       - Create new project
  GET    /api/projects/{id}  - Get project details
  PUT    /api/projects/{id}  - Update project
  DELETE /api/projects/{id}  - Delete project
  GET    /api/projects/users - Get all users

Tasks:
  POST   /api/tasks                    - Create task
  GET    /api/tasks/project/{id}       - Get tasks by project
  GET    /api/tasks/my                 - Get my assigned tasks
  GET    /api/tasks/dashboard          - Dashboard stats
  PUT    /api/tasks/{id}               - Update task
  PATCH  /api/tasks/{id}/status        - Update task status only
  DELETE /api/tasks/{id}               - Delete task

HOW TO RUN LOCALLY
------------------
Prerequisites:
  - Java 17+
  - Maven
  - MySQL 8
  - Node.js 18+ and npm

Step 1: Setup MySQL
  - Create a MySQL database named: taskmanagerdb
  - Update credentials in:
    backend/src/main/resources/application.properties

Step 2: Run Backend
  cd backend
  mvn spring-boot:run
  (Backend starts on http://localhost:8080)

Step 3: Run Frontend
  cd frontend
  npm install
  npm run dev
  (Frontend starts on http://localhost:5173)

Step 4: Open in browser
  http://localhost:5173
  Register as ADMIN to manage everything.

DEPLOYMENT (Railway)
--------------------
1. Push code to GitHub
2. Create Railway project
3. Add MySQL service, copy DATABASE_URL
4. Deploy backend as Java service with environment variables
5. Deploy frontend as static site (npm run build)

DATABASE SCHEMA
---------------
users           : id, name, email, password, role
projects        : id, name, description, created_by, created_at
project_members : project_id, user_id
tasks           : id, title, description, status, priority,
                  due_date, project_id, assigned_to, created_by, created_at

GITHUB REPOSITORY
-----------------
https://github.com/AdnanHaider26/team-task-manager

===========================================================
