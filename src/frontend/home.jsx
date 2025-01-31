import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from './nav.jsx';
import './styles/home.css';

function SaveSetPopup({ isOpen, onClose, onSave }) {
  const [setName, setSetName] = useState('');

  const handleSave = () => {
    if (setName.trim() === '') {
      alert('Please enter a set name.');
      return;
    }
    onSave(setName);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="popup-overlay">
      <div className="popup-content">
        <h3>Save Flashcard Set</h3>
        <input
          type="text"
          placeholder="Enter set name"
          value={setName}
          onChange={(e) => setSetName(e.target.value)}
        />
        <div className="popup-buttons">
          <button onClick={handleSave}>Save</button>
          <button onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

function Home() {
  const [flashcards, setFlashcards] = useState([]);
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  // Safe user ID retrieval from localStorage
  const userData = localStorage.getItem('user');
  const userId = userData ? JSON.parse(userData).id : null;

  useEffect(() => {
    const fetchFlashcards = async () => {
      if (!userId) {
        const savedFlashcards = localStorage.getItem('flashcards');
        if (savedFlashcards) {
          try {
            const flashcardsData = JSON.parse(savedFlashcards);
            setFlashcards(Array.isArray(flashcardsData) ? flashcardsData : []);
          } catch (error) {
            console.error('Error parsing flashcards:', error);
            setFlashcards([]);  // Set empty flashcards if parsing fails
          }
        }
        return;
      }

      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`http://localhost:4000/get-flashcards/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setFlashcards(response.data); // Set the fetched flashcards to state
      } catch (err) {
        console.error("Error fetching flashcards:", err);
        setFlashcards([]); // Clear flashcards in case of error to avoid showing fetch error
      }
    };

    fetchFlashcards();
  }, [userId]);

  const addFlashcard = async () => {
    const question = document.getElementById('question').value;
    const answer = document.getElementById('answer').value;

    if (!question || !answer) {
      alert('Please enter both question and answer!');
      return;
    }

    const newFlashcard = {
      id: Date.now(),
      question,
      answer,
    };

    setFlashcards((prevFlashcards) => [...prevFlashcards, newFlashcard]);

    // Clear input fields
    document.getElementById('question').value = '';
    document.getElementById('answer').value = '';

    if (userId) {
      try {
        const token = localStorage.getItem('token');
        await axios.post('http://localhost:4000/save-flashcard', {
          user_id: userId,
          question,
          answer,
        }, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } catch (err) {
        console.error("Error saving flashcard:", err);
        alert("Failed to save flashcard.");
      }
    }
  };

  const deleteFlashcard = async (id) => {
    setFlashcards((prevFlashcards) =>
      prevFlashcards.filter((flashcard) => flashcard.id !== id)
    );

    if (userId) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`http://localhost:4000/delete-flashcard/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } catch (err) {
        console.error("Error deleting flashcard:", err);
        alert("Failed to delete flashcard.");
      }
    }
  };

  const startGame = () => {
    localStorage.setItem('flashcards', JSON.stringify(flashcards));
    window.location.href = '/game';
  };

  const handleSaveSet = async (setName) => {
    if (!setName.trim()) {
      alert('Please provide a valid set name.');
      return;
    }

    if (userId) {
      try {
        // Save the flashcard set first
        const responseSet = await axios.post('http://localhost:4000/save-set', {
          user_id: userId,
          set_name: setName,
          flashcards: flashcards, // Send the flashcards along with the set
        });

        alert(responseSet.data.message);
        setIsPopupOpen(false); // Close the popup after successful save
      } catch (error) {
        console.error('Error saving flashcard set:', error.response?.data || error.message);
        alert('There was an error saving your set. Please try again.');
      }
    } else {
      alert('You must be logged in to save a set!');
    }
  };

  return (
    <>
      <Navbar />

      <div className="home-container">
        <label htmlFor="question">Question</label>
        <input type="text" id="question" placeholder="Enter question" />
        <br />
        <br />
        <label htmlFor="answer">Answer</label>
        <input type="text" id="answer" placeholder="Enter correct answer" />
        <br />
        <br />

        <div id="bttns">
          <button onClick={addFlashcard}>Add Flashcard</button>
          <button onClick={startGame}>Start Game</button>
          <button onClick={() => setIsPopupOpen(true)}>Save Set</button>
        </div>

        <div id="flashcardsDisplay">
          {flashcards.length === 0 ? (
            <p>No flashcards available!</p>
          ) : (
            flashcards.map((flashcard) => (
              <div className="flashcard" key={flashcard.id}>
                <p>Q: {flashcard.question}</p>
                <p>A: {flashcard.answer}</p>
                <button className="delete-btn" onClick={() => deleteFlashcard(flashcard.id)}>
                  Delete
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      <SaveSetPopup
        isOpen={isPopupOpen}
        onClose={() => setIsPopupOpen(false)}
        onSave={handleSaveSet}
      />
    </>
  );
}

export default Home;

