const sequelize = require('../config/database');
const Booking = require('../models/booking');
const Train = require('../models/train'); 
const User = require("../models/user")
const sendBasicEmail = require('../utils/emailService');

const bookSeat = async (req, res) => {
    const { train_id } = req.body;
    const userId = req.user.id; 

    if (!userId) {
        return res.status(400).json({ message: "User ID is missing" });
    }

    const t = await sequelize.transaction();

    try {
        const train = await Train.findByPk(train_id, { transaction: t });
        if (!train) {
            console.log('Could not find train');
            await t.rollback(); 
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

             // Send email to the user
           try{
            const user = await User.findByPk(userId);
            const mailSubject = 'Booking Confirmation';
            const mailBody = `Dear ${user.username},\n\nYour booking has been confirmed. Details:\nBooking ID: ${booking.id}\nBooking Time: ${booking.booking_time}\nTrain Name: ${train.train_name}\nSource: ${train.source}\nDestination: ${train.destination}\n\nThank you for choosing our service.`;
            await sendBasicEmail(user.email, mailSubject, mailBody);
            console.log('Email sent');
           }
           catch(error){
            console.log('Error sending email');
            console.log(error);
           }
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
