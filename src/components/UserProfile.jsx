import React, { useState, useEffect } from 'react';
import { useAuth } from '../App';

const styles = {
  profileContainer: {
    maxWidth: '600px',
    margin: '0 auto',
    padding: '20px'
  },
  profileHeader: {
    textAlign: 'center',
    marginBottom: '32px'
  },
  profileTitle: {
    fontSize: '28px',
    fontWeight: '600',
    margin: '0 0 8px 0',
    color: '#111827'
  },
  profileSubtitle: {
    fontSize: '16px',
    color: '#6b7280',
    margin: 0
  },
  profileCard: {
    background: 'white',
    borderRadius: '16px',
    padding: '32px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
    border: '1px solid #e5e7eb'
  },
  avatarSection: {
    textAlign: 'center',
    marginBottom: '32px'
  },
  avatarContainer: {
    position: 'relative',
    display: 'inline-block',
    marginBottom: '16px'
  },
  avatar: {
    width: '120px',
    height: '120px',
    borderRadius: '50%',
    objectFit: 'cover',
    border: '4px solid #e5e7eb',
    backgroundColor: '#f3f4f6'
  },
  avatarPlaceholder: {
    width: '120px',
    height: '120px',
    borderRadius: '50%',
    backgroundColor: '#f3f4f6',
    border: '4px solid #e5e7eb',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '48px',
    color: '#9ca3af'
  },
  uploadButton: {
    position: 'absolute',
    bottom: '0',
    right: '0',
    width: '36px',
    height: '36px',
    borderRadius: '50%',
    backgroundColor: '#111827',
    color: 'white',
    border: 'none',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '16px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
  },
  fileInput: {
    display: 'none'
  },
  formSection: {
    marginBottom: '24px'
  },
  formGroup: {
    marginBottom: '20px'
  },
  label: {
    display: 'block',
    fontSize: '14px',
    fontWeight: '500',
    color: '#374151',
    marginBottom: '8px'
  },
  input: {
    width: '100%',
    padding: '12px 16px',
    border: '1px solid #d1d5db',
    borderRadius: '8px',
    fontSize: '16px',
    outline: 'none',
    transition: 'border-color 0.2s ease'
  },
  inputFocus: {
    borderColor: '#111827',
    boxShadow: '0 0 0 3px rgba(17, 24, 39, 0.1)'
  },
  textarea: {
    width: '100%',
    padding: '12px 16px',
    border: '1px solid #d1d5db',
    borderRadius: '8px',
    fontSize: '16px',
    outline: 'none',
    resize: 'vertical',
    minHeight: '100px',
    fontFamily: 'inherit'
  },
  buttonGroup: {
    display: 'flex',
    gap: '12px',
    justifyContent: 'flex-end',
    marginTop: '32px'
  },
  button: {
    padding: '12px 24px',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: '500',
    cursor: 'pointer',
    border: 'none',
    transition: 'all 0.2s ease'
  },
  primaryButton: {
    backgroundColor: '#111827',
    color: 'white'
  },
  secondaryButton: {
    backgroundColor: 'white',
    color: '#374151',
    border: '1px solid #d1d5db'
  },
  buttonHover: {
    transform: 'translateY(-1px)',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)'
  },
  successMessage: {
    backgroundColor: '#d1fae5',
    color: '#065f46',
    padding: '12px 16px',
    borderRadius: '8px',
    marginBottom: '20px',
    fontSize: '14px'
  },
  errorMessage: {
    backgroundColor: '#fee2e2',
    color: '#991b1b',
    padding: '12px 16px',
    borderRadius: '8px',
    marginBottom: '20px',
    fontSize: '14px'
  },
  loadingSpinner: {
    display: 'inline-block',
    width: '16px',
    height: '16px',
    border: '2px solid #ffffff',
    borderTop: '2px solid transparent',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
    marginRight: '8px'
  },
  userInfo: {
    display: 'grid',
    gap: '16px',
    marginBottom: '24px'
  },
  infoItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px 0',
    borderBottom: '1px solid #f3f4f6'
  },
  infoLabel: {
    fontSize: '14px',
    color: '#6b7280',
    fontWeight: '500'
  },
  infoValue: {
    fontSize: '14px',
    color: '#111827',
    fontWeight: '500'
  },
  editButton: {
    background: 'none',
    border: 'none',
    color: '#111827',
    cursor: 'pointer',
    fontSize: '14px',
    textDecoration: 'underline'
  }
};

