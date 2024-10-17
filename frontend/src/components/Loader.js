import React from 'react';
import './Loader.css'; // Import CSS for styling

const Loader = () => (
  <div className="loader">
    <div className="spinner"></div>
    <p>Processing your file, please wait...</p>
  </div>
);

export default Loader;
