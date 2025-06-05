import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="footer-container">
      <div className="footer-content">
        <div className="footer-branding">
          <div className="footer-logo">
            <img src="/images/leonardo_logo.png" alt="Logo de Leonardo" className="logo-image" />
          </div>
          <div className="footer-text">
            <p className="made-for">Made for Leonardo the First</p>
            <p className="gothic-name">Leonardo I</p>
          </div>
        </div>
        <div className="footer-links">
          <a href="https://www.leocaliva.com" target="_blank" rel="noopener noreferrer" className="portfolio-link">
            www.leocaliva.com
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
