const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const USER = require('../models/User.js');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Jwt_secret } = require('../keys');
const requireLogin = require('../middlewares/requireLogin.js');




router.post('/signup', (req, res) => {
    const { name, userName, email, password } = req.body;

    if (!name || !email || !userName || !password) {
        return res.status(422).json({ error: "please add all fields" });
    }

    USER.findOne({ $or: [{ email: email }, { userName: userName }] })
        .then((savedUser) => {

            if (savedUser) {
                return res.status(422).json({ error: "User already exist with email or username" });
            }

            bcrypt.hash(password, 12).then((hasedPassword) => {
                const user = new USER({
                    name,
                    email,
                    userName,
                    password: hasedPassword
                });

                user.save()
                    .then((user) => {
                        res.json({ messsage: "Registered successfully" })
                    })
                    .catch(err => {
                        res.json({ error: "not registered due to error" })
                    })
            })

        })


});

router.post("/signin", async (req, res) => {

    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(422).json({
            error: "please add email and password"
        });
    }

    try {
        const savedUser = await USER.findOne({ email });

        if (!savedUser) {
            return res.status(422).json({ error: "invalid email" });
        }

        const match = await bcrypt.compare(password, savedUser.password);

        if (!match) {
            return res.status(422).json({ error: "invalid password" });
        }

        const token = jwt.sign({ _id: savedUser._id }, Jwt_secret);

        res.status(200).json({
            token,
            user: {
                _id: savedUser._id,
                name: savedUser.name,
                email: savedUser.email,
                userName: savedUser.userName
            }
        });

    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "something went wrong" });
    }

});





module.exports = router;