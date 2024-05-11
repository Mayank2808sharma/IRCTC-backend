const sequelize = require('../config/database');
const Booking = require('../models/booking');
const Train = require('../models/train'); 
const User = require("../models/user")
const { CreateError } = require('../utils/error');
const { CreateSuccess } = require('../utils/success');

const bookSeat = async (req, res) => {
    const { train_id } = req.body;
    const userId = req.user.id; 

    if (!userId) {
        return res.status(400).json({ message: "User ID is missing" }); // Remove this line

        // Modified the response to include the error object
        // return res.send(CreateError(400, "User ID is missing"));

    }

    const t = await sequelize.transaction();

    try {
        const train = await Train.findByPk(train_id, { transaction: t });
        if (!train) {
            await t.rollback(); 
            return res.status(404).json({ message: 'Train not found' }); // Remove this line

            // Modified the response to include the error object
            // return res.send(CreateError(404, "Train not found"));
        }
        if (train.available_seats > 0) {
            train.available_seats -= 1;
            await train.save({ transaction: t });

            const booking = await Booking.create({
                UserId: userId,
                TrainId: train_id
            }, { transaction: t });

            await t.commit();
            res.status(201).json(booking); // Remove this line Instrad og sending booking object send the response as below with Response message

            // Modified the response to include the booking object
            // res.send(CreateSuccess(201, "Booking created successfully", booking));
        } else {
            await t.rollback();
            res.status(400).json({ message: 'No seats available' }); // Remove this line

            // Modified the response to include the error object
            // res.send(CreateError(400, "No seats available"));
        }
    } catch (error) {
        await t.rollback();
        res.status(500).json({ message: error.message }); // Remove this line

        // Modified the response to include the error object
        // res.send(CreateError(500, error.message));
    }
};


const getBookingDetails = async (req, res) => {
    try {
        const { booking_id } = req.query;
        const booking = await Booking.findByPk(booking_id, {
            include: [Train,User]
        });
        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' }); // Remove this line

            // Modified the response to include the error object
            // return res.send(CreateError(404, "Booking not found"));
        }
        const data = {
            bookingId:booking.id,
            bookingTime:booking.booking_time,
            trainName:booking.Train.train_name,
            source:booking.Train.source,
            destination:booking.Train.destination,
            username: booking.User.username
        }
        res.json(data);
    } catch (error) {
        res.status(500).json({ message: error.message }); // Remove this line

        // Modified the response to include the error object
        // res.send(CreateError(500, error.message));
    }
};

module.exports = {
    bookSeat,
    getBookingDetails
};
