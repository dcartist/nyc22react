import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';

export default function Navigation() {
  const [open, setOpen] = useState(false);

  const linkClass = ({ isActive }) =>
    'nav-link' + (isActive ? ' active' : '');

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container-fluid">
        <NavLink to="/" className="navbar-brand fw-bold">
          NYC Job Portal
        </NavLink>

        <button
          className="navbar-toggler"
          type="button"
          aria-controls="navbarNav"
          aria-expanded={open}
          aria-label="Toggle navigation"
          onClick={() => setOpen(prev => !prev)}
        >
          <span className="navbar-toggler-icon" />
        </button>

        <div className={`collapse navbar-collapse ${open ? 'show' : ''}`} id="navbarNav">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <NavLink to="/" end className={linkClass}>
                Home
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/about" className={linkClass}>
                About
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/dashboard" className={linkClass}>
                Dashboard
              </NavLink>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
