const Sequelize  = require('sequelize');
const Train = require('../models/train');


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

const updateTrainSeats = async (req, res) => {
    const { trainId } = req.params;
    const { add_seats } = req.body;

    if (!add_seats || add_seats < 0) {
        return res.status(400).json({ message: 'Invalid total seats provided.' });
    }

    try {
        const train = await Train.findByPk(trainId);
        if (!train) {
            return res.status(404).json({ message: 'Train not found.' });
        }

        train.total_seats += add_seats;
        train.available_seats +=add_seats;
        await train.save();
        res.status(200).json({ message: 'Total seats updated successfully.', train });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


module.exports = {
    addTrain,
    getTrains,
    updateTrainSeats
};
