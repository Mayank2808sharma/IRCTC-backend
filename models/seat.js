const {DataTypes} = require('sequelize');
const sequelize = require('../config/database');
const Compartment = require('./compartment')

const Seat = sequelize.define('Seat', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    seat_no: {
        type: DataTypes.STRING,
        allowNull: false
    },
    status: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    }
});

// Seat.belongsTo(Compartment, {foreignKey: 'CompartmentId'});

module.exports = Seat;