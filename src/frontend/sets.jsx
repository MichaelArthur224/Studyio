import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from './nav.jsx';
import './styles/sets.css';

function Sets() {
  const [savedSets, setSavedSets] = useState([]); // Initialize as an array
  const [loading, setLoading] = useState(true);

  // Fetch saved sets when the component mounts
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      const userId = user.id;
      console.log("User ID:", userId); // Log the user ID for debugging

      // Fetch the user's saved flashcard sets from the backend
      axios
        .get(`http://localhost:4000/get-sets/${userId}`)
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
      setLoading(false); // If no user is found in localStorage, set loading to false
    }
  }, []);

  // Handle loading a set's flashcards
  const handleLoadSet = (setId) => {
    axios
      .get(`/get-flashcards/${setId}`)
      .then((response) => {
        const flashcards = response.data;
        localStorage.setItem('flashcards', JSON.stringify(flashcards));
        window.location.href = '/home'; // Navigate back to the home page or update the state in your app
      })
      .catch((error) => {
        console.error('Error loading set flashcards:', error);
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

