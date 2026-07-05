// ============================================================
// FILE: frontend/src/pages/Profile.jsx
// PURPOSE: Displays the logged-in user's profile.
// Allows editing name, phone, and address.
// ============================================================

import React, { useState, useEffect } from 'react';
import { getProfile, updateProfile } from '../services/authService';

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: '', phone: '', address: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const data = await getProfile();
      setProfile(data);
      // Pre-fill edit form with current values
      setForm({ name: data.name || '', phone: data.phone || '', address: data.address || '' });
    } catch (err) {
      setError('Failed to load profile.');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');
    try {
      await updateProfile(form);
      setProfile({ ...profile, ...form });
      setSuccess('Profile updated successfully!');
      setEditing(false);
    } catch (err) {
      setError('Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  // Helper: format the member since date
  const formatDate = (dateStr) =>
    new Date(dateStr).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  if (loading) return <div className="spinner-wrapper"><div className="spinner"></div></div>;

  return (
    <div className="page-wrapper">
      <div className="container" style={{ maxWidth: '600px' }}>
        <h1 className="page-title">My Profile</h1>

        {success && <div className="alert alert-success">{success}</div>}
        {error && <div className="alert alert-error">{error}</div>}

        <div className="card">

          {/* Avatar + basic info */}
          <div style={styles.avatarRow}>
            <div style={styles.avatar}>
              {profile?.name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 style={styles.userName}>{profile?.name}</h2>
              <p style={styles.userEmail}>{profile?.email}</p>
              <p style={styles.memberSince}>
                Member since {profile?.created_at ? formatDate(profile.created_at) : '—'}
              </p>
            </div>
          </div>

          <div style={styles.divider}></div>

          {/* View Mode */}
          {!editing ? (
            <>
              <div style={styles.infoGrid}>
                <ProfileField label="Full Name" value={profile?.name} />
                <ProfileField label="Email" value={profile?.email} />
                <ProfileField label="Phone" value={profile?.phone || 'Not provided'} />
                <ProfileField label="Address" value={profile?.address || 'Not provided'} />
              </div>

              <button
                className="btn btn-primary"
                style={{ marginTop: '24px' }}
                onClick={() => setEditing(true)}
              >
                ✏️ Edit Profile
              </button>
            </>
          ) : (
            /* Edit Mode */
            <form onSubmit={handleSave}>
              <div className="form-group">
                <label>Full Name</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Email (cannot change)</label>
                <input type="email" value={profile?.email} disabled style={{ opacity: 0.6 }} />
              </div>
              <div className="form-group">
                <label>Phone</label>
                <input
                  type="tel"
                  placeholder="+1 234 567 8900"
                  value={form.phone}
                  onChange={e => setForm({ ...form, phone: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Address</label>
                <textarea
                  rows={3}
                  placeholder="Your delivery address"
                  value={form.address}
                  onChange={e => setForm({ ...form, address: e.target.value })}
                  style={{ resize: 'vertical' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={() => { setEditing(false); setError(''); }}
                >
                  Cancel
                </button>
              </div>
            </form>
          )}

        </div>
      </div>
    </div>
  );
};

// Small helper component for displaying a profile field in view mode
const ProfileField = ({ label, value }) => (
  <div style={{ marginBottom: '16px' }}>
    <p style={{ fontSize: '12px', fontWeight: '600', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>
      {label}
    </p>
    <p style={{ fontSize: '15px' }}>{value}</p>
  </div>
);

const styles = {
  avatarRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
    marginBottom: '24px',
  },
  avatar: {
    width: '68px',
    height: '68px',
    background: 'var(--color-primary)',
    color: 'white',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: 'var(--font-display)',
    fontSize: '28px',
    flexShrink: '0',
  },
  userName: {
    fontFamily: 'var(--font-display)',
    fontSize: '22px',
    marginBottom: '3px',
  },
  userEmail: { fontSize: '14px', color: 'var(--color-text-muted)', marginBottom: '3px' },
  memberSince: { fontSize: '12px', color: 'var(--color-text-muted)' },
  divider: { height: '1px', background: 'var(--color-border)', marginBottom: '24px' },
  infoGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px 24px' },
};

export default Profile;
