import './styles/nav.css';
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Changed to useNavigate

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Track login status
  const navigate = useNavigate(); // Initialize useNavigate

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  // Check if the user is logged in on component mount
  useEffect(() => {
    const user = localStorage.getItem('user'); // Get user info from localStorage
    if (user) {
      setIsLoggedIn(true); // User is logged in
    }
    console.log('User status:', user); // Log to check if user info is available
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user'); // Clear the user data from localStorage
    setIsLoggedIn(false); // Update login status
    navigate('/'); // Redirect to home or login page
  };

  return (
    <nav className="navbar">
      {/* Brand */}
      <div className="navbar-brand">
        <Link to="/">STUDYIO</Link> {/* Link to Home page */}
      </div>

      {/* Links */}
      <ul className={`navbar-links ${isOpen ? 'active' : ''}`}>
        <li><Link to="/about">About</Link></li>
        <li><Link to="/quiz">Quiz</Link></li>
        <li><Link to="/sets">Sets</Link></li>

        {/* Conditionally render Profile/Logout or Login */}
        {isLoggedIn ? (
          <>
            <li><Link to="/profile">Profile</Link></li> {/* Profile link */}
            <li className="logout" onClick={handleLogout}>Logout</li> {/* Logout link */}
          </>
        ) : (
          <li><Link to="/login">Login</Link></li> // Login link if not logged in
        )}
      </ul>

      {/* Hamburger Menu */}
      <div className="navbar-toggle" onClick={handleToggle}>
        <span></span>
        <span></span>
        <span></span>
      </div>
    </nav>
  );
}

export default Navbar;








