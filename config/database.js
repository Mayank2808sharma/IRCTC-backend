require('dotenv').config();
const Sequelize = require('sequelize');
const pg = require('pg');

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: "localhost",
    dialect: "postgres",
    dialectModule: pg,
  }
)

module.exports = sequelize;