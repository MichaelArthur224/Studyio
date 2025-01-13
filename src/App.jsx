import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './frontend/home.jsx';
import Game from './frontend/game.jsx'; 
import Navbar from './frontend/nav.jsx';
import Footer from './frontend/footer.jsx';
import Login from './frontend/login.jsx';
import Sets from './frontend/sets.jsx';
import About from './frontend/about.jsx';
import Profile from './frontend/profile.jsx';

function App() {
  return (
    <Router>
      <Navbar /> {/* This will always be rendered */}
      <Routes>
        <Route path="/" element={<Home />} /> {/* Home is default route */}
        <Route path="/home" element={<Home />} />
        <Route path="/game" element={<Game />} />
        <Route path="/login" element={<Login />} />
        <Route path="/sets" element={<Sets />} />
        <Route path="/about" element={<About />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;

