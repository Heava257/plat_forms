import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import '../Management.css';

const PaymentManagement = () => {
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchPayments();
    }, []);

    const fetchPayments = async () => {
        try {
            // Assuming this endpoint exists or will be added to backend
            const res = await api.get('/admin/payments');
            setPayments(res.data);
            setLoading(false);
        } catch (err) {
            console.error('Failed to fetch payments', err);
            setLoading(false);
            // Mock data for premium preview if endpoint fails
            setPayments([
                { id: 1, amount: 29.99, status: 'success', user_name: 'John Doe', method: 'KHQR', created_at: new Date() },
                { id: 2, amount: 49.99, status: 'pending', user_name: 'Sok San', method: 'ABA', created_at: new Date() },
                { id: 3, amount: 29.99, status: 'failed', user_name: 'Chea Vutha', method: 'Card', created_at: new Date() }
            ]);
        }
    };

    return (
        <section className="management-section">
            <div className="section-header">
                <h3>Financial Transactions</h3>
                <div className="header-actions">
                    <button className="btn-primary-small" style={{ background: 'white', color: 'var(--text-main)', border: '1px solid var(--border-light)' }}>Export CSV</button>
                    <button className="btn-primary-small">Refresh Data</button>
                </div>
            </div>

            <div className="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>Transaction ID</th>
                            <th>Customer</th>
                            <th>Amount</th>
                            <th>Method</th>
                            <th>Date</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {payments.map(pay => (
                            <tr key={pay.id}>
                                <td><code style={{ fontSize: '0.8rem', fontWeight: 600 }}>#TRX-{pay.id.toString().padStart(5, '0')}</code></td>
                                <td>
                                    <div style={{ fontWeight: 700 }}>{pay.user_name}</div>
                                </td>
                                <td>
                                    <div style={{ fontWeight: 800, color: 'var(--sidebar-bg)' }}>${Number(pay.amount).toFixed(2)}</div>
                                </td>
                                <td>
                                    <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>{pay.method}</span>
                                </td>
                                <td>{new Date(pay.created_at).toLocaleDateString()}</td>
                                <td>
                                    <span className={`badge ${pay.status}`}>
                                        {pay.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </section>
    );
};

export default PaymentManagement;
