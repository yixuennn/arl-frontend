# SpeakShelf - Accessible Reading List Frontend

## Project Description
SpeakShelf is an Angular frontend application connected to a Spring Boot backend. It allows users to manage a reading list by adding, viewing, searching, updating, deleting, and listening to reading items using the Web Speech API.

## Group Members
Add your group members here.

## Features
- Login page with Basic Auth
- View reading items with pagination
- Search by title, author, category, or description
- Add new reading item
- Edit existing reading item
- Delete reading item
- Client-side form validation
- Error messages for failed API requests
- Read-aloud feature using Web Speech API

## Technologies Used
- Angular
- TypeScript
- HTML
- CSS
- HttpClient
- Angular Forms
- Spring Boot backend
- MySQL database

## Backend Requirement
Make sure the backend is running at:

http://localhost:8080/api/books

The backend must allow CORS from:

http://localhost:4200

## Login Credentials
Use the username and password configured in the backend Spring Security.

User:
- Username: user
- Password: user123

Admin:
- Username: admin
- Password: admin123

## How to Run

### 1. Install dependencies
npm install

### 2. Run Angular frontend
ng serve

### 3. Open in browser
http://localhost:4200

## API Endpoints Used

| Method | Endpoint | Purpose |
|---|---|---|
| GET | /api/books?page=0&size=5 | List books |
| GET | /api/books?q=keyword&page=0&size=5 | Search books |
| POST | /api/books | Add book |
| PUT | /api/books/{id} | Update book |
| DELETE | /api/books/{id} | Delete book |
