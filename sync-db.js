const sequelize = require('./config/database');
const User = require('./models/user');
const Train = require('./models/train');
const Booking = require('./models/booking');

sequelize.sync({ force: false })
    .then(() => {
        console.log("Tables have been successfully created.");
    })
    .catch(error => {
        console.error("Unable to create tables, shutting down...", error);
    });