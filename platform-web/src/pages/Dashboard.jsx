import React, { useEffect, useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';

const Dashboard = () => {
    const [systems, setSystems] = useState([]);
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            fetchData();
        }
    }, [user]);

    const fetchData = async () => {
        try {
            const systemsRes = await api.get('/systems');
            const allSystems = systemsRes.data;

            const subsRes = await api.get(`/subscriptions/user/${user.id}`);
            const activeSubs = subsRes.data;

            const enhancedSystems = allSystems.map((sys) => {
                const subscription = activeSubs.find(s => s.system_id === sys.id);
                return {
                    ...sys,
                    status_label: subscription ? 'Active' : 'Not Subscribed',
                    status_type: subscription ? 'active' : 'inactive'
                };
            });

            setSystems(enhancedSystems);
        } catch (err) {
            console.error('Error fetching dashboard data:', err);
        }
    };

    const handleAction = (system) => {
        if (system.status_type === 'active') {
            if (system.api_url) {
                window.open(system.api_url, '_blank');
            } else {
                alert(`Accessing ${system.name}. Redirecting to service...`);
            }
        } else {
            navigate(`/system/${system.id}/plans`);
        }
    };

    return (
        <div className="user-dashboard">
            <nav className="dashboard-nav">
                <div className="logo" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>SaaS Hub</div>
                <div className="nav-right">
                    {user?.role === 'admin' && (
                        <Link to="/admin" style={{ color: 'white', textDecoration: 'none', fontWeight: 700, fontSize: '0.9rem', opacity: 0.8 }}>
                            Admin Portal
                        </Link>
                    )}
                    <div className="header-profile">
                        <div className="profile-info">
                            <span className="profile-name">{user?.name}</span>
                            <span className="profile-role">{user?.role}</span>
                        </div>
                        <div className="profile-avatar">
                            {user?.name?.charAt(0)}
                        </div>
                    </div>
                    <button onClick={logout} className="btn-logout-small">Logout</button>
                </div>
            </nav>

            <main className="dashboard-content">
                <header className="content-header">
                    <h2>Your Digital Hub</h2>
                    <p>Access your professional workspaces, manage subscriptions, and launch high-performance business systems instantly.</p>
                </header>

                <div className="systems-grid">
                    {systems.map((system) => (
                        <div key={system.id} className={`system-card-premium ${system.status_type}`}>
                            <div className="card-badge">{system.status_label}</div>
                            <div className="system-icon">
                                {system.code?.substring(0, 2).toUpperCase() || 'SY'}
                            </div>
                            <h3>{system.name}</h3>
                            <p>Strategic management portal for {system.name}. Fully optimized for scale and performance.</p>
                            <button
                                onClick={() => handleAction(system)}
                                className={`btn-system-action ${system.status_type}`}
                            >
                                {system.status_type === 'active' ? 'Launch Platform' : 'View Pricing Plans'}
                            </button>
                        </div>
                    ))}
                    {systems.length === 0 && (
                        <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '6rem', background: 'white', borderRadius: '32px', border: '1px solid var(--border-light)', boxShadow: 'var(--shadow-md)' }}>
                            <div style={{ fontSize: '4rem', marginBottom: '1.5rem' }}>🏢</div>
                            <h3 style={{ marginBottom: '1rem', fontSize: '1.8rem' }}>No Systems Registered</h3>
                            <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>Please contact system administration to authorize your profile access.</p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default Dashboard;
