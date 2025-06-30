# 🎧 PodCreator

**PodCreator** is a full-stack podcast web application that allows users to **upload, stream, and manage audio podcasts**. Built with **React**, **Express.js**, and **MongoDB**, it provides a clean interface, secure authentication, and a seamless podcast experience for creators and listeners alike.

---

## 🚀 Features

- 🔐 User authentication (JWT-based)
- 📤 Upload and store audio podcasts (using Multer)
- 🎵 Stream audio anytime from anywhere
- 🧾 Personalized dashboard for each user
- 🌐 RESTful API for podcast operations
- 🎧 Simple and clean audio player
- 🗃️ MongoDB for persistent storage

---

## 🧭 Project Structure & Roadmap

### 🏗️ Tech Stack

- **Frontend**: React.js, Axios
- **Backend**: Node.js, Express.js
- **Database**: MongoDB (Mongoose)
- **Authentication**: JWT (JSON Web Tokens)
- **File Upload**: Multer

---

### 📁 Folder Structure
Podcreator_SK/

│
├── client/ # React Frontend
│ ├── public/ # Static files
│ ├── src/
│ │ ├── components/ # UI Components
│ │ ├── pages/ # Route Pages (Home, Upload, Login, etc.)
│ │ ├── services/ # API Service Calls
│ │ └── App.js
│
├── server/ # Express Backend
│ ├── routes/ # API Routes
│ ├── controllers/ # Route Handlers / Logic
│ ├── models/ # MongoDB Schemas
│ ├── middleware/ # Authentication, Error Handling
│ └── server.js # Server Entry Point
│
├── uploads/ # Uploaded Audio Files
├── .env # Environment Variables
├── package.json # Backend Project Config
└── README.md # Project Documentation
