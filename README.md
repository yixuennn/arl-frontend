# SpeakShelf - Accessible Reading List Frontend

## Project Description
SpeakShelf is an Angular frontend application connected to a Spring Boot backend from Assignment 1.

This project was developed to integrate an Angular frontend with a Spring Boot backend API. The frontend provides a user-friendly interface for managing an accessible reading list. Users can view books or articles in a paginated list, search for reading items, add new items, edit existing records, delete records, and use the read-aloud function.

## Group Members

| No. | Name        | Matric Number |
|-----|-------------|---------------|
| 1   | TEE YI XUEN | 299132        |
| 2   | LEE KER XIN | 299306        |
| 3   | GHITHANJALI | 280968            |
| 4   | XANDER KWAN TAO JIAN|29894          |


## Features
- Login page with Basic Auth
- View reading items with pagination
- Search by title, author, category, or description
- Add new reading item
- Update existing reading item
- Delete reading item
- Client-side form validation
- Clear validation error messages 
- Basic Authentication for protected write operations 
- Admin-only update and delete functions 
- Prompt user to login as admin when trying to update/delete without admin access 
- Error handling for failed API requests 
- Timeout handling for slow backend responses 
- CORS support between Angular frontend and Spring Boot backend 
- Read-aloud button using Web Speech API 
- Responsive and user-friendly interface

## Technologies Used
**Frontend**
* Angular 
* TypeScript 
* HTML 
* CSS 
* Angular Forms 
* Angular HttpClient

**Backend**
* Spring Boot 
* Spring Web 
* Spring Security 
* Spring Data JPA 
* MySQL 
* Basic Authentication

## System Requirements
Before running this project, make sure the following software is installed:

* Node.js
* npm
* Angular CLI
* Java JDK
* IntelliJ IDEA or any Java IDE
* MySQL Server
* MySQL Workbench
* Git

## Backend Requirement
Make sure the backend is running before using the frontend:

http://localhost:8080/api/books

The backend must allow CORS from:

http://localhost:4200

The backend should include the following API endpoints:

| Method | Endpoint | Purpose | Authentication |
|---|---|---|----------------|
| GET | /api/books?page=0&size=5 | List books | Not required   |
| GET | /api/books?q=keyword&page=0&size=5 | Search books | Not required   |
| POST | /api/books | Add book | User/Admin   |
| PUT | /api/books/{id} | Update book |Admin only|
| DELETE | /api/books/{id} | Delete book | Admin only     |

## Login Credentials
The system separates user access into two roles:

|Role|Username|Password|Access|
|---|---|-|---|
|User|user|user123|View, search, and add books|
|Admin|admin|admin123|View, search, add, update, and delete books|

GET requests are open for viewing and searching books, while POST, PUT, and DELETE requests require Basic Authentication.

## How to Run the Backend

1. Open the Spring Boot backend project in IntelliJ IDEA.
2. Make sure MySQL server is running.
3. Check the database configuration in application.properties.
4. Run the Spring Boot application.
5. Confirm that the backend is running at:
http://localhost:8080/api/books

## How to Run the Frontend

### 1. Install dependencies
npm install

### 2. Run Angular frontend
ng serve

### 3. Open in browser
http://localhost:4200

## How to Use the System

### Step 1: Login

Open the frontend at:

http://localhost:4200

Login as either User or Admin.

### Step 2: View Reading List

After login, the dashboard displays the reading collection with pagination.

### Step 3: Search Reading Item

Enter a keyword in the search box and click **Search**. The system will search by title, author, category, or description.

### Step 4: Add Reading Item

Fill in the form fields:

* Title
* Author
* Category
* Short Description

Then click Add.

### Step 5: Update Reading Item

Login as Admin. Click **Edit** on any reading item. The form will change to update mode. Make changes and click Update.

### Step 6: Delete Reading Item

Login as Admin. Click **Delete** on the selected reading item and confirm the deletion.

### Step 7: Read Aloud

Click the speaker button beside a reading item title. The system will read the book information aloud using the browser Web Speech API.

## Client-Side Validation
The form includes validation for all required fields.

| Field       | Validation |
|-------------|------------|
| Title       |Required, minimum 2 characters, maximum 150 characters            |
| Author      |Required, minimum 2 characters, maximum 100 characters            |
| Category    |Required, minimum 2 characters, maximum 50 characters            |
| Description |Required, minimum 5 characters, maximum 500 characters            |

If a field is invalid, a clear validation message will be displayed.

## Error Handling
The frontend handles common API errors and displays meaningful messages to users.

| Error               | Message/Action |
|---------------------|----------------|
| Backend not running |Cannot connect to backend|
|Timeout|Request timed out|
|400 Bad Request|Check form fields|
|401 Unauthorized|Username or password is incorrect|
|403 Forbidden|Admin access is required|
|404 Not Found|Selected item was not found|
|500 Server Error|Backend server error occurred|

## Security Implementation

The system uses Basic Authentication for protected write operations.

* GET requests are open.
* POST requests require User or Admin.
* PUT requests require Admin.
* DELETE requests require Admin.

If a normal user tries to update or delete a book, the system prompts the user to login as Admin.
