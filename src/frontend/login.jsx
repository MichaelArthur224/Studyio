import './styles/footer.css';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Import useNavigate
import './styles/login.css';

console.log('login page');

function Login() {
  // State for username, password, email (for registration), and message
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isRegistering, setIsRegistering] = useState(false); // Toggle state for form type
  const [showSuccessModal, setShowSuccessModal] = useState(false); // For success modal visibility
  const navigate = useNavigate(); // Initialize the navigate function

  // Handle form submission for login
  const handleLogin = async (e) => {
    e.preventDefault();

    if (!username || !password) {
      setMessage('Please fill out both fields');
      return;
    }

    try {
      const response = await fetch('http://localhost:4000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message); // Successful login message

        // Store the user data or token (if needed)
        localStorage.setItem('user', JSON.stringify(data.user)); // Store user data (or token)

        // Show success modal
        setShowSuccessModal(true);

        // Redirect to the homepage after successful login (optional)
        setTimeout(() => {
          navigate('/'); // Redirect to the homepage
        }, 2000); // Wait for 2 seconds before redirecting
      } else {
        setMessage(data.message); // Error message from the backend
      }
    } catch (err) {
      console.error(err);
      setMessage('Error connecting to the server');
    }
  };

  // Handle form submission for registration
  const handleRegister = async (e) => {
    e.preventDefault();

    if (!username || !password || !email) {
      setMessage('Please fill out all fields');
      return;
    }

    try {
      const response = await fetch('http://localhost:4000/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password, email }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Registration successful! Redirecting to login...');
        setIsRegistering(false); // Switch back to login form after successful registration

        // Redirect to the login page after successful registration
        navigate('/login'); // Redirect to the login page
      } else {
        setMessage(data.message); // Error message from the backend
      }
    } catch (err) {
      console.error(err);
      setMessage('Error connecting to the server');
    }
  };

  // Function to close the success modal
  const closeModal = () => {
    setShowSuccessModal(false);
  };

  return (
    <div className="login-container">
      {isRegistering ? (
        <form onSubmit={handleRegister}>
          <h2>Register</h2>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
          />
          <br />
          <br />
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
          />
          <br />
          <br />
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
          />
          <br />
          <br />
          <button type="submit">Register</button>
          <p>
            Already have an account?{' '}
            <button type="button" onClick={() => setIsRegistering(false)}>
              Login here
            </button>
          </p>
        </form>
      ) : (
        <form onSubmit={handleLogin}>
          <h2>Login</h2>
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
          />
          <br />
          <br />
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
          />
          <br />
          <br />
          <button type="submit">Login</button>
          <p>
            Don't have an account?{' '}
            <button type="button" onClick={() => setIsRegistering(true)}>
              Register here
            </button>
          </p>
        </form>
      )}

      {/* Display message */}
      {message && <p>{message}</p>}

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="modal">
          <div className="modal-content">
            <h3>Login Successful!</h3>
            <p>Welcome back, {username}!</p>
            <button onClick={closeModal}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Login;



