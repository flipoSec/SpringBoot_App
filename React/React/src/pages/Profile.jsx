import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import './Profile.css';

function Profile() {
  const { user, login } = useAuth();

  const [profile,  setProfile]  = useState(null);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState(null);
  const [success,  setSuccess]  = useState(null);
  const [editing,  setEditing]  = useState(false);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName:  '',
    email:     '',
  });

  // Load profile 
  useEffect(() => {
    api.get('/users/me')
      .then(res => {
        setProfile(res.data);
        setFormData({
          firstName: res.data.firstName,
          lastName:  res.data.lastName,
          email:     res.data.email,
        });
      })
      .catch(() => setError('Failed to load profile'))
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    setError(null);
    setSuccess(null);
    try {
      const res = await api.put('/users/me', formData);
      setProfile(res.data);
      setSuccess('Profile updated successfully');
      setEditing(false);
    } catch (err) {
      setError('Failed to update profile');
    }
  };

  if (loading) return <div className="profile-state">Loading...</div>;
  if (error && !profile) return <div className="profile-state profile-error">{error}</div>;

  return (
    <div className="profile-page">
      <div className="profile-card">

        {/*Avatar */}
        <div className="profile-avatar">
          {profile?.firstName?.charAt(0).toUpperCase()}
          {profile?.lastName?.charAt(0).toUpperCase()}
        </div>

        <h2 className="profile-name">
          {profile?.firstName} {profile?.lastName}
        </h2>
        <span className="profile-role">{profile?.role}</span>

        {/*  Messages  */}
        {error   && <div className="profile-msg error">{error}</div>}
        {success && <div className="profile-msg success">{success}</div>}

        {/*Info / Edit form  */}
        <div className="profile-info">

          {!editing ? (
            //  View mode 
            <>
              <div className="info-row">
                <span className="info-label">First name</span>
                <span className="info-value">{profile?.firstName}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Last name</span>
                <span className="info-value">{profile?.lastName}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Email</span>
                <span className="info-value">{profile?.email}</span>
              </div>
              <button
                className="btn-edit"
                onClick={() => setEditing(true)}
              >
                Edit profile
              </button>
            </>
          ) : (
            // Edit mode 
            <>
              <div className="form-group">
                <label>First name</label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label>Last name</label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
              <div className="profile-actions">
                <button className="btn-save"   onClick={handleSave}>
                  Save changes
                </button>
                <button
                  className="btn-cancel"
                  onClick={() => {
                    setEditing(false);
                    setError(null);
                  }}
                >
                  Cancel
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Profile;