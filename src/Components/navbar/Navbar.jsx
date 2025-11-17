import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import './Navbar.css';
import logo from '../../assets/logo.jpg';

const Navbar = () => {
  const [open, setOpen] = useState(false);

  const close = () => setOpen(false);

  return (
    <nav className="nav">
      <div className="container nav__inner">
        <Link to="/" className="nav__brand" onClick={close}>
          <img src={logo} alt="Brand logo" className="logo" />
        </Link>

        <button
          className="nav__toggle"
          aria-label="Toggle menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <span className="nav__burger" />
        </button>

        <ul className={`nav__links ${open ? 'is-open' : ''}`}>
          <li><NavLink to="/" onClick={close}>Home</NavLink></li>
          <li><NavLink to="/estimate" onClick={close}>Estimator</NavLink></li>
         
          <li><NavLink to="/recipes" onClick={close}>Recipes</NavLink></li>
          <li><NavLink to="/about" onClick={close}>About</NavLink></li>
          <li><NavLink to="/testimonials" onClick={close}>Testimonial</NavLink></li>
          <li><NavLink to="/contact" onClick={close}>Contact</NavLink></li>
          <li><NavLink to="/signup" className="btn-link" onClick={close}>Sign Up</NavLink></li>
          

        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
