const {DataTypes} = require('sequelize');
const sequelize = require('../config/database');
// const Train = require('./train');
const Seat = require('./seat')

const Compartment = sequelize.define('Compartment', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    compartment_name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    // TrainId:{
        
    // }
});

// Train.hasMany(Compartment);
// Compartment.belongsTo(Train,{foreignKey:''});
Compartment.hasMany(Seat);

module.exports = Compartment