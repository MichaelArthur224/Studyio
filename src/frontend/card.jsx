import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from './nav.jsx';
import './styles/about.css';
import { useParams } from 'react-router-dom';

function Card() {
  const { setId } = useParams();  // Get setId from URL
  const [flashcards, setFlashcards] = useState([]);
  const [setDetails, setSetDetails] = useState({ set_name: 'Unnamed Set' });
  const userId = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).id : null;

  // Debugging: log userId and setId to ensure they're correct
  console.log('User ID:', userId);
  console.log('Set ID:', setId);

  useEffect(() => {
    if (!userId || !setId) {
      console.warn('No user ID or set ID found.');
      return; // Exit if either userId or setId is missing
    }

    const fetchFlashcards = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`http://localhost:4000/get-flashcards/${setId}/${userId}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        if (response.data) {
          setFlashcards(response.data);
        } else {
          console.warn('No flashcards found for this user.');
          setFlashcards([]);
        }
      } catch (err) {
        console.error('Error fetching flashcards:', err);
        setFlashcards([]);
      }
    };

    fetchFlashcards();
  }, [userId, setId]); // Trigger fetch when userId or setId changes

  return (
    <div>
      <Navbar />
      <h1>Flashcards for Set {setId}</h1>
      {/* Render flashcards here */}
      {flashcards.length > 0 ? (
        <ul>
          {flashcards.map((flashcard, index) => (
            <li key={index}>{flashcard.question}</li>
          ))}
        </ul>
      ) : (
        <p>No flashcards available.</p>
      )}
    </div>
  );
}

export default Card;


