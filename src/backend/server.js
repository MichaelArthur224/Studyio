const express = require('express');
const app = express();
const cors = require('cors');
const pool = require('./db'); 
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const secret = 'your_secret_key';
require('dotenv').config(); 

const PORT = process.env.PORT || 4000;
// Secret Key for JWT
const JWT_SECRET = process.env.JWT_SECRET || 'your_secret_key'; 
console.log('JWT_SECRET:', JWT_SECRET);


// Middleware
app.use(cors());
app.use(express.json());

// Routes

// Register a new user
app.post('/register', async (req, res) => {
    try {
        const { email, username, password } = req.body;

        if (!email || !username || !password) {
            return res.status(400).json({ error: "All fields are required." });
        }

        // Check if username already exists
        const existingUser = await pool.query("SELECT * FROM users WHERE username = $1", [username]);
        if (existingUser.rows.length > 0) {
            return res.status(400).json({ error: "Username already exists. Please choose a different one." });
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Insert the new user into the database
        const newUser = await pool.query(
            "INSERT INTO users (email, username, password) VALUES ($1, $2, $3) RETURNING id, email, username",
            [email, username, hashedPassword]
        );

        res.status(201).json({ message: "User registered successfully!", user: newUser.rows[0] });
    } catch (err) {
        console.error("Error during registration:", err.message);
        res.status(500).send("Server error");
    }
});

// Login user
app.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ error: "Username and password are required." });
        }

        // Check if user exists
        const userQuery = await pool.query("SELECT * FROM users WHERE username = $1", [username]);

        if (userQuery.rows.length === 0) {
            console.log('User not found');
            return res.status(400).json({ error: "Invalid username or password." });
        }

        const user = userQuery.rows[0];
        console.log('User found:', user);

        // Check if the password is valid
        const validPassword = await bcrypt.compare(password, user.password);

        if (!validPassword) {
            console.log('Password mismatch');
            return res.status(400).json({ error: "Invalid username or password." });
        }

        // Generate JWT token (short-lived)
        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        // Generate refresh token 
        const refreshToken = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '7d' });

        // Respond with success, user data, and the access token
        res.status(200).json({
            message: "Login successful!",
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                token: token, 
            }
        });

    } catch (err) {
        console.error("Error during login:", err.message);
        res.status(500).send("Server error");
    }
});

// Save flashcard sets
app.post('/save-set', async (req, res) => {
    try {
        const { user_id, set_name, flashcards } = req.body;

        if (!user_id || !set_name || !Array.isArray(flashcards) || flashcards.length === 0) {
            return res.status(400).json({ error: "Invalid input data. Ensure all fields are provided." });
        }

        const newSetResult = await pool.query(
            "INSERT INTO FlashcardSets (user_id, set_name) VALUES ($1, $2) RETURNING id",
            [user_id, set_name]
        );

        const newSetId = newSetResult.rows[0].id;

        const flashcardPromises = flashcards.map(flashcard => {
            return pool.query(
                "INSERT INTO Flashcards (set_id, question, answer) VALUES ($1, $2, $3) RETURNING *",
                [newSetId, flashcard.question, flashcard.answer]
            );
        });

        await Promise.all(flashcardPromises);

        res.status(201).json({
            message: "Flashcard set saved successfully!",
            flashcardSet: { id: newSetId, user_id, set_name, flashcards }
        });
    } catch (err) {
        console.error("Error saving set:", err.message, err.stack);
        res.status(500).json({ error: "Server error", details: err.message });
    }
});

// Get user's saved flashcard sets
app.get('/get-sets/:userId', async (req, res) => {
    const userId = req.params.userId;

    try {
        const result = await pool.query(
            "SELECT id, set_name FROM FlashcardSets WHERE user_id = $1", 
            [userId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "No sets found for this user." });
        }

        res.json(result.rows); // Send both 'id' and 'set_name' as a JSON response
    } catch (err) {
        console.error("Error fetching sets:", err.message);
        res.status(500).json({ error: "Server error" });
    }
});



// Get username by userId
app.get('/get-username/:id', async (req, res) => {
    const userId = req.params.id;

    try {
        // Query the database to fetch the user by their ID
        const result = await pool.query("SELECT username FROM users WHERE id = $1", [userId]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Send the username as a response
        res.json({ username: result.rows[0].username });
    } catch (err) {
        console.error("Error fetching username:", err.message);
        res.status(500).json({ error: 'Server error' });
    }
});

// Get user cards
app.get('/get-flashcards/:set_id/:userId', async (req, res) => {
    const { set_id, userId } = req.params;

    try {
        const query = `
            SELECT f.set_id, f.question, f.answer
            FROM flashcards f
            INNER JOIN flashcardsets fs ON f.set_id = fs.id
            WHERE fs.user_id = $1 AND fs.id = $2;
        `;
        const { rows } = await pool.query(query, [userId, set_id]);
        if (rows.length === 0) {
            return res.status(404).json({ message: 'No flashcards found for this user and set.' });
        }
        res.json(rows);
    } catch (error) {
        console.error('Error fetching flashcards:', error);
        res.status(500).json({ message: 'Internal server error.' });
    }
});
// Middleware to authenticate JWT
function authenticateToken(req, res, next) {
    const token = req.header('Authorization');

    if (!token) {
        return res.status(401).json({ error: "Access denied. No token provided." });
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ error: "Invalid token." });
        }
        req.user = user;
        next();
    });
}

// Refresh token endpoint
app.post('/refresh-token', async (req, res) => {
    const { refreshToken } = req.body;
    try {
      // Verify the refresh token
      const decoded = jwt.verify(refreshToken, 'your_refresh_secret');
      const newAccessToken = jwt.sign({ userId: decoded.userId }, 'your_access_secret', { expiresIn: '1h' });
      res.json({ accessToken: newAccessToken });
    } catch (err) {
      return res.status(401).json({ message: 'Invalid or expired refresh token' });
    }
  });

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

