const sequelize = require('../config/database');
const Booking = require('../models/booking');
const Train = require('../models/train'); // Assuming Train is defined in a separate file
const User = require("../models/user")
// Book a seat on a train
const bookSeat = async (req, res) => {
    const { train_id } = req.body;
    const userId = req.user.id; // This assumes the user object has an 'id' property

    if (!userId) {
        return res.status(400).json({ message: "User ID is missing" });
    }

    const t = await sequelize.transaction();

    try {
        const train = await Train.findByPk(train_id, { transaction: t });
        if (!train) {
            await t.rollback(); // Roll back the transaction as a precaution
            return res.status(404).json({ message: 'Train not found' });
        }
        if (train.available_seats > 0) {
            train.available_seats -= 1;
            await train.save({ transaction: t });

            const booking = await Booking.create({
                UserId: userId,
                TrainId: train_id
            }, { transaction: t });

            await t.commit();
            res.status(201).json(booking);
        } else {
            await t.rollback();
            res.status(400).json({ message: 'No seats available' });
        }
    } catch (error) {
        await t.rollback();
        res.status(500).json({ message: error.message });
    }
};


const getBookingDetails = async (req, res) => {
    try {
        const { booking_id } = req.query;
        const booking = await Booking.findByPk(booking_id, {
            include: [Train,User]
        });
        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
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
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    bookSeat,
    getBookingDetails
};
