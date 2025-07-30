import React, { useEffect, useRef, useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, useAnimation } from 'framer-motion';
import { AuthContext } from '../navigation/AdminNavigator';
import '../styles/AdminHeader.css';

export default function AdminHeader() {
  const navigate = useNavigate();
  const slideAnim = useAnimation();
  const pulseAnim = useAnimation();
  const menuIconScale = useAnimation();
  const userIconScale = useAnimation();
  const [isMenuDropdownVisible, setIsMenuDropdownVisible] = useState(false);
  const [isUserDropdownVisible, setIsUserDropdownVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const { setIsAuthenticated } = useContext(AuthContext);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);

    slideAnim.start({ y: 0, transition: { duration: 0.6, ease: 'easeOut' } });

    pulseAnim.start({
      scale: [1, 1.05, 1],
      transition: { repeat: Infinity, duration: 2, ease: 'easeInOut' },
    });

    return () => window.removeEventListener('resize', handleResize);
  }, [slideAnim, pulseAnim]);

  const handleMenuIconPress = async () => {
    await menuIconScale.start({ scale: 0.95, transition: { duration: 0.1 } });
    await menuIconScale.start({ scale: 1, transition: { duration: 0.1 } });
    setIsMenuDropdownVisible((prev) => !prev);
    setIsUserDropdownVisible(false);
  };

  const handleUserIconPress = async () => {
    await userIconScale.start({ scale: 0.95, transition: { duration: 0.1 } });
    await userIconScale.start({ scale: 1, transition: { duration: 0.1 } });
    setIsUserDropdownVisible((prev) => !prev);
    setIsMenuDropdownVisible(false);
  };

  const handleLogout = () => {
    console.log('AdminHeader: Logging out');
    setIsAuthenticated(false);
    navigate('/admin-login');
    setIsUserDropdownVisible(false);
  };

  return (
    <motion.div
      className="header-container"
      animate={slideAnim}
      initial={{ y: -80 }}
    >
      <div className="left-container">
        <button onClick={handleMenuIconPress} className="menu-icon">
          <motion.div animate={menuIconScale}>
            <i className="fas fa-bars" style={{ fontSize: '28px', color: '#FFFFFF' }}></i>
          </motion.div>
        </button>
        <Link to="/" className="first-logo">
          <img
            src="/assets/logo2.png"
            alt="Logo"
            className="first-logo-img"
          />
        </Link>
      </div>

      <Link to="/" className="logo-wrapper">
        <motion.div animate={pulseAnim}>
          <img
            src="/assets/aljannat.png"
            alt="Main Logo"
            className="second-logo-img"
          />
        </motion.div>
      </Link>

      <button onClick={handleUserIconPress} className="user-icon">
        <motion.div animate={userIconScale}>
          <i className="fas fa-user" style={{ fontSize: '28px', color: '#FFFFFF' }}></i>
        </motion.div>
      </button>

      {isMenuDropdownVisible && (
        <div className="menu-dropdown">
          {['Home', 'Services', 'Gallery', 'Contact', 'Pricing'].map((tab) => (
            <Link
              key={tab}
              to={`/${tab.toLowerCase()}`}
              className="nav-button"
              onClick={() => setIsMenuDropdownVisible(false)}
            >
              <span className="nav-text">{tab}</span>
            </Link>
          ))}
        </div>
      )}

      {isUserDropdownVisible && (
        <div className="user-dropdown">
          <button onClick={handleLogout} className="nav-button">
            <span className="nav-text">Logout</span>
          </button>
        </div>
      )}
    </motion.div>
  );
}