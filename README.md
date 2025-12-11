1. A description of the project.

Pro-Tasker is a full-stack MERN project manager that lets authenticated users create projects and manage tasks inside those projects.  
 Each user can:

- Register / log in with email and password (JWT authentication, bcrypt-hashed passwords).
- Create, view, update, and delete only their own projects.
- Create, view, update, and delete tasks that belong to those projects, with a status of `todo`, `in-progress`, or `done`.
  All protected routes are ownership-based: you can only access data that belongs to the logged-in user.

2. Instructions for setting it up and running it locally.

   - Node.js and npm installed (LTS version recommended).

   - A MongoDB database (MongoDB or local MongoDB).

   - Git (to clone the repository).

BACKEND SETUP

cd project-manager  
npm install

Create a .env file in the backend folder with the following variables:
PORT=4000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_jwt_key
FRONTEND_URL=http://localhost:5173
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
GITHUB_CALLBACK_URL=http://localhost:4000/api/users/auth/github/callback

FRONTEND SETUP

cd frontend-project-manager
npm install

Create a .env file in the frontend folder
VITE_BACKEND_URL=http://localhost:4000

START THE SERVER
npm run dev

After Vite will send the link to your URL
http://localhost:5173

4. Logging in and using the app

In the browser, go to http://localhost:5173.

Use the Sign in / Sign up page to register a new user account.

After logging in:

Go to the Projects page to create, edit, and delete your own projects.
Click See Project on a project to open the Project Details page.
On the Project Details page, use the Add Task form to create tasks and manage their status (To Do, In Progress, Done).

3. A list and description of your API endpoints.

The API is split into three main parts.
The auth/user routes handle things like signing up, logging in, and (for admins) viewing all users.
The project routes let a logged-in user create, see, edit, and delete their own projects—no one can touch anyone else’s.
The task routes live under a specific project and let you manage tasks (with a title, description, and status like “todo”, “in-progress”, or “done”), but only if you own the project those tasks belong to.
