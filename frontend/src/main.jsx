import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App'; // Make sure this path points to your App.jsx

// Create a root and render the App component into the 'root' div in index.html
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
