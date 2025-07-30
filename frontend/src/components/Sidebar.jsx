import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useAnimation } from 'framer-motion';
import '../styles/Sidebar.css';

export default function Sidebar() {
  const navigate = useNavigate();
  const slideAnim = useAnimation();
  const [hovered, setHovered] = useState(null);

  useEffect(() => {
    console.log('Sidebar: Navigation prop received:', navigate ? 'Yes' : 'No');
    slideAnim.start({ x: 0, transition: { duration: 0.6, ease: 'easeOut' } });
  }, [slideAnim]);

  const menuItems = [
    { name: 'Dashboard', icon: 'fa-gauge', route: '/admin-dashboard' },
    { name: 'Edit Menu', icon: 'fa-bars', route: '/edit-menu' },
    { name: 'Add Dish', icon: 'fa-utensils', route: '/add-dish' },
    { name: 'Add Category', icon: 'fa-list', route: '/add-category' },
    { name: 'Home Image', icon: 'fa-image', route: '/home-image' },
    { name: 'Posters', icon: 'fa-images', route: '/posters' },
    { name: 'Bookings', icon: 'fa-calendar', route: '/bookings' },
  ];

  const handlePress = (route, name) => {
    console.log(`Sidebar: Attempting to navigate to ${route} (${name})`);
    if (navigate && typeof navigate === 'function') {
      navigate(route);
    } else {
      console.error('Sidebar: Navigation function is missing or invalid:', navigate);
    }
  };

  return (
    <motion.div
      className="sidebar"
      animate={slideAnim}
      initial={{ x: -200 }}
      style={{ zIndex: 10 }}
    >
      {menuItems.map((item, index) => (
        <button
          key={index}
          onClick={() => {
            console.log(`Sidebar: Button clicked for ${item.name}`);
            handlePress(item.route, item.name);
          }}
          onMouseEnter={() => setHovered(index)}
          onMouseLeave={() => setHovered(null)}
          className={`sidebar-button ${hovered === index ? 'sidebar-button-hover' : ''}`}
        >
          <i className={`fas ${item.icon}`} style={{ fontSize: '24px', marginRight: '10px', color: '#4b0082' }}></i>
          <span className="sidebar-text">{item.name}</span>
        </button>
      ))}
    </motion.div>
  );
}