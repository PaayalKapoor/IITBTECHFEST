// Import required modules
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const mongoose = require('mongoose');

// Initialize Express app and HTTP server
const app = express();
const server = http.createServer(app);
const io = socketIo(server); // Initialize Socket.IO

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/accommodation', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Define Mongoose schemas and models
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

const Group = mongoose.model('Group', GroupSchema);
const Hostel = mongoose.model('Hostel', HostelSchema);

// Middleware to parse JSON bodies
app.use(express.json());

// Route to upload group data
app.post('/upload-groups', async (req, res) => {
  try {
    await Group.insertMany(req.body); // Insert group data into MongoDB
    res.sendStatus(200); // Send success response
    io.emit('update', { message: 'Groups updated' }); // Emit WebSocket update
  } catch (err) {
    console.error('Error uploading groups:', err);
    res.status(500).send('Error uploading groups');
  }
});

// Route to upload hostel data
app.post('/upload-hostels', async (req, res) => {
  try {
    await Hostel.insertMany(req.body); // Insert hostel data into MongoDB
    res.sendStatus(200); // Send success response
    io.emit('update', { message: 'Hostels updated' }); // Emit WebSocket update
  } catch (err) {
    console.error('Error uploading hostels:', err);
    res.status(500).send('Error uploading hostels');
  }
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
