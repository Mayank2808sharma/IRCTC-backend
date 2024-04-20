const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./user');
const Train = require('./train');

const Booking = sequelize.define('Booking', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    booking_time: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    UserId: {  // Explicitly define the foreign key for User
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: 'id'
        }
    },
    TrainId: {  // Explicitly define the foreign key for Train
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Train,
            key: 'id'
        }
    }
});

// Define the associations
Booking.belongsTo(User, {foreignKey: 'UserId'});
Booking.belongsTo(Train, {foreignKey: 'TrainId'});

module.exports = Booking;
