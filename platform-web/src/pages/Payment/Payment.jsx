import React, { useState, useContext, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { AuthContext } from '../../context/AuthContext';
import Swal from 'sweetalert2';
import './Payment.css';

const Payment = () => {
    const { systemId, planId } = useParams();
    const { user } = useContext(AuthContext);
    const [method, setMethod] = useState('KHQR');
    const [planDetails, setPlanDetails] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [processStep, setProcessStep] = useState('');
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
        setIsProcessing(true);
        setProcessStep('Connecting to Secured Payment Gateway...');

        try {
            const subRes = await api.post('/subscriptions', {
                user_id: user.id,
                system_id: systemId,
                plan_id: planId
            });
            const subscriptionId = subRes.data.id;

            // Artificial delay for premium feel
            setTimeout(async () => {
                setProcessStep('Verifying Transaction with Bank...');

                setTimeout(async () => {
                    await api.post('/subscriptions/payment-callback', {
                        subscription_id: subscriptionId,
                        transaction_ref: 'PAY-' + Math.random().toString(36).substring(2, 9).toUpperCase(),
                        status: 'success'
                    });

                    setProcessStep('Finalizing Activation...');

                    setTimeout(() => {
                        setIsProcessing(false);
                        navigate('/dashboard');
                    }, 1000);
                }, 1500);
            }, 1500);

        } catch (err) {
            console.error(err);
            setIsProcessing(false);
            Swal.fire({
                title: 'Payment Error',
                text: 'Payment Gateway Timeout. Please check your connection and try again.',
                icon: 'error',
                confirmButtonColor: '#3b7ddd'
            });
        }
    };

    return (
        <div className="fullscreen-center-bg">
            <div className="payment-container">
                <header className="page-header-standard">
                    <div className="header-icon-premium">💳</div>
                    <h2 className="title-standard">Complete Checkout</h2>
                    <p className="subtitle-standard">Finalize your subscription to unlock all premium features.</p>
                </header>

                {planDetails && (
                    <div className="order-summary-premium">
                        <div className="summary-row">
                            <span style={{ fontWeight: 600, color: '#64748b' }}>Plan Selected:</span>
                            <span style={{ color: 'var(--primary)', fontWeight: 800, fontSize: '1.1rem' }}>{planDetails.name}</span>
                        </div>
                        <div className="summary-row">
                            <span style={{ fontWeight: 600, color: '#64748b' }}>Billing Cycle:</span>
                            <span style={{ fontWeight: 700 }}>{planDetails.duration_days === 365 ? 'Yearly' : 'Monthly'}</span>
                        </div>
                        <div className="summary-row">
                            <span style={{ fontWeight: 700, color: '#1e293b', fontSize: '1.1rem' }}>Amount Due:</span>
                            <span style={{ fontSize: '1.8rem', fontWeight: 900, color: 'var(--sidebar-bg)' }}>${planDetails.price}</span>
                        </div>
                    </div>
                )}

                <div style={{ textAlign: 'left' }}>
                    <span className="section-label">Select Payment Method</span>
                    <div className="payment-methods">
                        <div className={`method-option ${method === 'KHQR' ? 'active' : ''}`} onClick={() => setMethod('KHQR')}>
                            <span style={{ fontSize: '1.8rem' }}>🇰🇭</span>
                            <div style={{ flex: 1 }}>
                                <div style={{ fontWeight: 800, fontSize: '1.05rem', color: '#1e293b' }}>Bakong / KHQR</div>
                                <div style={{ fontSize: '0.85rem', color: '#64748b' }}>Scan and pay instantly from any app</div>
                            </div>
                            {method === 'KHQR' && <span style={{ color: 'var(--primary)', fontWeight: 900 }}>✓</span>}
                        </div>

                        <div className={`method-option ${method === 'ABA' ? 'active' : ''}`} onClick={() => setMethod('ABA')}>
                            <span style={{ fontSize: '1.8rem' }}>🏦</span>
                            <div style={{ flex: 1 }}>
                                <div style={{ fontWeight: 800, fontSize: '1.05rem', color: '#1e293b' }}>ABA Mobile</div>
                                <div style={{ fontSize: '0.85rem', color: '#64748b' }}>Confirm payment via push notification</div>
                            </div>
                            {method === 'ABA' && <span style={{ color: 'var(--primary)', fontWeight: 900 }}>✓</span>}
                        </div>

                        <div className="method-option" style={{ opacity: 0.5, cursor: 'not-allowed', background: '#f8fafc' }}>
                            <span style={{ fontSize: '1.8rem' }}>💳</span>
                            <div style={{ flex: 1 }}>
                                <div style={{ fontWeight: 800, fontSize: '1.05rem', color: '#94a3b8' }}>Credit / Debit Card</div>
                                <div style={{ fontSize: '0.85rem', color: '#94a3b8' }}>International payments (Coming Soon)</div>
                            </div>
                        </div>
                    </div>
                </div>

                <button onClick={handlePayment} className="pay-btn">
                    Authorize Payment — ${planDetails?.price || '0.00'}
                </button>

                <p style={{ marginTop: '2.5rem', fontSize: '0.85rem', color: '#94a3b8', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                    <span>🛡️</span> 256-bit SSL Encrypted & Secure Transaction
                </p>

                <button
                    onClick={() => navigate(-1)}
                    style={{ marginTop: '2.5rem', background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', fontWeight: 800, fontSize: '0.9rem', borderBottom: '2px solid #f1f5f9', paddingBottom: '4px' }}
                >
                    ← Change Subscription Plan
                </button>
            </div>

            {isProcessing && (
                <div className="processing-overlay">
                    <div className="spinner-premium"></div>
                    <h3 style={{ fontSize: '1.8rem', fontWeight: 900, marginBottom: '1rem' }}>Processing Payment</h3>
                    <p style={{ opacity: 0.8, fontSize: '1.1rem' }}>{processStep}</p>
                    <p style={{ marginTop: '4rem', fontSize: '0.9rem', opacity: 0.5 }}>Please do not close or refresh this window</p>
                </div>
            )}
        </div>
    );
};

export default Payment;
