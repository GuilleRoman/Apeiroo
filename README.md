# Duty To-Do List Application

This application is a full-stack web application that allows users to manage a to-do list of duties. It consists of a React frontend and a Node.js/Express backend with a PostgreSQL database.

## Features

* **Create Duties:** Add new duties to the to-do list.
* **Read Duties:** View the list of all duties.
* **Update Duties:** Modify existing duties (e.g., mark as completed).
* **Delete Duties:** Remove duties from the list.
* **Form Validations:** Ensures data integrity on the frontend.
* **Testing:** Unit tests for both frontend and backend.
* **Production-Ready:** Code readability and observability.

## Technologies Used

* **Frontend:** React (TypeScript), Axios
* **Backend:** Node.js, Express (TypeScript), pg (PostgreSQL client)
* **Database:** PostgreSQL
* **Testing:** Jest, React Testing Library, supertest
* **Containerization:** Docker, Docker Compose

## Prerequisites

* Node.js and npm installed.
* Docker and Docker Compose installed.

## Setup and Installation

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/GuilleRoman/Apeiroo
    cd <your-repository-directory>
    ```

2.  **Backend Setup:**

    * Navigate to the `backend` directory:

        ```bash
        cd backend
        ```

    * Start the Docker containers:

        ```bash
        docker-compose up --build
        ```

    * This will build and run the backend and PostgreSQL database containers. The backend will be accessible at `http://localhost:3001`.

3.  **Frontend Setup:**

    * Open a new terminal window and navigate to the `frontend` directory:

        ```bash
        cd ../frontend
        ```

    * Install dependencies:

        ```bash
        npm install
        ```

    * Start the development server:

        ```bash
        npm start
        ```

    * The frontend will be accessible at `http://localhost:3000`.

## Running Tests

1.  **Backend Tests:**

    * Navigate to the `backend` directory:

        ```bash
        cd ../backend
        ```

    * Run the tests:

        ```bash
        npm test
        ```

2.  **Frontend Tests:**

    * Navigate to the `frontend` directory:

        ```bash
        cd ../frontend
        ```

    * Run the tests:

        ```bash
        npm test
        ```

## Database Initialization

* The PostgreSQL database is initialized using the `init.sql` script located in the `backend` directory.
* This script creates the `duties` table and inserts sample data.
* If you make changes to `init.sql`, you will need to run `docker-compose down -v` to remove the volumes, and then `docker-compose up --build` to apply the changes.

## Frontend Screenshots

* **(Add screenshots of your frontend application here)**

## Project Structure