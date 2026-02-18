import React, { useState, useContext } from 'react';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import Swal from 'sweetalert2';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await api.post('/auth/login', { email, password });
            login(res.data.token, res.data.user);

            if (res.data.user.role === 'admin') {
                navigate('/admin');
            } else {
                navigate('/companies');
            }
        } catch (err) {
            console.error(err);
            Swal.fire({
                title: 'Access Denied',
                text: 'Authentication failed. Please check your email and password.',
                icon: 'error',
                confirmButtonColor: '#3b7ddd'
            });
        }
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <h2>Welcome Back</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Email Address</label>
                        <input
                            className="form-control"
                            type="email"
                            placeholder="name@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>
                            Password
                            <span style={{ color: 'var(--primary)', cursor: 'pointer', fontSize: '0.8rem' }}>Forgot?</span>
                        </label>
                        <input
                            className="form-control"
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="btn-primary" style={{ marginTop: '1rem' }}>Sign In</button>

                    <div style={{ marginTop: '2.5rem', textAlign: 'center' }}>
                        <span style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>Don't have an account? </span>
                        <Link to="/register" style={{ color: 'var(--primary)', fontWeight: 800, fontSize: '0.95rem', textDecoration: 'none' }}>
                            Initialize Platform
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;
