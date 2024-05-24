<div align="center">

# IRCTC Backend

</div>
<div align = "center">
<table align="center">
    <thead align="center">
        <tr border: 1px;>
            <td><b>🌟 Stars</b></td>
            <td><b>🍴 Forks</b></td>
            <td><b>🐛 Issues</b></td>
            <td><b>🔔 Open PRs</b></td>
            <td><b>🔕 Close PRs</b></td>
        </tr>
     </thead>
    <tbody>
         <tr>
            <td><img alt="Stars" src="https://img.shields.io/github/stars/Mayank2808sharma/IRCTC-backend?style=flat&logo=github"/></td>
             <td><img alt="Forks" src="https://img.shields.io/github/forks/Mayank2808sharma/IRCTC-backend?style=flat&logo=github"/></td>
            <td><img alt="Issues" src="https://img.shields.io/github/issues/Mayank2808sharma/IRCTC-backend?style=flat&logo=github"/></td>
            <td><img alt="Open Pull Requests" src="https://img.shields.io/github/issues-pr/Mayank2808sharma/IRCTC-backend?style=flat&logo=github"/></td>
           <td><img alt="Close Pull Requests" src="https://img.shields.io/github/issues-pr-closed/Mayank2808sharma/IRCTC-backend?style=flat&color=critical&logo=github"/></td>
        </tr>
    </tbody>
</table>
</div>

## Project Overview

<div align="center">
<i>Built using Node.js, Express, and Sequelize, this system supports functionalities for both regular users and administrators, ensuring efficient handling of train schedules, seat availability, and user bookings.</i>
</div>

## Youtube video : [↗️](https://youtu.be/deWxKmGd67A)

<div align="center">

<div align="center">

## 💻 Tech Stacks

![Node.js](https://img.shields.io/badge/Node.js-%23339933.svg?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-%23000000.svg?style=for-the-badge&logo=express&logoColor=white)
![Sequelize](https://img.shields.io/badge/Sequelize-%23474A8A.svg?style=for-the-badge&logo=sequelize&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-%23336791.svg?style=for-the-badge&logo=postgresql&logoColor=white)


</div>

## -> Key Features <-
</div>

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
`Body: { "train_id": 1 }`
* **GET /booking/details** - Get specific booking details
`Query: booking_id=1`

## Admin Endpoints
* **POST /admin/train** - Add a new train
`Body: { "train_name": "Express", "source": "CityA", "destination": "CityB", "total_seats": 100 }`
* **PATCH /admin/train/:trainId** - Increase number of total seats
`Body: { "add_seats": 120 }`

<h2 align = "center"> 🤝 Our Contributors</h2>
<div align = "center">

![Contributors](https://contrib.rocks/image?repo=Mayank2808sharma/IRCTC-backend)
 
 <h3>Thank you for contributing to our repository</h3>

</div>

<h2 align="center">Don't forget to give us a ⭐</h2>