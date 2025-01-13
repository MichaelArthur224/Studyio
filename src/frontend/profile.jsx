import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from './nav.jsx';
import './styles/profile.css';

function Profile() {
  const [username, setUsername] = useState('');

  useEffect(() => {
    const fetchUsername = async () => {
      const userId = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).id : null;
      
      if (userId) {
        try {
          const token = localStorage.getItem('token');
          const response = await axios.get(`http://localhost:4000/get-username/${userId}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setUsername(response.data.username); // Assuming the API returns a 'username' field
        } catch (error) {
          console.error('Error fetching username:', error);
          alert('There was an error fetching your username. Please try again.');
        }
      } else {
        alert('You must be logged in to view your profile.');
      }
    };

    fetchUsername();
  }, []);

  return (
    <div className="profile-container">
      <h1>Hello, {username || 'User'}!</h1>
      <p>Time To Study!</p>
    </div>
  );
}

export default Profile;
