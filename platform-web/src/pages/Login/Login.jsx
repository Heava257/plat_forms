import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import Modal from '../../components/Modal/Modal';
import './Login.css';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [modal, setModal] = useState({ show: false, title: '', message: '', type: 'success' });
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const user = await login(email, password);
        if (user) {
            setModal({
                show: true,
                title: 'Access Granted',
                message: `Welcome back, ${user.name}. Authenticating session...`,
                type: 'success'
            });
            setTimeout(() => {
                if (user.role === 'admin') {
                    navigate('/admin');
                } else {
                    navigate('/companies');
                }
            }, 1500);
        } else {
            setModal({
                show: true,
                title: 'Authentication Failed',
                message: 'The credentials provided do not match our secure records.',
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
                    <h2>Secure Login</h2>
                    <p>Access your institutional-grade ERP ecosystem.</p>
                </div>

                <form onSubmit={handleSubmit} className="premium-form">
                    <div className="form-group-premium">
                        <label>Institutional Email</label>
                        <input
                            type="email"
                            placeholder="name@organization.com"
                            className="input-premium"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group-premium">
                        <label>Security Password</label>
                        <input
                            type="password"
                            placeholder="••••••••"
                            className="input-premium"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="login-btn-premium">Authenticate Account →</button>
                </form>

                <div className="login-footer-section">
                    <p>Don't have an authorized workspace? <Link to="/register">Register Now</Link></p>
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

export default Login;
