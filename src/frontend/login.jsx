import './styles/footer.css';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './styles/login.css';

console.log('login page');

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [passwordError, setPasswordError] = useState(false); // New state for password error
  const navigate = useNavigate();

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
        setMessage(data.message);

        // Store the user data or token (if needed)
        localStorage.setItem('user', JSON.stringify(data.user));

        setShowSuccessModal(true);

        setTimeout(() => {
          navigate('/');
        }, 2000);
      } else {
        setMessage(data.error); // Display error message
        setPasswordError(true); // Trigger password input highlight
        setTimeout(() => {
          setPasswordError(false); // Reset password error state after 1 second
        }, 1000);
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
        setIsRegistering(false);

        navigate('/login');
      } else {
        setMessage(data.message);
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
            className={passwordError ? 'error' : ''} // Add error class if password is incorrect
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




