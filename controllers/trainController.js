const Sequelize  = require('sequelize');
const Train = require('../models/train');

const trainSchema = z.object({
    train_name: z.string().min(3).max(50).regex(/^[a-zA-Z0-9\s]+$/, 'Train name can only contain letters, numbers, and spaces'),
    source: z.string().min(3).max(50).regex(/^[a-zA-Z\s]+$/, 'Source can only contain letters and spaces'),
    destination: z.string().min(3).max(50).regex(/^[a-zA-Z\s]+$/, 'Destination can only contain letters and spaces'),
    total_seats: z.number().int().positive().min(10, 'Minimum total seats is 10'),
    available_seats: z.number().int().positive().max(z.func().arg(z.object({ total_seats: z.number().int() })).return(z.number().int()), 'Available seats cannot exceed total seats')
});


const addTrain = async (req, res) => {
    try {
        const validatedData = trainSchema.parse(req.body);
        const train = await Train.create({
            train_name: validatedData.train_name.toLowerCase(),
            source: validatedData.source.toLowerCase(),
            destination: validatedData.destination.toLowerCase(),
            total_seats: validatedData.total_seats,
            available_seats: validatedData.available_seats
        });
        res.status(201).json(train);
    } catch (error) {
        if (error instanceof z.ZodError) {
            res.status(400).send(error.errors);
        } else {
            res.status(500).json({ message: error.message });
        }
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
