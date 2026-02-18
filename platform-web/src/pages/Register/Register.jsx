import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../services/api';
import Modal from '../../components/Modal/Modal';
import './Register.css';

const Register = () => {
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });
    const [modal, setModal] = useState({ show: false, title: '', message: '', type: 'success' });
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/auth/register', formData);
            setModal({
                show: true,
                title: 'Registration Successful',
                message: 'Your institutional account has been provisioned. Redirecting to login...',
                type: 'success'
            });
            setTimeout(() => navigate('/login'), 2000);
        } catch (err) {
            setModal({
                show: true,
                title: 'Registration Error',
                message: err.response?.data?.error || 'Authorization protocol failed. Please try again.',
                type: 'error'
            });
        }
    };

    return (
        <div className="login-fullscreen">
            <div className="login-mesh-bg"></div>
            <div className="login-card-premium">
                <div className="login-header-section">
                    <div className="login-logo-mini">💠</div>
                    <h2>Initialize Profile</h2>
                    <p>Join the unified ERP ecosystem for professionals.</p>
                </div>

                <form onSubmit={handleSubmit} className="premium-form">
                    <div className="form-group-premium">
                        <label>Full Professional Name</label>
                        <input
                            type="text"
                            placeholder="John Doe"
                            className="input-premium"
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            required
                        />
                    </div>
                    <div className="form-group-premium">
                        <label>Institutional Email</label>
                        <input
                            type="email"
                            placeholder="name@organization.com"
                            className="input-premium"
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            required
                        />
                    </div>
                    <div className="form-group-premium">
                        <label>Secure Password</label>
                        <input
                            type="password"
                            placeholder="••••••••"
                            className="input-premium"
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            required
                        />
                    </div>
                    <button type="submit" className="login-btn-premium">Provision Account →</button>
                </form>

                <div className="login-footer-section">
                    <p>Already have an authorized profile? <Link to="/login">Sign In</Link></p>
                </div>
            </div>

            {modal.show && (
                <Modal
                    title={modal.title}
                    message={modal.message}
                    type={modal.type}
                    onClose={() => setModal({ ...modal, show: false })}
                />
            )}
        </div>
    );
};

export default Register;
