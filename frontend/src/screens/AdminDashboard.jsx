import React from 'react';
import { motion } from 'framer-motion';
import AdminHeader from '../components/AdminHeader';
import Sidebar from '../components/Sidebar';
import '../styles/AdminDashboard.css';

export default function AdminDashboard() {
  return (
    <div className="admin-dashboard-container">
      <AdminHeader />
      <div className="main-content">
        <Sidebar />
        <motion.div
          className="content"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, ease: 'easeOut' }}
        >
          <h2 className="title">Admin Dashboard</h2>
          <h3 className="subtitle">Welcome, Admin!</h3>
        </motion.div>
      </div>
    </div>
  );
}