function UserProfile() {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    city: '',
    bio: ''
  });
  
  // Profile picture state
  const [profilePicture, setProfilePicture] = useState(null);
  const [profilePictureUrl, setProfilePictureUrl] = useState('');

  // Load user data on component mount
  useEffect(() => {
    if (user) {
      loadUserProfile();
    }
  }, [user]);

  const loadUserProfile = async () => {
    try {
      // Load profile data from user metadata or database
      const userData = user.user_metadata || {};
      setFormData({
        name: userData.name || user.email?.split('@')[0] || '',
        city: userData.city || '',
        bio: userData.bio || ''
      });
      
      // Load profile picture if exists
      if (userData.profile_picture) {
        setProfilePictureUrl(userData.profile_picture);
      }
    } catch (error) {
      console.error('Error loading user profile:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setMessage({ type: 'error', text: 'Please select an image file.' });
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setMessage({ type: 'error', text: 'Image size should be less than 5MB.' });
        return;
      }

      setProfilePicture(file);
      
      // Create preview URL
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfilePictureUrl(e.target.result);
      };
      reader.readAsDataURL(file);
      
      setMessage({ type: '', text: '' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage({ type: '', text: '' });

    try {
      // Here you would typically upload the profile picture to a storage service
      // and update the user profile in your database
      
      // For now, we'll simulate the update process
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update user metadata (this is a simplified example)
      // In a real app, you'd update this in your database
      const updatedMetadata = {
        ...user.user_metadata,
        name: formData.name,
        city: formData.city,
        bio: formData.bio,
        profile_picture: profilePictureUrl,
        updated_at: new Date().toISOString()
      };

      // Simulate successful update
      console.log('Profile updated:', updatedMetadata);
      
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
      setIsEditing(false);
      
      // Clear the file input
      setProfilePicture(null);
      
    } catch (error) {
      console.error('Error updating profile:', error);
      setMessage({ type: 'error', text: 'Failed to update profile. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    loadUserProfile(); // Reset to original data
    setProfilePicture(null);
    setMessage({ type: '', text: '' });
  };

  const renderAvatar = () => {
    if (profilePictureUrl) {
      return (
        <img 
          src={profilePictureUrl} 
          alt="Profile" 
          style={styles.avatar}
          onError={(e) => {
            e.target.style.display = 'none';
            e.target.nextSibling.style.display = 'flex';
          }}
        />
      );
    }
    return (
      <div style={styles.avatarPlaceholder}>
        {formData.name ? formData.name.charAt(0).toUpperCase() : 'U'}
      </div>
    );
  };

  return (
    <div style={styles.profileContainer}>
      <div style={styles.profileHeader}>
        <h1 style={styles.profileTitle}>User Profile</h1>
        <p style={styles.profileSubtitle}>Manage your personal information and profile picture</p>
      </div>

      <div style={styles.profileCard}>
        {message.text && (
          <div style={message.type === 'success' ? styles.successMessage : styles.errorMessage}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Avatar Section */}
          <div style={styles.avatarSection}>
            <div style={styles.avatarContainer}>
              {renderAvatar()}
              {isEditing && (
                <>
                  <button
                    type="button"
                    style={styles.uploadButton}
                    onClick={() => document.getElementById('profile-picture').click()}
                  >
                    📷
                  </button>
                  <input
                    id="profile-picture"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    style={styles.fileInput}
                  />
                </>
              )}
            </div>
            {isEditing && (
              <p style={{ fontSize: '14px', color: '#6b7280', margin: 0 }}>
                Click the camera icon to upload a new profile picture
              </p>
            )}
          </div>

          {isEditing ? (
            // Edit Form
            <div style={styles.formSection}>
              <div style={styles.formGroup}>
                <label style={styles.label} htmlFor="name">
                  Full Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  style={styles.input}
                  required
                  placeholder="Enter your full name"
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label} htmlFor="city">
                  City
                </label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  style={styles.input}
                  placeholder="Enter your city"
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label} htmlFor="bio">
                  Bio
                </label>
                <textarea
                  id="bio"
                  name="bio"
                  value={formData.bio}
                  onChange={handleInputChange}
                  style={styles.textarea}
                  placeholder="Tell us about yourself..."
                  maxLength={500}
                />
                <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>
                  {formData.bio.length}/500 characters
                </div>
              </div>
            </div>
          ) : (
            // Display Mode
            <div style={styles.userInfo}>
              <div style={styles.infoItem}>
                <span style={styles.infoLabel}>Name</span>
                <span style={styles.infoValue}>{formData.name || 'Not set'}</span>
              </div>
              <div style={styles.infoItem}>
                <span style={styles.infoLabel}>Email</span>
                <span style={styles.infoValue}>{user?.email}</span>
              </div>
              <div style={styles.infoItem}>
                <span style={styles.infoLabel}>City</span>
                <span style={styles.infoValue}>{formData.city || 'Not set'}</span>
              </div>
              <div style={styles.infoItem}>
                <span style={styles.infoLabel}>Bio</span>
                <span style={styles.infoValue}>{formData.bio || 'No bio added'}</span>
              </div>
              <div style={styles.infoItem}>
                <span style={styles.infoLabel}>Role</span>
                <span style={styles.infoValue}>
                  {user?.user_metadata?.role === 'organizer' ? 'Organizer' : 'Student'}
                </span>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div style={styles.buttonGroup}>
            {isEditing ? (
              <>
                <button
                  type="button"
                  style={styles.secondaryButton}
                  onClick={handleCancel}
                  disabled={isLoading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={styles.primaryButton}
                  disabled={isLoading}
                >
                  {isLoading && <span style={styles.loadingSpinner}></span>}
                  {isLoading ? 'Saving...' : 'Save Changes'}
                </button>
              </>
            ) : (
              <button
                type="button"
                style={styles.primaryButton}
                onClick={() => setIsEditing(true)}
              >
                Edit Profile
              </button>
            )}
          </div>
        </form>
      </div>

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        input:focus, textarea:focus {
          border-color: #111827 !important;
          box-shadow: 0 0 0 3px rgba(17, 24, 39, 0.1) !important;
        }
      `}</style>
    </div>
  );
}

export default UserProfile;
