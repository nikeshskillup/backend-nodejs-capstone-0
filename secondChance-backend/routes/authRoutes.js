// routes/authRoutes.js
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { connectToDatabase } = require('../models/db');

const router = express.Router();

router.post('/login', async (req, res) => {
    try {
        // Task 1: Connect to `secondChance` in MongoDB through `connectToDatabase` in `db.js`.
        const db = await connectToDatabase();

        // Task 2: Access MongoDB `users` collection
        const collection = db.collection('users');

        // Task 3: Check for user credentials in the database
        const theUser = await collection.findOne({ email: req.body.email });

        // Task 4: Check if the password matches the encrypted password and send an appropriate message on mismatch
        if (theUser) {
            const passwordMatch = await bcryptjs.compare(req.body.password, theUser.password);

            if (!passwordMatch) {
                console.error('Passwords do not match');
                return res.status(401).json({ error: 'Invalid password' });
            }

            // Task 5: Fetch user details from the database
            const userName = theUser.firstName;
            const userEmail = theUser.email;

            // Task 6: Create JWT authentication if passwords match with user._id as payload
            let payload = {
                user: {
                    id: theUser._id.toString(),
                },
            };
            jwt.sign(user._id, JWT_SECRET)

            //   const payload = {
            //     user: {
            //       id: theUser._id.toString(),
            //     },
            //   };

            //   const token = jwt.sign(payload, 'yourSecretKey', { expiresIn: '1h' });

            // Respond with the authentication token, user name, and user email
            res.json({ authtoken: token, userName, userEmail });
        } else {
            // Task 7: Send an appropriate message if the user is not found
            console.error('User not found');
            return res.status(404).json({ error: 'User not found' });
        }
    } catch (error) {
        console.error('Internal server error:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;
