# Savant - Premium Library Management System

Welcome to **Savant**, an academic library management system. A seamless, powerful, and elegant solution for students and administrators alike.

## Features

- **Public Catalog**: Browse the open catalog of books without logging in.
- **Member Registration & Authentication**: Secure sign up and login using JWT and bcrypt.
- **Role-Based Dashboard**: Different views and capabilities for regular users/members versus administrators/librarians.
- **Book Management**: Add, update, or remove books from the library.
- **Transactions**: Track borrowed and returned books.
- **Modern UI**: A responsive, beautifully designed frontend interface powered by vanilla HTML/CSS/JS, Inter fonts, and Phosphor icons.

## Tech Stack

- **Frontend**: Vanilla HTML5, CSS3, Vanilla JavaScript
- **Backend**: Node.js, Express.js
- **Database**: MySQL
- **Authentication**: JWT (JSON Web Tokens), bcrypt for password hashing

## Prerequisites

To run this project locally, ensure you have the following installed:

- **Node.js**: (v14 or higher recommended)
- **MySQL**: (Make sure the MySQL server is running)

## Setup & Installation

1. **Clone the repository** (if you haven't already):
   ```bash
   git clone <your-repository-url>
   cd <repository-directory>
   ```

2. **Navigate to the backend directory**:
   The backend handles both the API and serves the static frontend files.
   ```bash
   cd backend
   ```

3. **Install Dependencies**:
   ```bash
   npm install
   ```

4. **Environment Variables**:
   Ensure you have a `.env` file inside the `backend` directory. It should look like this:
   ```env
   PORT=3000
   DB_HOST=localhost
   DB_USER=your_mysql_username
   DB_PASSWORD=your_mysql_password
   DB_NAME=library_db
   JWT_SECRET=your_super_secret_jwt_key
   ```
   *(Update the credentials according to your local MySQL setup)*

## Database Setup

The project includes automated scripts to create the tables and populate initial mock data (including the default librarian and admin accounts).

Run the following scripts in order from the `backend` folder, or simply use `npm run setup`:

```bash
# 1. Create the database schema and tables
node setup_db.js

# 2. Seed the database with sample books
node seed_books.js

# 3. Seed the database with mock librarian data
node seed_librarian.js
```

## Running the Application

1. Start the server from the `backend` directory:
   ```bash
   # For production mode
   npm start
   
   # For development mode (uses nodemon)
   npm run dev
   ```

2. Open your browser and navigate to:
   ```text
   http://localhost:3000
   ```
   *Note: The Express backend serves the static frontend files directly from the `frontend` directory.*

## Folder Structure

- `/backend`: Contains the Node.js Express server, API routes, database configuration (`db.js`), schema and seed scripts.
- `/frontend`: Contains the vanilla frontend source code (HTML, CSS, JS).

## License
ISC
