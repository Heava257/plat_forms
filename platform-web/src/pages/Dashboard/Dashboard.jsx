import React, { useEffect, useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../services/api';
import { AuthContext } from '../../context/AuthContext';
import Swal from 'sweetalert2';
import './Dashboard.css';

const Dashboard = () => {
    const [systems, setSystems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [accessing, setAccessing] = useState(null);
    const { user, logout, selectedCompany } = useContext(AuthContext);
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
            setLoading(false);
        } catch (err) {
            console.error('Error fetching dashboard data:', err);
            setLoading(false);
        }
    };

    const handleAction = async (system) => {
        if (system.status_type === 'active') {
            if (!selectedCompany) {
                Swal.fire({
                    title: 'Workspace Required',
                    text: 'Please select a company workspace before launching a system.',
                    icon: 'warning',
                    confirmButtonText: 'Select Company',
                    confirmButtonColor: '#3b7ddd'
                }).then(() => navigate('/companies'));
                return;
            }

            setAccessing(system.name);
            try {
                // Fetch handshake token
                const res = await api.post('/auth/handshake', {
                    system_id: system.id,
                    company_id: selectedCompany.id
                });

                const { handshakeToken } = res.data;
                const separator = system.api_url.includes('?') ? '&' : '?';
                const launchUrl = `${system.api_url}${separator}token=${handshakeToken}`;

                // Artificial delay for premium feel
                setTimeout(() => {
                    window.open(launchUrl, '_blank');
                    setAccessing(null);
                }, 1000);
            } catch (err) {
                console.error('Handshake failed:', err);
                setAccessing(null);
                Swal.fire('Handshake Error', 'Failed to generate access ticket.', 'error');
            }
        } else {
            navigate(`/system/${system.id}/plans`);
        }
    };

    if (loading) return <div className="loading-screen">Synchronizing Digital Ecosystem...</div>;

    return (
        <div className="user-dashboard">
            <nav className="dashboard-nav-premium">
                <div className="logo-section" onClick={() => navigate('/')}>
                    <span className="logo-icon">💠</span>
                    <span className="logo-text">SaaS Hub</span>
                    {selectedCompany && (
                        <div className="active-company-badge">
                            <span className="dot"></span>
                            {selectedCompany.name}
                        </div>
                    )}
                </div>
                <div className="nav-right-premium">
                    {user?.role === 'admin' && (
                        <Link to="/admin" className="admin-link-premium">
                            Admin Portal
                        </Link>
                    )}
                    <div className="profile-badge-premium">
                        <div className="profile-info-mini">
                            <span className="name">{user?.name}</span>
                            <span className="role">{user?.role}</span>
                        </div>
                        <div className="avatar-mini">{user?.name?.charAt(0)}</div>
                    </div>
                    <button onClick={logout} className="logout-btn-premium">Logout</button>
                </div>
            </nav>

            <main className="dashboard-content-premium">
                <header className="content-header-premium">
                    <h1>Your Professional Hub</h1>
                    <p>Access your authorized workspaces, manage active subscriptions, and launch high-performance business infrastructure.</p>
                </header>

                <div className="systems-grid-premium">
                    {systems.map((system) => (
                        <div
                            key={system.id}
                            className={`system-card-premium ${system.status_type}`}
                            style={system.image_url ? {
                                backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.4), rgba(255, 255, 255, 0.7)), url(${system.image_url})`,
                                backgroundSize: 'cover',
                                backgroundPosition: 'center'
                            } : {}}
                        >
                            <div className="card-badge-standard">{system.status_label}</div>
                            <div className="system-icon-premium" style={system.image_url ? { background: 'rgba(255,255,255,0.8)', backdropFilter: 'blur(10px)' } : {}}>
                                {system.code?.substring(0, 2).toUpperCase() || 'SY'}
                            </div>
                            <div className="card-body-premium">
                                <h3>{system.name}</h3>
                                <p>Integrated {system.name} platform. Optimized for scale, security, and real-time operations.</p>
                                <div style={{ display: 'flex', gap: '10px' }}>
                                    <button
                                        onClick={() => handleAction(system)}
                                        className={`btn-action-premium ${system.status_type}`}
                                        style={{ flex: 1 }}
                                    >
                                        {system.status_type === 'active' ? 'Launch Platform' : 'View Authorized Plans'}
                                    </button>

                                    {system.demo_url && (
                                        <button
                                            onClick={() => window.open(system.demo_url, '_blank')}
                                            className="btn-demo-outline"
                                            title="Quick Demo"
                                        >
                                            <span style={{ fontSize: '1.2rem' }}>🎬</span>
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}

                    {systems.length === 0 && (
                        <div className="empty-state-full">
                            <div className="empty-icon">🏢</div>
                            <h3>No Systems Authorized</h3>
                            <p>Your profile has no active system authorizations. Please contact your system administrator to assign workspaces.</p>
                            <button className="btn-primary" style={{ width: 'auto', marginTop: '2rem', padding: '1rem 3rem' }}>Contact Support</button>
                        </div>
                    )}
                </div>
            </main>

            {accessing && (
                <div className="processing-overlay">
                    <div className="spinner-premium"></div>
                    <h3>Accessing Secure Node</h3>
                    <p>Redirecting to {accessing} Gateway...</p>
                </div>
            )}
        </div>
    );
};

export default Dashboard;
