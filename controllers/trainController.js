const Sequelize = require('sequelize');
const sequelize = require('../config/database')
const Train = require('../models/train');
const Compartment = require('../models/compartment');
const Seat = require('../models/seat')

// Old-method
// const addTrain = async (req, res) => {
//     try {
//         const { train_name, source, destination, total_seats } = req.body;
//         const train = await Train.create({
//             train_name: train_name.toLowerCase(), 
//             source: source.toLowerCase(),         
//             destination: destination.toLowerCase(), 
//             total_seats,
//             available_seats: total_seats

//         });
//         res.status(201).json(train);
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// };

const addTrain = async (req, res) => {
    try {
        const { train_name, source, destination, compartments } = req.body;
        // compartments = [{
        //     name:"C-1",
        //     total_seats:10
        // },{
        //     name:"C-2",
        //     total_seats:10
        // }]
        const createdTrain = await sequelize.transaction(async (t) => {
            const train = await Train.create({
                train_name: train_name.toLowerCase(),
                source: source.toLowerCase(),
                destination: destination.toLowerCase()
            }, { transaction: t });

            const promises = compartments.map(async (compartment) => {
                const createdCompartment = await Compartment.create({
                    TrainId: train.id,
                    compartment_name: compartment.name,
                }, { transaction: t });

                // Create 10 seats for the compartment
                const seatPromises = [];
                for (let i = 1; i <= compartment.total_seats; i++) {
                    seatPromises.push(Seat.create({
                        CompartmentId: createdCompartment.id,
                        seat_no: `${compartment.name}_${i}`,
                    }, { transaction: t }));
                }
                return Promise.all(seatPromises);
            });

            await Promise.all(promises);
            return train;
        });

        console.log('Transaction committed successfully');
        res.status(201).json(createdTrain);
    } catch (error) {
        console.error('Transaction failed:', error);
        // Rollback the transaction
        // await sequelize.rollback();
    }
};


const getTrains = async (req, res) => {
    try {
        const { source, destination } = req.query;
        const trains = await Train.findAll({
            where: {
                source: source.toLowerCase(),
                destination: destination.toLowerCase(),
            },
            attributes: [
                'id',
                'source',
                'destination',
                'train_name',
                [
                    Sequelize.literal(`
                        COALESCE(
                            CAST(
                                (
                                    SELECT SUM("SeatsCount")
                                    FROM (
                                        SELECT COUNT(*) AS "SeatsCount"
                                        FROM "Seats"
                                        INNER JOIN "Compartments" ON "Seats"."CompartmentId" = "Compartments"."id"
                                        WHERE "Compartments"."TrainId" = "Train"."id" AND "Seats"."status" = true
                                        GROUP BY "Compartments"."TrainId", "Seats"."CompartmentId"
                                    ) AS "SeatCounts"
                                ) AS INTEGER
                            ), 
                            0
                        )
                    `),
                    'SeatsCount'
                ],
                [
                    Sequelize.literal(`
                        (
                            SELECT "compartment_name"
                            FROM "Compartments"
                            WHERE "Compartments"."TrainId" = "Train"."id"
                            LIMIT 1
                        )
                    `),
                    'compartment_name'
                ]
            ],
            raw: true
        });
        
        

        res.json(trains);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

//Old
// const updateTrainSeats = async (req, res) => {
//     const { trainId } = req.params;
//     const { add_seats } = req.body;

//     if (!add_seats || add_seats < 0) {
//         return res.status(400).json({ message: 'Invalid total seats provided.' });
//     }

//     try {
//         const train = await Train.findByPk(trainId);
//         if (!train) {
//             return res.status(404).json({ message: 'Train not found.' });
//         }

//         train.total_seats += add_seats;
//         train.available_seats += add_seats;
//         await train.save();
//         res.status(200).json({ message: 'Total seats updated successfully.', train });
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// };

const updateTrainSeats = async (req, res) => {
    const { trainId } = req.params;
    const { additionalCompartments } = req.body;

    if (additionalCompartments.length < 0) {
        return res.status(400).json({ message: 'Invalid total seats provided.' });
    }

    try {
        await sequelize.transaction(async (t) => {
            const train = await Train.findByPk(trainId, { transaction: t });
            if (!train) {
                return res.status(404).json({ message: 'Train not found.' });
            }

            // Create compartments and seats within the transaction
            const promises = additionalCompartments.map(async (compartment) => {
                const createdCompartment = await Compartment.create({
                    TrainId: train.id,
                    compartment_name: compartment.name,
                }, { transaction: t });

                // Create seats for the compartment
                const seatPromises = [];
                for (let i = 1; i <= compartment.total_seats; i++) {
                    seatPromises.push(Seat.create({
                        CompartmentId: createdCompartment.id,
                        seat_no: `${compartment.name}_${i}`,
                    }, { transaction: t }));
                }
                return Promise.all(seatPromises);
            });

            await Promise.all(promises);

            const updatedTrain = await Train.findByPk(trainId, {
                include: [Compartment],
                transaction: t,
            });

            // Commit the transaction
            await t.commit();

            // Fetch the updated train record including the newly created compartments and seats

            res.status(200).json({ message: 'Train and compartments updated successfully.', train: updatedTrain });
        });
    } catch (error) {
        console.error('Transaction failed:', error);
    }
};

module.exports = {
    addTrain,
    getTrains,
    updateTrainSeats
};
