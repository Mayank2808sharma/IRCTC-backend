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

        // Modified the response to include the train object
        res.send(CreateSuccess(201, "Train added successfully", train));

    } catch (error) {

        // Modified the response to include the error object
        res.send(CreateError(500, error.message));

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

        // Modified the response to include the trains object
        res.send(CreateSuccess(200, "Trains fetched successfully", trains));

    } catch (error) {

        // Modified the response to include the error object
        res.send(CreateError(500, error.message));
    }
};

const updateTrainSeats = async (req, res) => {
    const { trainId } = req.params;
    const { add_seats } = req.body;

    if (!add_seats || add_seats < 0) {

        // Modified the response to include the error object
        return res.send(CreateError(400, "Invalid total seats provided."));
    }

    try {
        const train = await Train.findByPk(trainId);
        if (!train) {

            // Modified the response to include the error object
            return res.send(CreateError(404, "Train not found."));
        }

        train.total_seats += add_seats;
        train.available_seats +=add_seats;
        await train.save();

        // Modified the response to include the train object
        res.send(CreateSuccess(200, "Total seats updated successfully", train));

    } catch (error) {

        // Modified the response to include the error object
        res.send(CreateError(500, error.message));
        
    }
};


module.exports = {
    addTrain,
    getTrains,
    updateTrainSeats
};
