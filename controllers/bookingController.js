const sequelize = require('../config/database');
const Booking = require('../models/booking');
const Compartment = require('../models/compartment');
const Seat = require('../models/seat');
const Train = require('../models/train');
const User = require("../models/user")

const bookSeat = async (req, res) => {
    let { train_id, no_of_seats } = req.body;
    const userId = req.user.id;
    let tempSeatNo = no_of_seats;
    if (!userId) {
        throw new Error("User ID is missing");
    }

    const t = await sequelize.transaction();

    try {
        const train = await Train.findAll({
            where: {
                id: train_id
            },
            attributes: ['id', 'train_name'],
            include: [
                {
                    model: Compartment,
                    attributes: ['id'],
                    include: [
                        {
                            model: Seat,
                            attributes: ['id', 'seat_no', 'status']
                        }
                    ]
                }
            ],
            raw: true

        });
        const bookingDetail = [];
        if (!train) {
            await t.rollback();
            throw new Error('Train not found');
        } else {

            for (const compartment of train) {
                if (compartment["Compartments.Seats.status"] && tempSeatNo > 0) {
                    tempSeatNo--;
                    bookingDetail.push({ status: "Booked", train_id: compartment.id, train_name: compartment.train_name, seat_id: compartment["Compartments.Seats.id"], seat_no: compartment["Compartments.Seats.seat_no"] })
                }
            }
        }
    
        let book;
        if (bookingDetail.length != no_of_seats || !bookingDetail.length > 0) {
            throw new Error("Seat not available");
        } else {
            await sequelize.transaction(async (t) => {
                await Promise.all(bookingDetail.map(async (sampleTicket) => {
                    await Seat.update(
                        { status: false },
                        {
                            where: {
                                id: sampleTicket.seat_id,
                            },
                        },
                        { transaction: t });
                    [""]

                    book = await Booking.create({
                        UserId: userId,
                        TrainId: sampleTicket.train_id,
                        SeatId: sampleTicket.seat_id
                    }, { transaction: t });
                }));
            });

        }
        await t.commit();


        res.status(201).json({ book, bookingDetail })

    } catch (error) {
        // await t.rollback();
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};


const getBookingDetails = async (req, res) => {
    try {
        const { booking_id } = req.query;
        const booking = await Booking.findByPk(booking_id, {
            include: [Train, User, Seat],
        });



        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }
        let seatNos = [];
        if (booking.Seat) {
            Object.values(booking.Seat).forEach(seat => {
                if(seat.seat_no)
                    seatNos.push(seat?.seat_no);
            });
        }


        const data = {
            bookingId: booking.id,
            bookingTime: booking.booking_time,
            trainName: booking.Train.train_name,
            source: booking.Train.source,
            destination: booking.Train.destination,
            username: booking.User.username,
            seatNos:seatNos

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
