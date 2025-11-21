import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';
import logo from '../../assets/logo.jpg';

export default function Footer() {
  return (
    <footer className="footer" role="contentinfo">
      <div className="footer__inner">

        {/* Brand + mission */}
        <div className="footer__col footer__brand">
          <img src={logo} alt="DataBowl logo" className="footer__logo" />
          <div>
            <strong className="footer__name">DataBowl</strong>
            <p className="footer__tag">Nutrition insights made simple.</p>
          </div>
          <ul className="footer__social" aria-label="Social media">
            <li>
              <a href="https://twitter.com/yourhandle" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
                <svg viewBox="0 0 24 24" className="icon"><path d="M20 7.2c.01.16.01.33.01.49 0 5.05-3.84 10.88-10.88 10.88-2.16 0-4.17-.63-5.86-1.71.3.03.6.05.91.05 1.79 0 3.44-.61 4.75-1.64a3.84 3.84 0 0 1-3.58-2.66c.24.05.49.07.75.07.36 0 .71-.05 1.04-.14a3.83 3.83 0 0 1-3.07-3.76v-.05c.52.29 1.12.46 1.76.48A3.83 3.83 0 0 1 3.8 5.5c0-.71.19-1.37.52-1.95a10.87 10.87 0 0 0 7.89 4 4.32 4.32 0 0 1-.09-.88 3.83 3.83 0 0 1 6.62-2.62 7.53 7.53 0 0 0 2.43-.93 3.85 3.85 0 0 1-1.68 2.12 7.64 7.64 0 0 0 2.2-.6A8.24 8.24 0 0 1 20 7.2z"/></svg>
              </a>
            </li>
            <li>
              <a href="https://www.linkedin.com/company/yourcompany" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                <svg viewBox="0 0 24 24" className="icon"><path d="M4.98 3.5C4.98 4.88 3.86 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5zM0 8h5v15H0zM8 8h4.8v2.1h.07c.67-1.27 2.3-2.6 4.73-2.6C21.4 7.5 24 9.9 24 14.2V23H19V15.3c0-1.84-.03-4.2-2.56-4.2-2.56 0-2.95 2-2.95 4.07V23H9V8z"/></svg>
              </a>
            </li>
            <li>
              <a href="https://github.com/yourorg" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
                <svg viewBox="0 0 24 24" className="icon"><path d="M12 .5C5.73.5.98 5.25.98 11.53c0 4.86 3.15 8.98 7.52 10.43.55.1.75-.24.75-.53 0-.26-.01-1.12-.02-2.03-3.06.67-3.7-1.3-3.7-1.3-.5-1.26-1.22-1.6-1.22-1.6-.99-.68.08-.67.08-.67 1.1.08 1.68 1.13 1.68 1.13.98 1.68 2.57 1.2 3.2.92.1-.71.38-1.2.69-1.48-2.44-.28-5.01-1.22-5.01-5.41 0-1.2.43-2.18 1.13-2.95-.11-.27-.49-1.36.11-2.83 0 0 .93-.3 3.04 1.13.89-.25 1.84-.38 2.79-.39.95.01 1.9.14 2.79.39 2.11-1.43 3.04-1.13 3.04-1.13.6 1.47.22 2.56.11 2.83.7.77 1.13 1.75 1.13 2.95 0 4.2-2.57 5.13-5.02 5.4.39.33.73.98.73 1.98 0 1.43-.01 2.59-.01 2.94 0 .29.2.64.75.53 4.37-1.45 7.52-5.57 7.52-10.43C23.02 5.25 18.27.5 12 .5z"/></svg>
              </a>
            </li>
          </ul>
        </div>

        {/* Columns */}
        <nav className="footer__col">
          <h4 className="footer__heading">Company</h4>
          <ul className="footer__list">
            <li><Link to="/about">About</Link></li>
            <li><Link to="/testimonials">Testimonials</Link></li>
            <li><Link to="/contact">Contact</Link></li>
          </ul>
        </nav>

        <nav className="footer__col">
          <h4 className="footer__heading">Resources</h4>
          <ul className="footer__list">
            <li><a href="/blog">Blog</a></li>
            <li><a href="/docs">Docs</a></li>
            <li><a href="/support">Support</a></li>
          </ul>
        </nav>
      </div>

      <div className="footer__bottom">
        <span>© {new Date().getFullYear()} DataBowl</span>
        <div className="footer__bottom-links">
          <Link to="/terms">Terms</Link>
          <Link to="/privacy">Privacy</Link>
          <Link to="/cookies">Cookies</Link>
        </div>
      </div>
    </footer>
  );
}
