## Getting Started

npm install dotenv

LAG EN .ENV fil med 

NODE_ENV=development

localhost:5000

MONGODB_URI='mongodb+srvmongodb.net/Disgolfdb'


Kjør:
node server.js 


hosted i prod: https://vast-mesa-22158-90c21fc001d1.herokuapp.com/



# DiscGolf Management Platform

A full-stack web application for managing disc golf clubs, members, courses, and tournaments. The platform provides both public pages for players and an administration dashboard for managing club activities.

## Features

- User registration and login
- User profiles
- Club overview
- Disc golf course search
- Tournament management
- Membership administration
- Payment page
- Admin dashboard
- JWT authentication
- MongoDB database integration

## Tech Stack

### Frontend
- Next.js 15
- React 19
- CSS

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose

### Authentication
- JWT (jsonwebtoken)
- bcrypt

## Project Structure

```
app/
├── admin/
├── banesok/
├── betaling/
├── klubber/
├── logginn/
├── profil/
├── registrer/
├── spill/
└── ...
```

## Installation

Clone the repository:

```bash
git clone <repository-url>
cd project
```

Install dependencies:

```bash
npm install
```

Create a `.env` file:

```env
NODE_ENV=development
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

Start the application:

```bash
npm start
```

or during development:

```bash
npm run dev
```

## Dependencies

- Next.js
- React
- Express
- MongoDB
- Mongoose
- bcrypt
- jsonwebtoken
- dotenv
- multer

## Purpose

This project was developed as part of a university software development course. The goal was to build a complete web application where users can discover disc golf courses, join clubs, participate in tournaments, and where administrators can manage club-related content through an admin interface.

## Future Improvements

- Online payment integration
- Email verification
- Better responsive design
- Tournament statistics
- Live score tracking
- Improved search and filtering
