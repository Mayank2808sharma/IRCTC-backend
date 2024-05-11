const sequelize = require('../config/database');
const Booking = require('../models/booking');
const Train = require('../models/train'); 
const User = require("../models/user")

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

const cancelBooking = async (req, res) => {
    const t = await sequelize.transaction();
    const UserId = req.user.id
    if(!UserId){
        res.status(404).json({message : "User id is missing"})
    }
    try {
        const { booking_id } = req.query;
        const booking = await Booking.findByPk(booking_id, { transaction: t });
        
        //if booking is not present then send response
        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }
        //if user id of booking is not equal to user trying to delete booking 
        if(booking.UserId != UserId){
            return res.status(403).send("forbidden")
        }
        //get train id for changing status of available seats
        const trainId = booking.TrainId;

        //delete the booking
        const deleted = await Booking.destroy({where : {id : booking_id, UserId : UserId}});

        //change available seats details
        if(deleted) {
            const train = await Train.findByPk(trainId, { transaction: t });
        
            //modify available seats 
            train.available_seats += 1;
            await train.save({ transaction: t });

            await t.commit();
            
            res.json({message : "Booking cancelled"})
        }
    } catch (error) {
        
        res.status(500).json({ message: error.message });
    }
}


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
    getBookingDetails,
    cancelBooking
};
