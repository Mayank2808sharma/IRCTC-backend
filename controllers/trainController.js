const Sequelize  = require('sequelize');
const Train = require('../models/train');

// Admin: Add a new train
const addTrain = async (req, res) => {
    try {
        const { train_name, source, destination, total_seats } = req.body;
        const train = await Train.create({
            train_name: train_name.toLowerCase(), 
            source: source.toLowerCase(),         
            destination: destination.toLowerCase(), 
            total_seats,
            available_seats: total_seats

        });
        res.status(201).json(train);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get trains with availability between two stations
const getTrains = async (req, res) => {
    try {
        const { source, destination } = req.query;
        const trains = await Train.findAll({
            where: {
                source: source.toLowerCase(),
                destination:destination.toLowerCase(),
                available_seats: {
                    [Sequelize.Op.gt]: 0  
                }
            }
        });
        res.json(trains);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    addTrain,
    getTrains
};
