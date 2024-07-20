import React, { useState, useEffect } from 'react';
import axios from 'axios';
import socketIOClient from 'socket.io-client';
import './App.css';

// Define the endpoint for the backend server
const ENDPOINT = "http://127.0.0.1:5000";

function App() {
  // Define state variables
  const [message, setMessage] = useState(''); // State to hold messages from the server
  const [username, setUsername] = useState(''); // State to hold the username
  const [password, setPassword] = useState(''); // State to hold the password
  const [token, setToken] = useState(''); // State to hold the JWT token

  // Effect to handle WebSocket connections and updates
  useEffect(() => {
    const socket = socketIOClient(ENDPOINT); // Connect to the server via WebSocket
    socket.on("update", data => {
      setMessage(data.message); // Update message state when a message is received from the server
    });

    return () => socket.disconnect(); // Cleanup WebSocket connection on component unmount
  }, []);

  // Handle file upload for groups
  const handleGroupsUpload = async (e) => {
    const file = e.target.files[0]; // Get the selected file
    const data = new FormData(); // Create FormData to send file
    data.append('file', file); // Append the file to FormData
    await axios.post(`${ENDPOINT}/upload-groups`, data, {
      headers: { 'x-access-token': token } // Include JWT token in headers
    });
  };

  // Handle file upload for hostels
  const handleHostelsUpload = async (e) => {
    const file = e.target.files[0]; // Get the selected file
    const data = new FormData(); // Create FormData to send file
    data.append('file', file); // Append the file to FormData
    await axios.post(`${ENDPOINT}/upload-hostels`, data, {
      headers: { 'x-access-token': token } // Include JWT token in headers
    });
  };

  // Handle user registration
  const handleRegister = async () => {
    await axios.post(`${ENDPOINT}/register`, { username, password }); // Send username and password to register endpoint
  };

  // Handle user login
  const handleLogin = async () => {
    const response = await axios.post(`${ENDPOINT}/login`, { username, password }); // Send username and password to login endpoint
    setToken(response.data.token); // Set the received JWT token in state
  };

  return (
    <div className="App">
      <h1>Group Accommodation Allocation</h1>
      <div className="auth-container">
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)} // Update username state on input change
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)} // Update password state on input change
        />
        <button onClick={handleRegister}>Register</button> {/* Call handleRegister on click */}
        <button onClick={handleLogin}>Login</button> {/* Call handleLogin on click */}
      </div>
      <div className="file-upload-container">
        <input type="file" onChange={handleGroupsUpload} /> {/* Call handleGroupsUpload on file change */}
        <input type="file" onChange={handleHostelsUpload} /> {/* Call handleHostelsUpload on file change */}
      </div>
      <p>{message}</p> {/* Display message from server */}
    </div>
  );
}

export default App;
