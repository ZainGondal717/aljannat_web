import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import AdminHeader from '../components/AdminHeader';
import Sidebar from '../components/Sidebar';
import { addPoster, getPosters, updatePoster, deletePoster } from '../services/api';
import '../styles/PostersScreen.css';

class ErrorBoundary extends React.Component {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-container">
          <span className="error-text">Something went wrong: {this.state.error?.message || 'Unknown error'}</span>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function PostersScreen() {
  const navigate = useNavigate();
  const [posterLink, setPosterLink] = useState('');
  const [posters, setPosters] = useState([]);
  const [editingPoster, setEditingPoster] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchPosters();
  }, []);

  const fetchPosters = async () => {
    try {
      const response = await getPosters();
      console.log('fetchPosters response:', response);
      if (response.success && Array.isArray(response.data)) {
        setPosters(response.data);
      } else {
        setPosters([]);
        setError(response.message || 'Failed to load posters');
      }
    } catch (err) {
      setPosters([]);
      setError('Error fetching posters');
      console.error('Fetch posters error:', err);
    }
  };

  const handleSubmit = async () => {
    if (!posterLink || !/^https?:\/\/.*\.(?:png|jpg|jpeg|gif)$/.test(posterLink)) {
      setError('Please enter a valid image URL');
      return;
    }

    try {
      let response;
      if (editingPoster) {
        response = await updatePoster(editingPoster._id, { link: posterLink });
      } else {
        response = await addPoster({ link: posterLink });
      }
      console.log('API response:', response);
      if (response.success) {
        alert(editingPoster ? 'Poster updated' : 'Poster added');
        setPosterLink('');
        setEditingPoster(null);
        setError('');
        fetchPosters();
      } else {
        setError(response.message || 'Failed to save poster');
      }
    } catch (err) {
      setError('Error saving poster');
      console.error('Submit error:', err);
    }
  };

  const handleEdit = (poster) => {
    setEditingPoster(poster);
    setPosterLink(poster.link);
  };

  const handleDelete = async (id) => {
    try {
      const response = await deletePoster(id);
      if (response.success) {
        alert('Poster deleted');
        fetchPosters();
      } else {
        setError(response.message || 'Failed to delete poster');
      }
    } catch (err) {
      setError('Error deleting poster');
      console.error('Delete error:', err);
    }
  };

  return (
    <ErrorBoundary>
      <motion.div
        className="posters-container"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <AdminHeader />
        <div className="main-content">
          <Sidebar />
          <div className="content">
            <h2 className="title">Manage Posters</h2>
            {error && <span className="error-text">{error}</span>}

            <div className="form-container">
              <input
                type="text"
                placeholder="Poster Image URL (e.g., https://example.com/poster.jpg)"
                value={posterLink}
                onChange={(e) => setPosterLink(e.target.value)}
                className="input"
              />
              <button
                onClick={handleSubmit}
                className="submit-button"
              >
                {editingPoster ? 'Update Poster' : 'Add Poster'}
              </button>
            </div>

            <div className="existing-items">
              <h3 className="subtitle">Existing Posters</h3>
              {posters.length > 0 ? (
                posters.map((poster) => (
                  <div key={poster._id} className="existing-item">
                    <img src={poster.link} alt="Poster" className="poster-image" />
                    <div className="item-details">
                      <span className="item-title">{poster.link}</span>
                    </div>
                    <div className="item-actions">
                      <button
                        onClick={() => handleEdit(poster)}
                        className="edit-button"
                      >
                        <i className="fas fa-pencil" style={{ color: '#63B3ED' }}></i>
                      </button>
                      <button
                        onClick={() => handleDelete(poster._id)}
                        className="delete-button"
                      >
                        <i className="fas fa-trash" style={{ color: '#FF4D4D' }}></i>
                      </button>
                      <button
                        onClick={() => {
                          setEditingPoster(null);
                          setPosterLink('');
                          setError('');
                        }}
                        className="add-button"
                      >
                        <i className="fas fa-plus" style={{ color: '#63B3ED' }}></i>
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <span className="no-items-text">No posters available</span>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </ErrorBoundary>
  );
}