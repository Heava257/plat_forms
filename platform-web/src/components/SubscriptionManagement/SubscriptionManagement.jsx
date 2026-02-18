import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import '../Management.css';

const SubscriptionManagement = () => {
    const [subscriptions, setSubscriptions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchSubscriptions();
    }, []);

    const fetchSubscriptions = async () => {
        try {
            const res = await api.get('/subscriptions');
            setSubscriptions(res.data);
            setLoading(false);
        } catch (err) {
            console.error('Failed to fetch subscriptions', err);
            setLoading(false);
            // Mock data for premium preview
            setSubscriptions([
                { id: 1, user_name: 'John Doe', system_name: 'Fuel Pro', plan_name: 'Starter', status: 'active', end_date: '2026-05-18' },
                { id: 2, user_name: 'Sok San', system_name: 'SaaS Hub', plan_name: 'Enterprise', status: 'active', end_date: '2027-02-14' }
            ]);
        }
    };

    const repairSubscriptions = async () => {
        if (window.confirm("Do you want to fix all 1970/expired dates?")) {
            try {
                await api.get('/subscriptions/repair-dates');
                alert("Repaired! Reloading...");
                fetchSubscriptions();
            } catch (err) {
                alert("Repair failed: " + err.message);
            }
        }
    };

    return (
        <section className="management-section">
            <div className="section-header">
                <h3>Subscription Repository</h3>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <button className="btn-primary-small" onClick={repairSubscriptions}>🔧 Auto Repair</button>
                    <button className="btn-primary-small">+ Monitor Contract</button>
                </div>
            </div>

            <div className="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>Customer</th>
                            <th>Platform</th>
                            <th>Tier</th>
                            <th>Billing Progress</th>
                            <th>Status</th>
                            <th>Expiry</th>
                        </tr>
                    </thead>
                    <tbody>
                        {subscriptions.map(sub => (
                            <tr key={sub.id}>
                                <td><span style={{ fontWeight: 700 }}>{sub.user_name}</span></td>
                                <td>{sub.system_name}</td>
                                <td>
                                    <span style={{ background: '#f5f3ff', color: 'var(--primary)', padding: '4px 10px', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 800 }}>
                                        {sub.plan_name}
                                    </span>
                                </td>
                                <td style={{ width: '150px' }}>
                                    <div style={{ width: '100%', height: '8px', background: '#f1f5f9', borderRadius: '4px', overflow: 'hidden' }}>
                                        <div style={{ width: '65%', height: '100%', background: 'var(--primary)' }}></div>
                                    </div>
                                </td>
                                <td><span className={`badge ${sub.status}`}>{sub.status}</span></td>
                                <td>{new Date(sub.end_date).toLocaleDateString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </section>
    );
};

export default SubscriptionManagement;
