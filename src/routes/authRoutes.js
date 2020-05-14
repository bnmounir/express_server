const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const User = mongoose.model('User');

router.post('/signup', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = new User({ email, password });
        await user.save();
        const token = jwt.sign({ userID: user._id }, process.env.JWT_SECRET);
        res.send({ token });
    } catch (err) {
        res.status(422).send(err.message);
    }
});

router.post('/signin', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res
            .status(422)
            .send({ error: 'Email and Password are required!' });
    }

    const user = await User.findOne({ email });
    if (!user) {
        return res.status(404).send({ error: 'User not found!' });
    }
    try {
        await user.comparePassword(password);
        const token = jwt.sign({ userID: user._id }, process.env.JWT_SECRET);
        res.send({ token });
    } catch (err) {
        return res.status(422).send({ error: 'Invalid Credentials!' });
    }
});

module.exports = router;
