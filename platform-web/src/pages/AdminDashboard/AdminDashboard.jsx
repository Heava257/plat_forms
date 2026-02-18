import React, { useEffect, useState, useContext } from 'react';
import api from '../../services/api';
import { AuthContext } from '../../context/AuthContext';
import {
    LayoutDashboard,
    Users,
    Layers,
    CreditCard,
    FileText,
    Settings,
    LogOut,
    Search,
    Bell,
    MessageSquare,
    Globe,
    TrendingUp,
    TrendingDown,
    Plus,
    UserCircle
} from 'lucide-react';

import UserManagement from '../../components/UserManagement/UserManagement';
import SystemManagement from '../../components/SystemManagement/SystemManagement';
import PaymentManagement from '../../components/PaymentManagement/PaymentManagement';
import SubscriptionManagement from '../../components/SubscriptionManagement/SubscriptionManagement';
import PlatformSettings from '../../components/PlatformSettings/PlatformSettings';
import ProfileManagement from '../../components/ProfileManagement/ProfileManagement';
import './AdminDashboard.css';

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState('dashboard');
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalSystems: 0,
        activeSubscriptions: 0,
        totalRevenue: 0,
        monthlyRevenue: [],
        recentActivity: []
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
            case 'payments':
                return <PaymentManagement />;
            case 'subscriptions':
                return <SubscriptionManagement />;
            case 'settings':
                return <PlatformSettings />;
            case 'profile':
                return <ProfileManagement />;
            case 'dashboard':
            default:
                return (
                    <div className="admin-analytics">
                        <header className="analytics-header">
                            <h2>Analytics Dashboard</h2>
                            <div className="header-actions">
                                <button className="btn-secondary-mini">Invite a Friend</button>
                                <button className="btn-primary-mini"><Plus size={16} /> New Project</button>
                            </div>
                        </header>

                        <div className="metrics-grid">
                            <div className="metric-card">
                                <div className="metric-header">
                                    <span className="metric-title">Customers</span>
                                    <div className="metric-icon blue"><Users size={18} /></div>
                                </div>
                                <div className="metric-value">{stats.totalUsers}</div>
                                <div className="metric-footer">
                                    <span className="trend negative"><TrendingDown size={12} /> -3.65% Since last week</span>
                                </div>
                            </div>
                            <div className="metric-card">
                                <div className="metric-header">
                                    <span className="metric-title">Total Revenue</span>
                                    <div className="metric-icon green"><CreditCard size={18} /></div>
                                </div>
                                <div className="metric-value">${Number(stats.totalRevenue || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
                                <div className="metric-footer">
                                    <span className="trend positive"><TrendingUp size={12} /> +6.45% Since last week</span>
                                </div>
                            </div>
                            <div className="metric-card">
                                <div className="metric-header">
                                    <span className="metric-title">Service Systems</span>
                                    <div className="metric-icon purple"><Layers size={18} /></div>
                                </div>
                                <div className="metric-value">{stats.totalSystems}</div>
                                <div className="metric-footer">
                                    <span className="trend positive"><TrendingUp size={12} /> +5.25% Since last week</span>
                                </div>
                            </div>
                            <div className="metric-card">
                                <div className="metric-header">
                                    <span className="metric-title">Active Subs</span>
                                    <div className="metric-icon orange"><FileText size={18} /></div>
                                </div>
                                <div className="metric-value">{stats.activeSubscriptions}</div>
                                <div className="metric-footer">
                                    <span className="trend negative"><TrendingDown size={12} /> -2.25% Since last week</span>
                                </div>
                            </div>
                        </div>

                        <div className="dashboard-main-grid">
                            <div className="chart-section main-row">
                                <div className="card-header-flex">
                                    <h3>Revenue Report</h3>
                                    <select className="mini-select">
                                        <option>Monthly View</option>
                                        <option>Quarterly</option>
                                    </select>
                                </div>
                                <div className="revenue-chart-container">
                                    {(stats.monthlyRevenue || []).length > 0 ? (
                                        <div className="viz-bars">
                                            {stats.monthlyRevenue.map((data, i) => {
                                                const maxVal = Math.max(...stats.monthlyRevenue.map(m => m.total), 1);
                                                const height = (data.total / maxVal) * 100;
                                                return (
                                                    <div key={i} className="viz-bar-group">
                                                        <div className="viz-bar" style={{ height: `${height}%` }}>
                                                            <div className="tooltip">${data.total.toLocaleString()}</div>
                                                        </div>
                                                        <span className="bar-label">{data.month}</span>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    ) : (
                                        <div className="no-data-placeholder">
                                            <div style={{ fontSize: '3rem', marginBottom: '1rem', opacity: 0.3 }}>📊</div>
                                            <p>No revenue records found for the current period.</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="activity-section side-row">
                                <h3>Recent Movement</h3>
                                <div className="activity-feed">
                                    {(stats.recentActivity || []).length > 0 ? (
                                        stats.recentActivity.map((activity, i) => (
                                            <div key={i} className="feed-item">
                                                <div className="feed-avatar">{activity.user_name?.charAt(0)}</div>
                                                <div className="feed-info">
                                                    <strong>{activity.user_name}</strong>
                                                    <span>Activated {activity.system_name}</span>
                                                    <small>{new Date(activity.paid_at).toLocaleDateString()}</small>
                                                </div>
                                                <div className="feed-amount">${Number(activity.amount).toFixed(0)}</div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="no-activity-placeholder">
                                            <p>Monitoring system for new events...</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                );
        }
    };

    return (
        <div className="admin-layout-pro">
            <aside className="pro-sidebar">
                <div className="sidebar-brand">
                    <div className="brand-icon">AdminKit<span className="pro-badge">PRO</span></div>
                </div>

                <div className="sidebar-user" onClick={() => setActiveTab('profile')} style={{ cursor: 'pointer' }}>
                    <div className="user-avatar-pro">{user?.name?.charAt(0)}</div>
                    <div className="user-details-pro">
                        <span className="u-name">{user?.name}</span>
                        <span className="u-role">Administrator</span>
                    </div>
                </div>

                <nav className="pro-nav">
                    <div className="nav-category">Management</div>
                    <ul>
                        <li className={activeTab === 'dashboard' ? 'active' : ''} onClick={() => setActiveTab('dashboard')}>
                            <LayoutDashboard size={18} /> Dashboards
                        </li>
                        <li className={activeTab === 'profile' ? 'active' : ''} onClick={() => setActiveTab('profile')}>
                            <UserCircle size={18} /> My Profile
                        </li>
                        <li className={activeTab === 'users' ? 'active' : ''} onClick={() => setActiveTab('users')}>
                            <Users size={18} /> User Directory
                        </li>
                        <li className={activeTab === 'systems' ? 'active' : ''} onClick={() => setActiveTab('systems')}>
                            <Layers size={18} /> Platform Nodes
                        </li>
                    </ul>

                    <div className="nav-category">Fulfillment</div>
                    <ul>
                        <li className={activeTab === 'payments' ? 'active' : ''} onClick={() => setActiveTab('payments')}>
                            <CreditCard size={18} /> Settlement Logs
                        </li>
                        <li className={activeTab === 'subscriptions' ? 'active' : ''} onClick={() => setActiveTab('subscriptions')}>
                            <FileText size={18} /> Subscriptions
                        </li>
                        <li className={activeTab === 'settings' ? 'active' : ''} onClick={() => setActiveTab('settings')}>
                            <Settings size={18} /> Global Config
                        </li>
                    </ul>
                </nav>

                <div className="sidebar-footer">
                    <button className="pro-logout-btn" onClick={logout}><LogOut size={16} style={{ marginRight: '8px' }} /> Sign Out</button>
                </div>
            </aside>

            <main className="pro-main">
                <header className="pro-header">
                    <div className="header-search">
                        <Search size={18} className="search-icon-abs" />
                        <input type="text" placeholder="Search resources..." style={{ paddingLeft: '2.8rem' }} />
                    </div>
                    <div className="header-meta">
                        <div className="meta-icons">
                            <Bell size={20} />
                            <MessageSquare size={20} />
                            <Globe size={20} />
                        </div>
                        <div className="meta-profile">
                            <img src={`https://ui-avatars.com/api/?name=${user?.name}&background=4F46E5&color=fff&bold=true`} alt="avatar" />
                        </div>
                    </div>
                </header>

                <div className="pro-content">
                    {renderContent()}
                </div>
            </main>
        </div>
    );
};

export default AdminDashboard;
