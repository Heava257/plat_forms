import React, { useState } from 'react';
import api from '../services/api';
import { useNavigate, Link } from 'react-router-dom';
import Swal from 'sweetalert2';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/auth/register', { name, email, password });
            await Swal.fire({
                title: 'Initialization Successful!',
                text: 'Your account has been created. You can now access your account.',
                icon: 'success',
                confirmButtonColor: '#3b7ddd'
            });
            navigate('/login');
        } catch (err) {
            console.error(err);
            Swal.fire({
                title: 'Registration Failed',
                text: 'Could not create account. Please check your details.',
                icon: 'error',
                confirmButtonColor: '#3b7ddd'
            });
        }
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <h2>Initialize Account</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Business Name / Full Name</label>
                        <input
                            className="form-control"
                            type="text"
                            placeholder="John Doe"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Registry Email</label>
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
                        <label>Secure Password</label>
                        <input
                            className="form-control"
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="btn-primary">Initialize Now</button>

                    <div style={{ marginTop: '2rem', textAlign: 'center' }}>
                        <span style={{ color: '#64748b', fontSize: '0.9rem' }}>Already have a key? </span>
                        <Link to="/login" style={{ color: '#4f46e5', fontWeight: '700', fontSize: '0.9rem' }}>
                            Access Portal
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Register;
