A full-stack API testing application built with React, TypeScript, Node.js, and Express. The application allows users to send HTTP requests to REST APIs and inspect the responses in a simple, easy-to-use interface.

Project Status: 🚧 In Progress

Features:
Send HTTP requests to REST APIs
Support for common request methods:
GET
POST
PUT
PATCH
DELETE
View response status codes
Display response time
View response headers
Format and display JSON responses
Error handling for failed requests
Responsive user interface

Technologies Used:
Frontend
React
TypeScript
CSS
Backend
Node.js
Express
Axios

Project Structure:
api-testing-tool/
├── client/     # React frontend
├── server/     # Express backend
└── README.md
Getting Started
Prerequisites
Node.js (v18 or later recommended)
npm


Frontend:

cd client
npm install

Backend:

cd ../server
npm install
Running the Application

Start the backend server:

cd server
npm start

In another terminal, start the frontend:

cd client
npm start

The frontend will connect to the backend and allow you to send API requests through the application.