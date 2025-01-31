import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from './nav.jsx';
import './styles/sets.css';

function Sets() {
  
  console.log(localStorage.getItem('token'));  // Log token to verify its value
  const token = localStorage.getItem('token');
if (!token) {
  console.error('No token found');
  return; // Handle the missing token case
}

  const [savedSets, setSavedSets] = useState([]); // Initialize as an array
  const [loading, setLoading] = useState(true);

  // Fetch saved sets when the component mounts
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    const token = localStorage.getItem('token'); // Retrieve token from localStorage
  
    if (user && token) {
      const userId = user.id;
      console.log("User ID:", userId); // Log the user ID for debugging
  
      // Fetch the user's saved flashcard sets from the backend
      axios
        .get(`http://localhost:4000/get-sets/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`, // Add token to Authorization header
          },
        })
        .then((response) => {
          console.log("Saved sets response:", response.data);
          setSavedSets(response.data);
          setLoading(false); // Set loading to false when the data is fetched
        })
        .catch((error) => {
          console.error('Error fetching saved sets:', error);
          setLoading(false); // Set loading to false even if there is an error
        });
    } else {
      setLoading(false); // If no user or token is found in localStorage, set loading to false
    }
  }, []);
  

  // Handle loading a set's flashcards
const handleLoadSet = (setId, userId) => {
  axios
    .get(`/get-flashcards/${setId}/${userId}`)
    .then((response) => {
      const flashcards = response.data;

      // Save flashcards to local storage
      localStorage.setItem('flashcards', JSON.stringify(flashcards));

      // Redirect to the card display page
      window.location.href = `/flashcards/${setId}`;
    })
    .catch((error) => {
      console.error('Error loading set flashcards:', error);
      alert('Failed to load flashcards. Please try again.');
    });
};


  return (
    <div className="saved-sets-container">
      <Navbar />
      <h1>Saved Sets</h1>

      {loading ? (
        <p>Loading saved sets...</p> // Display loading message when data is being fetched
      ) : (
        <div className="saved-sets">
          {savedSets.length === 0 ? (
            <p>No saved sets found.</p> // If no sets found, display this message
          ) : (
            savedSets.map((set) => (
              <div
                key={set.id}
                className="saved-set"
                onClick={() => handleLoadSet(set.id)}
              >
                <h3>{set.set_name || 'Unnamed Set'}</h3>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

export default Sets;

