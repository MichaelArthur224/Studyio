import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from './nav.jsx';
import './styles/about.css';

function About () {

  return (
    <div className="about-container">
      <h1>About</h1>
        <p>This website allows users to create, manage, 
            and save their flashcard sets for study and learning. Users can 
            add new flashcards, consisting of a question and its corresponding answer,
             and organize them into sets. The application offers an interactive gameplay
              mode to test users' memory and improve retention. Flashcards are stored 
              both locally and on a server, providing flexibility across devices. 
              This project is built using React, Vite, 
            and PostgreSQL, offering a seamless user experience</p>
    </div>
  );
}

export default About;