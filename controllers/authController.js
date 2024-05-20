const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

require('dotenv').config();


const changeUserPassword = async (req, res) => {
  const { username, password, newPassword } = req.body;
  try {
    const user = await User.findOne({ where: { username } });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).send("Authentication failed");
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    await User.update({ password: hashedNewPassword }, { where: { username } });

    res.status(200).send("Password changed successfully");
  } catch (error) {
    res.status(500).send(error.message);
  }
};




const registerUser = async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const user = await User.create({
            username: req.body.username,
            password: hashedPassword,
            role: req.body.role
        });
        res.status(201).send('User registered');
    } catch (error) {
        res.status(500).send(error.message);
    }
};

const loginUser = async (req, res) => {
    try {
        const user = await User.findOne({ where: { username: req.body.username } });
        if (!user || !await bcrypt.compare(req.body.password, user.password)) {
            return res.status(401).send('Authentication failed');
        }
        console.log(`user id and role ${user.id} ${user.role}`);
        const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token });
    } catch (error) {
        res.status(500).send(error.message);
    }
};

module.exports = { registerUser, loginUser , changeUserPassword};
