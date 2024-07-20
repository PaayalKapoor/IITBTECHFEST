import React, { useState, useEffect } from 'react';
import axios from 'axios';
import socketIOClient from 'socket.io-client';
import './App.css'; // Import CSS for styling

const ENDPOINT = "http://127.0.0.1:5000"; // Backend server endpoint

function App() {
  // State variables to store groups, hostels, messages, and errors
  const [groups, setGroups] = useState([]);
  const [hostels, setHostels] = useState([]);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // useEffect hook to set up a WebSocket connection
  useEffect(() => {
    const socket = socketIOClient(ENDPOINT); // Initialize WebSocket connection
    socket.on("update", data => {
      setMessage(data.message); // Update the message state with data from the server
    });

    return () => socket.disconnect(); // Clean up the socket connection when the component unmounts
  }, []);

  // Function to handle the upload of group CSV files
  const handleGroupsUpload = async (e) => {
    const file = e.target.files[0]; // Get the selected file from the input
    if (!file) {
      setError('Please select a file to upload.'); // Display an error if no file is selected
      return;
    }
    const data = new FormData(); // Create a new FormData object to hold the file
    data.append('file', file); // Append the file to the FormData object
    try {
      const response = await axios.post(`${ENDPOINT}/upload-groups`, data); // Post the file to the server
      setGroups(response.data.groups); // Update the groups state with the response data
      setMessage('Groups uploaded successfully'); // Display a success message
      setError(''); // Clear any existing error messages
    } catch (err) {
      setError('Failed to upload groups: ' + (err.response?.data?.message || err.message)); // Display an error message
      setMessage(''); // Clear any existing success messages
    }
  };

  // Function to handle the upload of hostel CSV files
  const handleHostelsUpload = async (e) => {
    const file = e.target.files[0]; // Get the selected file from the input
    if (!file) {
      setError('Please select a file to upload.'); // Display an error if no file is selected
      return;
    }
    const data = new FormData(); // Create a new FormData object to hold the file
    data.append('file', file); // Append the file to the FormData object
    try {
      const response = await axios.post(`${ENDPOINT}/upload-hostels`, data); // Post the file to the server
      setHostels(response.data.hostels); // Update the hostels state with the response data
      setMessage('Hostels uploaded successfully'); // Display a success message
      setError(''); // Clear any existing error messages
    } catch (err) {
      setError('Failed to upload hostels: ' + (err.response?.data?.message || err.message)); // Display an error message
      setMessage(''); // Clear any existing success messages
    }
  };

  return (
    <div className="App">
      <h1>Group Accommodation Allocation</h1>
      <div className="upload-section">
        {/* Section for uploading group CSV files */}
        <div className="upload-container">
          <h2>Upload Groups</h2>
          <input type="file" onChange={handleGroupsUpload} /> {/* Input for group CSV files */}
        </div>
        {/* Section for uploading hostel CSV files */}
        <div className="upload-container">
          <h2>Upload Hostels</h2>
          <input type="file" onChange={handleHostelsUpload} /> {/* Input for hostel CSV files */}
        </div>
      </div>
      {/* Display success or error messages */}
      {message && <p className="message">{message}</p>}
      {error && <p className="error">{error}</p>}
      {/* Display the list of uploaded groups */}
      {groups.length > 0 && (
        <div className="data-section">
          <h2>Uploaded Groups</h2>
          <ul className="data-list">
            {groups.map(group => (
              <li key={group.id}>{group.name}</li>
            ))}
          </ul>
        </div>
      )}
      {/* Display the list of uploaded hostels */}
      {hostels.length > 0 && (
        <div className="data-section">
          <h2>Uploaded Hostels</h2>
          <ul className="data-list">
            {hostels.map(hostel => (
              <li key={hostel.id}>{hostel.name}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default App;
