import React from 'react';
import { Link } from 'react-router-dom';
import { FiInstagram, FiLinkedin, FiFacebook, FiYoutube, FiMail, FiPhone, FiMapPin, FiTwitter } from 'react-icons/fi';
import { useSettings } from '../context/SettingsContext';
import './Footer.css';

const BASE = process.env.REACT_APP_API_URL?.replace('/api', '') || '';

const Footer = () => {
  const { settings } = useSettings();
  const site    = settings.site    || {};
  const contact = settings.contact || {};
  const social  = settings.social  || {};
  const footer  = settings.footer  || {};

  const logoUrl = site.logo ? (site.logo.startsWith('http') ? site.logo : `${BASE}${site.logo}`) : null;

  return (
    <footer className="footer">
      <div className="footer-top">
        <div className="container">
          <div className="footer-grid">

            {/* BRAND */}
            <div className="footer-brand">
              <div className="footer-logo">
                {logoUrl
                  ? <img src={logoUrl} alt={site.logoText} className="footer-logo-img" />
                  : <>
                      <span className="logo-main">{site.logoText || 'Luxe'}</span>
                      <span className="logo-sub">{site.logoSubText || 'Interior Studio'}</span>
                    </>
                }
              </div>
              <p>{footer.about || site.description || 'Crafting spaces that tell your story.'}</p>
              <div className="footer-social">
                {social.instagram && <a href={social.instagram} target="_blank" rel="noreferrer" aria-label="Instagram"><FiInstagram /></a>}
                {social.facebook  && <a href={social.facebook}  target="_blank" rel="noreferrer" aria-label="Facebook"><FiFacebook /></a>}
                {social.linkedin  && <a href={social.linkedin}  target="_blank" rel="noreferrer" aria-label="LinkedIn"><FiLinkedin /></a>}
                {social.youtube   && <a href={social.youtube}   target="_blank" rel="noreferrer" aria-label="YouTube"><FiYoutube /></a>}
                {social.twitter   && <a href={social.twitter}   target="_blank" rel="noreferrer" aria-label="Twitter"><FiTwitter /></a>}
              </div>
            </div>

            {/* SERVICES */}
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

            {/* SHOP */}
            <div className="footer-links-col">
              <h4>Shop</h4>
              <ul>
                <li><Link to="/shop?search=Living Room">Living Room</Link></li>
                <li><Link to="/shop?search=Bedroom">Bedroom</Link></li>
                <li><Link to="/shop?search=Lighting">Lighting</Link></li>
                <li><Link to="/shop?search=Decor">Decor & Accents</Link></li>
                <li><Link to="/shop?featured=true">Featured Products</Link></li>
              </ul>
            </div>

            {/* COMPANY */}
            <div className="footer-links-col">
              <h4>Company</h4>
              <ul>
                <li><Link to="/about">About Us</Link></li>
                <li><Link to="/projects">Portfolio</Link></li>
                <li><Link to="/blog">Design Blog</Link></li>
                <li><Link to="/contact">Contact</Link></li>
              </ul>
            </div>

            {/* CONTACT */}
            <div className="footer-contact">
              <h4>Get In Touch</h4>
              {contact.address && (
                <div className="contact-item"><FiMapPin size={14} /><span>{contact.address}</span></div>
              )}
              {contact.phone && (
                <div className="contact-item"><FiPhone size={14} /><div><a href={`tel:${contact.phone}`}>{contact.phone}</a>{contact.phone2 && <><br/><a href={`tel:${contact.phone2}`}>{contact.phone2}</a></>}</div></div>
              )}
              {contact.email && (
                <div className="contact-item"><FiMail size={14} /><div><a href={`mailto:${contact.email}`}>{contact.email}</a>{contact.email2 && <><br/><a href={`mailto:${contact.email2}`}>{contact.email2}</a></>}</div></div>
              )}
              {(contact.hoursWeekday || contact.hoursWeekend) && (
                <div className="footer-hours">
                  {contact.hoursWeekday && <p>{contact.hoursWeekday}</p>}
                  {contact.hoursWeekend && <p>{contact.hoursWeekend}</p>}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="container">
          <p>{footer.copyright || `© ${new Date().getFullYear()} ${site.logoText || 'Luxe Interior Studio'}. All rights reserved.`}</p>
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
