const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const {z} = require('zod');

require('dotenv').config();


const userSchema = z.object({
    username: z.string().email().min(3).max(50).refine(async (username) => {
        const user = await User.findOne({ where: { username } });
        return !user;
    }, 'Username already exists'),
    password: z.string().min(8).max(50)
        .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
        .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
        .regex(/\d/, 'Password must contain at least one number')
        .regex(/[!@#$%^&*(),.?":{}|<>]/, 'Password must contain at least one special character'),
    role: z.string().min(3).max(20)
});


const registerUser = async (req, res) => {
    try {
        const validateData = userSchema.parse(req.body);
        const hashedPassword = await bcrypt.hash(validateData.password, 10);
        const user = await User.create({
            username: validateData.username,
            password: hashedPassword,
            role: validateData.role
        });
        res.status(201).send('User registered');
    } catch (error) {
        if (error instanceof z.ZodError) {
            res.status(400).send(error.errors);
        } else {
            res.status(500).send(error.message);
        }
    }
};

const loginSchema = z.object({
    username: z.string().email(),
    password: z.string().min(8).max(50)
});

const loginUser = async (req, res) => {
    try {
        const validatedData = loginSchema.parse(req.body);
        const user = await User.findOne({ where: { username: validatedData.username } });
        if (!user || !await bcrypt.compare(validatedData.password, user.password)) {
            return res.status(401).send('Authentication failed');
        }
        console.log(`user id and role ${user.id} ${user.role}`);
        const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token });
    } catch (error) {
        if (error instanceof z.ZodError) {
            res.status(400).send(error.errors);
        } else {
            res.status(500).send(error.message);
        }
    }
};

module.exports = { registerUser, loginUser };
