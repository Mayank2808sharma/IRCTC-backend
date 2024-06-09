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
        const { username, password, role } = req.body

        const usernameRegex = /^[0-9A-Za-z_]{6,16}$/
        const PasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,32}$/

        if (!username.match(usernameRegex)) {
            return res.status(400).json({ error: "Invalid username. It must be 6-16 characters long, alphanumeric only." })
        }

        if (!password.match(PasswordRegex)) {
            return res.status(400).json({ error: "Invalid password. It must be 8-32 characters long, include at least one lowercase letter, one uppercase letter, one number, and one special character." });
        }

        const existingUser = await User.findOne({ where: { username } });
        if (existingUser) {
            return res.status(400).json({ error: "This username is already registered." })
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({
            username,
            password: hashedPassword,
            role
        });

        res.status(201).json({ message: "User registered successfully." });
    } catch (error) {
        console.error("Error registering user:", error);
        res.status(500).json({ error: "Internal server error." });
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
