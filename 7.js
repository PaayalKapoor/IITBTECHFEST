// Import required modules
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const path = require('path');

// Initialize Express app and HTTP server
const app = express();
const server = http.createServer(app);
const io = socketIo(server); // Initialize Socket.IO

// Middleware setup
app.use(bodyParser.json()); // Parse JSON bodies
app.use(cors()); // Enable CORS
app.use(express.static(path.join(__dirname, 'frontend/build'))); // Serve static files from React frontend

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/accommodation', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Define Mongoose schemas and models
const UserSchema = new mongoose.Schema({
  username: String,
  password: String,
});

const GroupSchema = new mongoose.Schema({
  groupId: Number,
  members: Number,
  gender: String,
});

const HostelSchema = new mongoose.Schema({
  hostelName: String,
  roomNumber: Number,
  capacity: Number,
  gender: String,
});

const User = mongoose.model('User', UserSchema);
const Group = mongoose.model('Group', GroupSchema);
const Hostel = mongoose.model('Hostel', HostelSchema);

// Secret key for JWT
const SECRET_KEY = 'your_secret_key';

// Route to register a new user
app.post('/register', async (req, res) => {
  const { username, password } = req.body;
  const hashedPassword = bcrypt.hashSync(password, 8); // Hash the password
  try {
    await User.create({ username, password: hashedPassword }); // Create a new user in the database
    res.sendStatus(200); // Send success response
  } catch (err) {
    res.status(500).send('Error registering user'); // Handle errors
  }
});

// Route to login a user
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username }); // Find user in the database
    if (!user) {
      return res.status(404).send('User not found'); // Send error if user not found
    }
    const passwordIsValid = bcrypt.compareSync(password, user.password); // Compare passwords
    if (!passwordIsValid) {
      return res.status(401).send({ auth: false, token: null }); // Send error if password is invalid
    }
    const token = jwt.sign({ id: user._id }, SECRET_KEY, { expiresIn: 86400 }); // Generate JWT
    res.status(200).send({ auth: true, token }); // Send token to the client
  } catch (err) {
    res.status(500).send('Error logging in'); // Handle errors
  }
});

// Middleware to verify JWT
const verifyToken = (req, res, next) => {
  const token = req.headers['x-access-token']; // Get token from headers
  if (!token) {
    return res.status(403).send({ auth: false, message: 'No token provided.' }); // Send error if no token provided
  }
  jwt.verify(token, SECRET_KEY, (err, decoded) => { // Verify token
    if (err) {
      return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' }); // Send error if token verification fails
    }
    req.userId = decoded.id; // Save user ID to request object
    next(); // Proceed to the next middleware/route handler
  });
};

// Route to upload group data (requires authentication)
app.post('/upload-groups', verifyToken, async (req, res) => {
  try {
    await Group.insertMany(req.body); // Insert group data into MongoDB
    res.sendStatus(200); // Send success response
    io.emit('update', { message: 'Groups updated' }); // Emit WebSocket update
  } catch (err) {
    res.status(500).send('Error uploading groups'); // Handle errors
  }
});

// Route to upload hostel data (requires authentication)
app.post('/upload-hostels', verifyToken, async (req, res) => {
  try {
    await Hostel.insertMany(req.body); // Insert hostel data into MongoDB
    res.sendStatus(200); // Send success response
    io.emit('update', { message: 'Hostels updated' }); // Emit WebSocket update
  } catch (err) {
    res.status(500).send('Error uploading hostels'); // Handle errors
  }
});

// Route to serve the React frontend
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend/build', 'index.html'));
});

// WebSocket connection handler
io.on('connection', (socket) => {
  console.log('A user connected');
  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

// Start the server
server.listen(5000, () => {
  console.log('Listening on *:5000');
});
