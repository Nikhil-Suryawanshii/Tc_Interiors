import React from 'react';
import { Link } from 'react-router-dom';
import { FiInstagram, FiLinkedin, FiFacebook, FiYoutube, FiMail, FiPhone, FiMapPin } from 'react-icons/fi';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-top">
        <div className="container">
          <div className="footer-grid">
            <div className="footer-brand">
              <div className="footer-logo">
                <span className="logo-main">Luxe</span>
                <span className="logo-sub">Interior Studio</span>
              </div>
              <p>Crafting spaces that tell your story. Premium interior design, bespoke furniture, and curated decor for discerning homes across India.</p>
              <div className="footer-social">
                <a href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram"><FiInstagram /></a>
                <a href="https://facebook.com" target="_blank" rel="noreferrer" aria-label="Facebook"><FiFacebook /></a>
                <a href="https://linkedin.com" target="_blank" rel="noreferrer" aria-label="LinkedIn"><FiLinkedin /></a>
                <a href="https://youtube.com" target="_blank" rel="noreferrer" aria-label="YouTube"><FiYoutube /></a>
              </div>
            </div>

            <div className="footer-links-col">
              <h4>Services</h4>
              <ul>
                <li><Link to="/services">Interior Design</Link></li>
                <li><Link to="/services">Space Planning</Link></li>
                <li><Link to="/services">3D Visualization</Link></li>
                <li><Link to="/services">Project Execution</Link></li>
                <li><Link to="/contact">Book Consultation</Link></li>
              </ul>
            </div>

            <div className="footer-links-col">
              <h4>Shop</h4>
              <ul>
                <li><Link to="/shop?category=living-room">Living Room</Link></li>
                <li><Link to="/shop?category=bedroom">Bedroom</Link></li>
                <li><Link to="/shop?category=lighting">Lighting</Link></li>
                <li><Link to="/shop?category=decor">Decor & Accents</Link></li>
                <li><Link to="/shop?featured=true">Featured Products</Link></li>
              </ul>
            </div>

            <div className="footer-links-col">
              <h4>Company</h4>
              <ul>
                <li><Link to="/about">About Us</Link></li>
                <li><Link to="/projects">Portfolio</Link></li>
                <li><Link to="/blog">Design Blog</Link></li>
                <li><Link to="/contact">Contact</Link></li>
                <li><a href="#careers">Careers</a></li>
              </ul>
            </div>

            <div className="footer-contact">
              <h4>Get In Touch</h4>
              <div className="contact-item">
                <FiMapPin size={14} />
                <span>123 Design District, Bandra West, Mumbai, Maharashtra 400050</span>
              </div>
              <div className="contact-item">
                <FiPhone size={14} />
                <a href="tel:+912212345678">+91 22 1234 5678</a>
              </div>
              <div className="contact-item">
                <FiMail size={14} />
                <a href="mailto:hello@luxeinterior.in">hello@luxeinterior.in</a>
              </div>
              <div className="footer-hours">
                <p>Mon – Sat: 10:00 AM – 7:00 PM</p>
                <p>Sunday: 11:00 AM – 5:00 PM</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="container">
          <p>© {new Date().getFullYear()} Luxe Interior Studio. All rights reserved.</p>
          <div className="footer-legal">
            <a href="#privacy">Privacy Policy</a>
            <a href="#terms">Terms of Service</a>
            <a href="#refund">Refund Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
