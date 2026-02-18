import React, { useEffect, useState, useContext } from 'react';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import UserManagement from '../components/UserManagement';
import SystemManagement from '../components/SystemManagement';
import SubscriptionManagement from '../components/SubscriptionManagement/SubscriptionManagement';

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState('dashboard');
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalSystems: 0,
        activeSubscriptions: 0,
        totalRevenue: 0
    });
    const { logout, user } = useContext(AuthContext);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await api.get('/admin/stats');
                setStats(res.data);
            } catch (err) {
                console.error('Failed to fetch stats', err);
            }
        };
        if (activeTab === 'dashboard') fetchStats();
    }, [activeTab]);

    const renderContent = () => {
        switch (activeTab) {
            case 'users':
                return <UserManagement />;
            case 'systems':
                return <SystemManagement />;
            case 'subscriptions':
                return <SubscriptionManagement />;
            case 'dashboard':
            default:
                return (
                    <div className="admin-dashboard-home">
                        <div className="premium-stats-grid">
                            <div className="premium-stat-card blue">
                                <div className="stat-icon">👥</div>
                                <div className="stat-content">
                                    <span className="stat-title">Customers</span>
                                    <p className="stat-number">{stats.totalUsers}</p>
                                    <span className="stat-trend positive">↑ 12% Last 30 Days</span>
                                </div>
                            </div>
                            <div className="premium-stat-card orange">
                                <div className="stat-icon">🚀</div>
                                <div className="stat-content">
                                    <span className="stat-title">Systems</span>
                                    <p className="stat-number">{stats.totalSystems}</p>
                                    <span className="stat-trend neutral">All systems active</span>
                                </div>
                            </div>
                            <div className="premium-stat-card purple">
                                <div className="stat-icon">📝</div>
                                <div className="stat-content">
                                    <span className="stat-title">Subscriptions</span>
                                    <p className="stat-number">{stats.activeSubscriptions}</p>
                                    <span className="stat-trend positive">↑ 5% this month</span>
                                </div>
                            </div>
                            <div className="premium-stat-card green">
                                <div className="stat-icon">💰</div>
                                <div className="stat-content">
                                    <span className="stat-title">Revenue</span>
                                    <p className="stat-number">${stats.totalRevenue.toFixed(2)}</p>
                                    <span className="stat-trend positive">↑ 24% Total growth</span>
                                </div>
                            </div>
                        </div>

                        <div className="dashboard-charts-mockup">
                            <div className="chart-large">
                                <h3>Revenue Report</h3>
                                <div className="mock-chart">
                                    <div className="chart-bars">
                                        {[40, 70, 45, 90, 65, 80, 50, 85, 95, 60, 75, 90].map((h, i) => (
                                            <div key={i} className="bar-container">
                                                <div className="bar orange" style={{ height: `${h * 0.4}%` }}></div>
                                                <div className="bar blue" style={{ height: `${h * 0.6}%` }}></div>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="chart-labels">
                                        {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map(m => <span key={m}>{m}</span>)}
                                    </div>
                                </div>
                            </div>
                            <div className="list-small">
                                <h3>Recent Activity</h3>
                                <div className="recent-list">
                                    {[1, 2, 3].map(i => (
                                        <div key={i} className="recent-item">
                                            <div className="item-avatar">U</div>
                                            <div className="item-info">
                                                <p>New subscription</p>
                                                <span>2 minutes ago</span>
                                            </div>
                                            <span className="item-price">$50</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                );
        }
    };

    return (
        <div className="admin-layout-premium">
            <aside className="premium-sidebar">
                <div className="sidebar-header">
                    <div className="sidebar-logo-icon">🛍️</div>
                    <span className="sidebar-logo-text">SaaS Hub</span>
                </div>

                <nav className="premium-nav">
                    <div className="nav-group">
                        <label>Home</label>
                        <ul>
                            <li className={activeTab === 'dashboard' ? 'active' : ''} onClick={() => setActiveTab('dashboard')}>
                                <span className="nav-icon">🏠</span> Dashboard
                            </li>
                        </ul>
                    </div>

                    <div className="nav-group">
                        <label>Management</label>
                        <ul>
                            <li className={activeTab === 'users' ? 'active' : ''} onClick={() => setActiveTab('users')}>
                                <span className="nav-icon">👤</span> Users
                            </li>
                            <li className={activeTab === 'systems' ? 'active' : ''} onClick={() => setActiveTab('systems')}>
                                <span className="nav-icon">📊</span> Systems
                            </li>
                        </ul>
                    </div>

                    <div className="nav-group">
                        <label>Business</label>
                        <ul>
                            <li><span className="nav-icon">💳</span> Payments</li>
                            <li className={activeTab === 'subscriptions' ? 'active' : ''} onClick={() => setActiveTab('subscriptions')}>
                                <span className="nav-icon">📑</span> Subscriptions
                            </li>
                            <li><span className="nav-icon">⚙️</span> Settings</li>
                        </ul>
                    </div>
                </nav>

                <div className="sidebar-footer-premium">
                    <button onClick={logout} className="btn-logout-premium">
                        Logout
                    </button>
                </div>
            </aside>

            <main className="premium-content-area">
                <header className="premium-header">
                    <div className="header-search">
                        <span className="search-icon">🔍</span>
                        <input type="text" placeholder="Search anything..." />
                    </div>
                    <div className="header-profile">
                        <div className="profile-info">
                            <span className="profile-name">Admin User</span>
                            <span className="profile-role">Super Admin</span>
                        </div>
                        <div className="profile-avatar">A</div>
                    </div>
                </header>

                <div className="content-body">
                    <div className="page-title-row">
                        <h2>{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</h2>
                        <span className="breadcrumb">Dashboard / {activeTab}</span>
                    </div>
                    {renderContent()}
                </div>
            </main>
        </div>
    );
};

export default AdminDashboard;
