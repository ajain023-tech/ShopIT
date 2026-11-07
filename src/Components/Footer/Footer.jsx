import React from 'react';
import { Link } from 'react-router-dom';
import { FaGithub, FaLinkedin, FaTwitter, FaEnvelope, FaPhone, FaMapMarkerAlt, FaShoppingBag } from 'react-icons/fa';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer__container">

        {/* Column 1 — Brand */}
        <div className="footer__col footer__col--brand">
          <div className="footer__logo">
            <FaShoppingBag className="footer__logo-icon" />
            <span className="footer__logo-text">ShopIt</span>
          </div>
          <p className="footer__tagline">Your one-stop shopping destination</p>
          <div className="footer__socials">
            <a
              href="https://github.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="footer__social-link"
              aria-label="GitHub"
            >
              <FaGithub />
            </a>
            <a
              href="https://linkedin.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="footer__social-link"
              aria-label="LinkedIn"
            >
              <FaLinkedin />
            </a>
            <a
              href="https://twitter.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="footer__social-link"
              aria-label="Twitter"
            >
              <FaTwitter />
            </a>
          </div>
        </div>

        {/* Column 2 — Quick Links */}
        <div className="footer__col">
          <h3 className="footer__heading">Quick Links</h3>
          <ul className="footer__links">
            <li><Link to="/" className="footer__link">Home</Link></li>
            <li><Link to="/cart" className="footer__link">Cart</Link></li>
            <li><Link to="/wishlist" className="footer__link">Wishlist</Link></li>
            <li><Link to="/login" className="footer__link">Login</Link></li>
            <li><Link to="/register" className="footer__link">Register</Link></li>
          </ul>
        </div>

        {/* Column 3 — Categories */}
        <div className="footer__col">
          <h3 className="footer__heading">Categories</h3>
          <ul className="footer__links">
            <li><Link to="/product/type/clothing" className="footer__link">Clothing</Link></li>
            <li><Link to="/product/type/shoes" className="footer__link">Shoes</Link></li>
            <li><Link to="/product/type/electronics" className="footer__link">Electronics</Link></li>
            <li><Link to="/product/type/books" className="footer__link">Books</Link></li>
            <li><Link to="/product/type/jewelery" className="footer__link">Jewelry</Link></li>
          </ul>
        </div>

        {/* Column 4 — Contact Info */}
        <div className="footer__col">
          <h3 className="footer__heading">Contact Info</h3>
          <ul className="footer__contact">
            <li className="footer__contact-item">
              <FaEnvelope className="footer__contact-icon" />
              <a href="mailto:shopit@gmail.com" className="footer__link">shopit@gmail.com</a>
            </li>
            <li className="footer__contact-item">
              <FaPhone className="footer__contact-icon" />
              <a href="tel:+911234567890" className="footer__link">+91 12345 67890</a>
            </li>
            <li className="footer__contact-item">
              <FaMapMarkerAlt className="footer__contact-icon" />
              <span className="footer__contact-text">Noida, UP</span>
            </li>
          </ul>
        </div>

      </div>

      {/* Bottom Bar */}
      <div className="footer__bottom">
        <div className="footer__bottom-inner">
          <p className="footer__copyright">
            {new Date().getFullYear()} &copy; ShopIt E-Commerce | Developed by <span className="footer__highlight">Team ShopIt</span>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
