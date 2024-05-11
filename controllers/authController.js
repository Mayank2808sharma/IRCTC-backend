const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { CreateSuccess } = require('../utils/success');
const {CreateError} = require('../utils/error');
require('dotenv').config();

const registerUser = async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const user = await User.create({
            username: req.body.username,
            password: hashedPassword,
            role: req.body.role
        });
        res.status(201).send('User registered'); // remove this

        // Modified the response to include the user object
        // res.send(CreateSuccess(201, "User registered Successfully ", user));
    } catch (error) {
        res.status(500).send(error.message);  // remove this 

        // Modified the response to include the error object
        // res.send(CreateError(500, error.message));
    }
};

const loginUser = async (req, res) => {
    try {
        const user = await User.findOne({ where: { username: req.body.username } });
        if (!user || !await bcrypt.compare(req.body.password, user.password)) {
            return res.status(401).send('Authentication failed'); // remove this

            // Modified the response to include the error object
            // res.send(CreateError(401, "Authentication failed"));
        }
        console.log(`user id and role ${user.id} ${user.role}`);
        const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token }); // remove this

        // Modified the response to include the token object
        //res.send(CreateSuccess(200, "User logged in successfully",  token ));

    } catch (error) {
        res.status(500).send(error.message); // remove this
        
        // Modified the response to include the error object
        // res.send(CreateError(500, error.message));
    }
};

module.exports = { registerUser, loginUser };
