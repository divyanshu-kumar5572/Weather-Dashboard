// server/routes/auth.js

import express from 'express';
// 1. Import the tools we need: our User model and the bcryptjs library for password hashing.
import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
const router = express.Router();

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user
 * @access  Public
 */
// 2. We make the route handler an `async` function because database operations are asynchronous.
router.post('/register', async (req, res) => {
  // 3. Destructure email and password from the request body. `express.json()` middleware makes this possible.
  const { email, password } = req.body;

  try {
    
    let user = await User.findOne({ email }); // Find a user document where the email matches the one from the request.

    if (user) {
      return res.status(400).json({ message: 'User with this email already exists.' });
    }
    if (!password || password.length < 6) {
        return res.status(400).json({ message: 'Password must be at least 6 characters long.' });
    }
    user = new User({
      email,
      password, 
    });
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    await user.save();
    res.status(201).json({ message: 'User registered successfully!' });

  } catch (error) {
    console.error('Registration Error:', error.message);
    res.status(500).send('Server error');
  }
});

/**
 * @route   POST /api/auth/login
 * @desc    Authenticate user & get token
 * @access  Public
 */
router.post('/login', async (req, res) => {
  // 2. Destructure email and password from the request body.
  const { email, password } = req.body;

  try {
    // 3. IDENTIFICATION: Find the user by their email.
    const user = await User.findOne({ email });

    // If no user is found with that email, it's an invalid login attempt.
    // We send a generic "Invalid Credentials" message for security.
    // We don't want to reveal whether the email exists or not.
    if (!user) {
      return res.status(400).json({ message: 'Invalid Credentials' });
    }

    // 4. VERIFICATION: Compare the provided password with the stored hashed password.
    //    bcrypt.compare() is an async function that handles this securely.
    //    It hashes the incoming `password` and compares it to `user.password` (the stored hash).
    const isMatch = await bcrypt.compare(password, user.password);

    // If the passwords do not match, it's also an invalid login attempt.
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid Credentials' });
    }

    // 5. AUTHORIZATION: If credentials are valid, create and sign the JWT.
    //    Create the payload for the token. We only need the user's unique ID.
    //    This ID is non-sensitive and allows us to identify the user in future requests.
    const payload = {
      user: {
        id: user.id, // Mongoose provides a virtual 'id' getter that is the same as '_id'.
      },
    };

    // Sign the token.
    jwt.sign(
      payload,
      process.env.JWT_SECRET, // The secret key we added to our .env file.
      { expiresIn: '1h' },    // Token expiration option. '1h' means it's valid for one hour.
      (err, token) => {       // The callback function that runs after signing.
        if (err) throw err;
        // On success, send the token back to the client in a JSON response.
        res.status(200).json({ token });
      }
    );
  } catch (error) {
    console.error('Login Error:', error.message);
    res.status(500).send('Server error');
  }
});

export default router;