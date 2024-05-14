# IRCTC Backend

## Project Overview
Built using Node.js, Express, and Sequelize, this system supports functionalities for both regular users and administrators, ensuring efficient handling of train schedules, seat availability, and user bookings.

## Youtube video : [↗️](https://youtu.be/deWxKmGd67A)

## Features
- **User Authentication**: Secure login and registration functionality for users.
- **Train Management**: Administrators can add trains and update seating capacities.
- **Seat Booking**: Users can check seat availability and book seats on trains.

## Getting Started

### Prerequisites
To run this project locally, you will need Node.js and PostgreSQL installed on your machine. Optionally, you can use Docker for running PostgreSQL.

### Installation

**1. Clone the repository**
```bash
git clone https://github.com/mayank2808sharma/IRCTC-backend
cd IRCTC-backend
```
**2. Install Dependencies**
```bash
npm i
```
**3. Set Up Environment Variables**

Create a `.env `file in the root directory and update it with your database and authentication configurations as follows:

```bash
PORT= 3000
DB_HOST = hostname 
DB_USER = username for the database
DB_PASSWORD = password for the database
DB_NAME = name of the database
JWT_SECRET = secret key used to sign and verify JSON Web Tokens
```
**4. Database Setup**

Make sure your PostgreSQL database is running and the credentials in .env match your database info. Run the following command to set up your database tables:
```bash
npm run setdb
```

**5. Start the Server**
```bash
npm start
```

This will start the server on `http://localhost:3000`.

# API Endpoints
## Public Endpoints

* **POST /register** - Register a new user
`Body: { "username": "user1", "password": "password123", "role":"user" }`

* **POST /login** - Login a user
`Body: { "username": "user1", "password": "password123" }`

## User Endpoints

* **GET /trains/availability** - Fetch available trains
`Query: source=CityA&destination=CityB`
* **POST /book** - Book ticket
`Body: { "train_id":1, "no_of_seats":3 }`

* **GET /booking/details** - Get specific booking details
`Query: booking_id=1`

## Admin Endpoints
* **POST /admin/train** - Add a new train
`Body: { "train_name":"Train_1", "source":"Chennai", "destination" : "Coimbatore", "compartments" : [{ "name":"T-1-C-1", "total_seats":10 },{ "name":"T-1-C-2", "total_seats":5 }]}`

* **PATCH /admin/train/:trainId** - Increase number of total seats
`Body: { "additionalCompartments":[{ "name":"T-1-C-3", "total_seats":10 },{ "name":"T-1-C-4", "total_seats":15 }] }`
