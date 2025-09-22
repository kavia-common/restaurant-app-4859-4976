# Backend API

Express.js API for the Restaurant app.

How to run:
1) Create a PostgreSQL database and apply schema:
   - psql "$DATABASE_URL" -f ../restaurant-app-4859-4977/ApplicationDatabase/schema.sql
   - psql "$DATABASE_URL" -f ../restaurant-app-4859-4977/ApplicationDatabase/seed.sql
2) Copy .env.example to .env and set values.
3) npm install
4) npm run dev
5) Open API docs at http://localhost:3010/docs
