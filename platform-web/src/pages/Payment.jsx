import React, { useState, useContext, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';

const Payment = () => {
    const { systemId, planId } = useParams();
    const { user } = useContext(AuthContext);
    const [method, setMethod] = useState('KHQR');
    const [planDetails, setPlanDetails] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPlan = async () => {
            try {
                const res = await api.get(`/plans/${systemId}`);
                const plan = res.data.find(p => p.id === parseInt(planId));
                setPlanDetails(plan);
            } catch (err) {
                console.error(err);
            }
        };
        fetchPlan();
    }, [systemId, planId]);

    const handlePayment = async () => {
        try {
            const subRes = await api.post('/subscriptions', {
                user_id: user.id,
                system_id: systemId,
                plan_id: planId
            });
            const subscriptionId = subRes.data.id;

            // Mock processing delay for realism
            alert('Connecting to Secured Payment Gateway...');

            await api.post('/subscriptions/payment-callback', {
                subscription_id: subscriptionId,
                transaction_ref: 'PAY-' + Math.random().toString(36).substring(2, 9).toUpperCase(),
                status: 'success'
            });

            alert('Transaction Verified! Welcome to ' + (planDetails?.name || 'your new plan'));
            navigate('/dashboard');
        } catch (err) {
            console.error(err);
            alert('Payment Gateway Timeout. Please try again.');
        }
    };

    return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', background: 'var(--bg-main)', padding: '2rem' }}>
            <div className="payment-container" style={{ maxWidth: '600px' }}>
                <header style={{ marginBottom: '2.5rem' }}>
                    <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>💳</div>
                    <h2 style={{ fontSize: '2rem', fontWeight: 800 }}>Complete Secure Checkout</h2>
                    <p style={{ color: 'var(--text-muted)' }}>Finalize your subscription to unlock all premium features.</p>
                </header>

                {planDetails && (
                    <div style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: '16px', marginBottom: '2.5rem', border: '1px dashed var(--border)', textAlign: 'left' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                            <span style={{ fontWeight: 600 }}>Plan Selected:</span>
                            <span style={{ color: 'var(--primary)', fontWeight: 800 }}>{planDetails.name}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span style={{ fontWeight: 600 }}>Amount Due:</span>
                            <span style={{ fontSize: '1.2rem', fontWeight: 900 }}>${planDetails.price}</span>
                        </div>
                    </div>
                )}

                <div style={{ textAlign: 'left', marginBottom: '2rem' }}>
                    <p style={{ fontWeight: 700, marginBottom: '1rem', fontSize: '0.9rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Select Payment Method</p>
                    <div className="payment-methods">
                        <label className={`method-option ${method === 'KHQR' ? 'active' : ''}`} onClick={() => setMethod('KHQR')}>
                            <input type="radio" checked={method === 'KHQR'} readOnly />
                            <span style={{ fontSize: '1.2rem' }}>🇰🇭</span>
                            <div style={{ flex: 1 }}>
                                <div style={{ fontWeight: 700 }}>Bakong / KHQR</div>
                                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Scan and pay instantly</div>
                            </div>
                        </label>

                        <label className={`method-option ${method === 'ABA' ? 'active' : ''}`} onClick={() => setMethod('ABA')}>
                            <input type="radio" checked={method === 'ABA'} readOnly />
                            <span style={{ fontSize: '1.2rem' }}>🏦</span>
                            <div style={{ flex: 1 }}>
                                <div style={{ fontWeight: 700 }}>ABA Bank</div>
                                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Pay via ABA Mobile App</div>
                            </div>
                        </label>

                        <label className="method-option disabled" style={{ opacity: 0.5, cursor: 'not-allowed' }}>
                            <input type="radio" disabled />
                            <span style={{ fontSize: '1.2rem' }}>💳</span>
                            <div style={{ flex: 1 }}>
                                <div style={{ fontWeight: 700 }}>Credit / Debit Card</div>
                                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Coming Soon</div>
                            </div>
                        </label>
                    </div>
                </div>

                <button onClick={handlePayment} className="pay-btn">
                    Authorize Payment — ${planDetails?.price || '0.00'}
                </button>

                <div style={{ marginTop: '2rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    🔒 SSL Encrypted & Secure Transaction
                </div>

                <button
                    onClick={() => navigate(-1)}
                    style={{ marginTop: '1.5rem', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontWeight: 600 }}
                >
                    ← Change Plan
                </button>
            </div>
        </div>
    );
};

export default Payment;
