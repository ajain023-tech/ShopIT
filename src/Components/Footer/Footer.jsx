import React from 'react';
import { Link } from 'react-router-dom';
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaShoppingBag, FaCcVisa, FaCcMastercard, FaCcPaypal, FaGooglePay, FaMoneyBillWave } from 'react-icons/fa';
import { MdLocalShipping, MdAssignmentReturn, MdVerifiedUser } from 'react-icons/md';
import './Footer.css';

const shopLinks = [
  { label: 'All Products', to: '/products' },
  { label: 'Clothing', to: '/product/type/cloths' },
  { label: 'Shoes', to: '/product/type/shoe' },
  { label: 'Electronics', to: '/product/type/electronics' },
  { label: 'Books', to: '/product/type/book' },
  { label: 'Jewellery', to: '/product/type/jewelry' },
];

const accountLinks = [
  { label: 'My Profile', to: '/update' },
  { label: 'My Orders', to: '/orders' },
  { label: 'Cart', to: '/cart' },
  { label: 'Wishlist', to: '/wishlist' },
];

const helpLinks = [
  { label: 'About Us', to: '/about' },
  { label: 'Contact Us', to: '/contact' },
];

const Footer = () => {
  return (
    <footer className="footer">
      {/* Promises row */}
      <div className="footer__promises">
        <div className="footer__promise"><MdLocalShipping /> Free delivery above ₹999</div>
        <div className="footer__promise"><MdAssignmentReturn /> Easy 7-day returns</div>
        <div className="footer__promise"><MdVerifiedUser /> 100% original products</div>
      </div>

      <div className="footer__container">
        <div className="footer__col footer__col--brand">
          <div className="footer__logo">
            <FaShoppingBag className="footer__logo-icon" />
            <span className="footer__logo-text">ShopIt</span>
          </div>
          <p className="footer__tagline">
            Clothing, shoes, electronics, books and jewellery from brands you love, delivered to your door.
          </p>
          <ul className="footer__contact">
            <li className="footer__contact-item">
              <FaEnvelope className="footer__contact-icon" />
              <a href="mailto:support@shopit.com" className="footer__link">support@shopit.com</a>
            </li>
            <li className="footer__contact-item">
              <FaPhone className="footer__contact-icon" />
              <a href="tel:+911234567890" className="footer__link">+91 12345 67890</a>
            </li>
            <li className="footer__contact-item">
              <FaMapMarkerAlt className="footer__contact-icon" />
              <span className="footer__contact-text">Noida, Uttar Pradesh</span>
            </li>
          </ul>
        </div>

        <div className="footer__col">
          <h3 className="footer__heading">Shop</h3>
          <ul className="footer__links">
            {shopLinks.map(link => (
              <li key={link.to}><Link to={link.to} className="footer__link">{link.label}</Link></li>
            ))}
          </ul>
        </div>

        <div className="footer__col">
          <h3 className="footer__heading">My Account</h3>
          <ul className="footer__links">
            {accountLinks.map(link => (
              <li key={link.to}><Link to={link.to} className="footer__link">{link.label}</Link></li>
            ))}
          </ul>
        </div>

        <div className="footer__col">
          <h3 className="footer__heading">Help</h3>
          <ul className="footer__links">
            {helpLinks.map(link => (
              <li key={link.to}><Link to={link.to} className="footer__link">{link.label}</Link></li>
            ))}
          </ul>
        </div>
      </div>

      <div className="footer__bottom">
        <div className="footer__bottom-inner">
          <p className="footer__copyright">
            {new Date().getFullYear()} &copy; ShopIt | Developed by <span className="footer__highlight">Team ShopIt</span>
          </p>
          <div className="footer__payments" aria-label="Accepted payment methods">
            <FaCcVisa title="Visa" />
            <FaCcMastercard title="Mastercard" />
            <FaCcPaypal title="PayPal" />
            <FaGooglePay title="Google Pay" />
            <FaMoneyBillWave title="Cash on Delivery" />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
