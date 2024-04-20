const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Train = sequelize.define('Train', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    train_name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    source: {
        type: DataTypes.STRING,
        allowNull: false
    },
    destination: {
        type: DataTypes.STRING,
        allowNull: false
    },
    total_seats: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    available_seats: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
});

module.exports = Train;