// routes/authRoutes.js
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { connectToDatabase } = require('../models/db');
const { body, validationResult } = require('express-validator');

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


router.put('/update', [
    // Task 1: Use the `body`,`validationResult` from `express-validator` for input validation
    body('firstName').notEmpty().withMessage('First name is required'),
    body('lastName').notEmpty().withMessage('Last name is required'),
    body('email').isEmail().withMessage('Invalid email address'),
    body('password').notEmpty().withMessage('Password is required'),
], async (req, res) => {
    try {
        // Task 2: Validate the input using `validationResult` and return an appropriate message if there is an error.
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            logger.error('Validation errors in update request', errors.array());
            return res.status(400).json({ errors: errors.array() });
        }

        // Task 3: Check if `email` is present in the header and throw an appropriate error message if not present.
        const email = req.headers.email;
        if (!email) {
            logger.error('Email not found in the request headers');
            return res.status(400).json({ error: 'Email not found in the request headers' });
        }

        // Task 4: Connect to MongoDB
        const db = await connectToDatabase();
        const collection = db.collection("users");

        // Task 5: Find user credentials in the database
        const existingUser = await collection.findOne({ email });

        if (!existingUser) {
            logger.error('User not found');
            return res.status(404).json({ error: "User not found" });
        }
        existingUser.firstName = req.body.name;
        existingUser.updatedAt = new Date();

        // Task 6: Update user credentials in the database
        
        const updatedUser =  await collection.findOneAndUpdate(
            { email },
            { $set: existingUser },
            { returnDocument: 'after' }
        );

        // Task 7: Create JWT authentication using the secret key from the .env file
        const payload = {
            user: {
                id: updatedUser._id.toString(),
            },
        };
        const authtoken = jwt.sign(payload, process.env.JWT_SECRET);
        logger.info('User updated successfully');
        res.json({ authtoken });
    } catch (error) {
        console.error('Internal server error:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});


module.exports = router;
