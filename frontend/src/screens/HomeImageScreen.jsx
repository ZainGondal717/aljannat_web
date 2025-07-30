import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import AdminHeader from '../components/AdminHeader';
import Sidebar from '../components/Sidebar';
import { addImage, getImages, deleteImage } from '../services/api';
import '../styles/HomeImageScreen.css';

export default function HomeImageScreen() {
  const navigate = useNavigate();
  const [image, setImage] = useState(null);
  const [category, setCategory] = useState('');
  const [images, setImages] = useState([]);
  const [error, setError] = useState('');
  const categories = ['Venue', 'Decor', 'Events', 'Catering', 'Ceremonies', 'Others'];

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      const response = await getImages();
      console.log('fetchImages response:', response);
      if (response.success && Array.isArray(response.data)) {
        setImages(response.data);
      } else {
        setImages([]);
        setError('Failed to load images');
      }
    } catch (err) {
      console.error('Fetch images error:', err);
      setImages([]);
      setError('Error fetching images');
    }
  };

  const pickImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      const mimeType = file.type || (file.name.endsWith('.png') ? 'image/png' : 'image/jpeg');
      const reader = new FileReader();
      reader.onload = () => {
        setImage({ uri: reader.result, file, mimeType });
        setError('');
      };
      reader.readAsDataURL(file);
    } else {
      setError('Image selection canceled');
    }
  };

  const handleAddImage = async () => {
    if (!image) {
      setError('Please select an image');
      return;
    }
    if (!category) {
      setError('Please select a category');
      return;
    }
    try {
      const formData = new FormData();
      formData.append('image', image.file);
      formData.append('category', category);

      console.log('FormData contents:', { uri: image.uri, type: image.mimeType, name: image.file.name, category });

      const response = await addImage(formData);
      if (response.success) {
        alert('Image added successfully');
        setImage(null);
        setCategory('');
        setError('');
        fetchImages();
      } else {
        setError(response.error || 'Failed to add image');
        alert(response.error || 'Failed to add image');
      }
    } catch (err) {
      console.error('Add image error:', err);
      setError('Error adding image: ' + err.message);
      alert('Error adding image: ' + err.message);
    }
  };

  const handleDeleteImage = async (id) => {
    try {
      const response = await deleteImage(id);
      if (response.success) {
        alert('Image deleted successfully');
        fetchImages();
      } else {
        setError(response.error || 'Failed to delete image');
        alert(response.error || 'Failed to delete image');
      }
    } catch (err) {
      console.error('Delete image error:', err);
      setError('Error deleting image');
      alert('Error deleting image');
    }
  };

  return (
    <motion.div
      className="home-image-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <AdminHeader />
      <div className="main-content">
        <Sidebar />
        <div className="content">
          <h2 className="title">Home Image Management</h2>
          {error && <span className="error-text">{error}</span>}
          <div className="form-container">
            <label htmlFor="image-upload" className="pick-button">
              Pick an Image
              <input
                id="image-upload"
                type="file"
                accept="image/*"
                onChange={pickImage}
                style={{ display: 'none' }}
              />
            </label>
            {image && <img src={image.uri} alt="Preview" className="image-preview" />}
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="picker"
            >
              <option value="">Select a category</option>
              {categories.map((cat, index) => (
                <option key={index} value={cat}>{cat}</option>
              ))}
            </select>
            <button onClick={handleAddImage} className="add-button">
              Add Image
            </button>
          </div>
          <div className="image-list">
            {images.length > 0 ? (
              images.map((item) => (
                <div key={item._id} className="image-item">
                  <img src={item.link} alt="Thumbnail" className="image-thumbnail" />
                  <div className="image-details">
                    <span className="image-text">Category: {item.category}</span>
                    <span className="image-text">URL: {item.link}</span>
                    <button
                      onClick={() => handleDeleteImage(item._id)}
                      className="delete-button"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <span className="no-images-text">No images available</span>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}