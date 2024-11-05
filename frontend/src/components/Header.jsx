import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

function Header() {
  return (
    <header className="header">
      <h1>Election Headlines</h1>
      <nav>
        <Link to="/">Home</Link>
        <Link to="/states">Swing States</Link>
      </nav>
    </header>
  );
}

export default Header;
