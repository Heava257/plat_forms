import React, { useContext, useState } from 'react';
import { AuthContext } from '../../context/AuthContext';
import api from '../../services/api';
import { User, Mail, Shield, Key, Save } from 'lucide-react';
import '../Management.css';

const ProfileManagement = () => {
    const { user, setUser } = useContext(AuthContext);
    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        currentPassword: '',
        newPassword: ''
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ text: '', type: '' });

    const handleUpdate = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ text: '', type: '' });
        try {
            const res = await api.put('/auth/profile', formData);
            setUser({ ...user, name: formData.name, email: formData.email });
            setMessage({ text: 'Profile updated successfully!', type: 'success' });
            setFormData({ ...formData, currentPassword: '', newPassword: '' });
        } catch (err) {
            setMessage({ text: err.response?.data?.error || 'Update failed', type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="management-section">
            <div className="section-header">
                <h3>Admin Profile Configuration</h3>
            </div>

            <div className="profile-grid" style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 400px) 1fr', gap: '3rem' }}>
                <div className="profile-overview-card" style={{ background: '#f8fafc', padding: '3rem', borderRadius: '32px', textAlign: 'center', border: '1px solid #e2e8f0' }}>
                    <div className="profile-avatar-large" style={{ width: '120px', height: '120px', background: 'var(--grade-primary)', borderRadius: '40px', margin: '0 auto 2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem', color: 'white', fontWeight: 900, boxShadow: '0 20px 40px -10px rgba(79, 70, 229, 0.4)' }}>
                        {user?.name?.charAt(0)}
                    </div>
                    <h4 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.5rem' }}>{user?.name}</h4>
                    <p style={{ color: '#64748b', marginBottom: '2rem', fontWeight: 600 }}>{user?.role === 'admin' ? 'Strategic Administrator' : 'Platform Member'}</p>

                    <div className="profile-stats-mini" style={{ display: 'flex', justifyContent: 'center', gap: '2rem', borderTop: '1px solid #e2e8f0', paddingTop: '2rem' }}>
                        <div>
                            <span style={{ display: 'block', fontSize: '1.2rem', fontWeight: 900 }}>24</span>
                            <small style={{ color: '#94a3b8', fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase' }}>Logins</small>
                        </div>
                        <div style={{ width: '1px', background: '#e2e8f0' }}></div>
                        <div>
                            <span style={{ display: 'block', fontSize: '1.2rem', fontWeight: 900 }}>Active</span>
                            <small style={{ color: '#94a3b8', fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase' }}>Status</small>
                        </div>
                    </div>
                </div>

                <div className="profile-form-container">
                    <form onSubmit={handleUpdate} className="premium-form-grid" style={{ display: 'grid', gap: '1.5rem' }}>
                        {message.text && (
                            <div style={{ padding: '1rem', borderRadius: '12px', background: message.type === 'success' ? '#dcfce7' : '#fee2e2', color: message.type === 'success' ? '#166534' : '#991b1b', fontWeight: 700, fontSize: '0.9rem' }}>
                                {message.text}
                            </div>
                        )}

                        <div className="form-group">
                            <label><User size={14} style={{ marginRight: '8px' }} /> Display Name</label>
                            <input
                                className="form-control"
                                value={formData.name}
                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label><Mail size={14} style={{ marginRight: '8px' }} /> Institutional Email</label>
                            <input
                                className="form-control"
                                type="email"
                                value={formData.email}
                                onChange={e => setFormData({ ...formData, email: e.target.value })}
                                required
                            />
                        </div>

                        <div className="security-divider" style={{ borderTop: '1px solid #f1f5f9', paddingTop: '1.5rem', marginTop: '1rem' }}>
                            <h5 style={{ fontWeight: 800, marginBottom: '1.5rem', color: '#0f172a' }}>Security Credentials</h5>
                        </div>

                        <div className="form-group-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <div className="form-group">
                                <label><Key size={14} style={{ marginRight: '8px' }} /> Current Password</label>
                                <input
                                    className="form-control"
                                    type="password"
                                    placeholder="Confirm existing"
                                    value={formData.currentPassword}
                                    onChange={e => setFormData({ ...formData, currentPassword: e.target.value })}
                                />
                            </div>
                            <div className="form-group">
                                <label><Shield size={14} style={{ marginRight: '8px' }} /> New Password</label>
                                <input
                                    className="form-control"
                                    type="password"
                                    placeholder="Leave blank to keep"
                                    value={formData.newPassword}
                                    onChange={e => setFormData({ ...formData, newPassword: e.target.value })}
                                />
                            </div>
                        </div>

                        <button type="submit" className="btn-primary" disabled={loading} style={{ marginTop: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                            {loading ? 'Processing...' : <><Save size={18} /> Sync Account Details</>}
                        </button>
                    </form>
                </div>
            </div>
        </section>
    );
};

export default ProfileManagement;
