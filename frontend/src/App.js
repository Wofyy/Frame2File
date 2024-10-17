import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import About from './components/About';
import Data from './components/Data';
import NavbarComponent from './components/navbar';
import SuccessPage from './components/SuccessPage';
import './App.css'

function App() {
  return (
    <Router>
      <div className="App">
        <NavbarComponent /> {/* Navbar is displayed on all routes */}
        <main className="content"> {/* Wrap routes in a main element */}
          <Routes>
            <Route path="/" exact element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/data" element={<Data />} />
            <Route path="/success" element={<SuccessPage />} />

          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;