import React from 'react';
import './Footer.scss';

const Footer = () => (
  <footer className="home-footer">
    <div className="footer-content">
      <div className="footer-brand">
        <span className="footer-logo">CallDr</span>
        <span className="footer-copyright">
          &copy; {new Date().getFullYear()} CallDr. All rights reserved.
        </span>
      </div>
      <div className="footer-social">
        <a
          href="https://facebook.com/"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Facebook"
        >
          <i className="fab fa-facebook-f"></i>
        </a>
        <a
          href="https://youtube.com/"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Youtube"
        >
          <i className="fab fa-youtube"></i>
        </a>
      </div>
    </div>
  </footer>
);

export default Footer;