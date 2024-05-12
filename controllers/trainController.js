const Sequelize = require('sequelize');
const Train = require('../models/train');
const { addTrainValidationRules, updateTrainSeatsValidationRules, validate } = require('../middleware/validation');

const addTrain = async (req, res) => {
    try {
        // Validate request body
        await addTrainValidationRules().forEach((rule) => rule(req, res, () => {})); 
        validate(req, res, async () => { 
            const { train_name, source, destination, total_seats } = req.body;
            const train = await Train.create({
                train_name: train_name.toLowerCase(),
                source: source.toLowerCase(),
                destination: destination.toLowerCase(),
                total_seats,
                available_seats: total_seats
            });
            res.status(201).json(train);
        });
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
                destination: destination.toLowerCase(),
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
    try {
        await updateTrainSeatsValidationRules().forEach((rule) => rule(req, res, () => {})); // Run validation rules
        validate(req, res, async () => { // Check for validation errors
            const { trainId } = req.params;
            const { add_seats } = req.body;

            const train = await Train.findByPk(trainId);
            if (!train) {
                return res.status(404).json({ message: 'Train not found.' });
            }

            // Update seats
            train.total_seats += add_seats;
            train.available_seats += add_seats;
            await train.save();

            res.status(200).json({ message: 'Total seats updated successfully.', train });
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    addTrain,
    getTrains,
    updateTrainSeats
};
