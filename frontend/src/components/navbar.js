// src/components/Navbar.js
import React from 'react';
import { Link } from 'react-router-dom';
import './navbar.css'; // Import the CSS file for styling

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">MyApp</Link>
        <div className="navbar-menu">
          <Link to="/" className="navbar-item">Home</Link>
          <Link to="/about" className="navbar-item">About</Link>
          <Link to="/services" className="navbar-item">Services</Link>
          <Link to="/contact" className="navbar-item">Contact</Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
