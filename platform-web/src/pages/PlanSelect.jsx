import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';

const PlanSelect = () => {
    const { systemId } = useParams();
    const [plans, setPlans] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPlans = async () => {
            try {
                const res = await api.get(`/plans/${systemId}`);
                setPlans(res.data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchPlans();
    }, [systemId]);

    const handleSelect = (planId) => {
        navigate(`/payment/${systemId}/${planId}`);
    };

    return (
        <div style={{ minHeight: '100vh', background: 'var(--bg-main)', padding: '6rem 0' }}>
            <div className="plan-select-container">
                <header style={{ marginBottom: '6rem', textAlign: 'center' }}>
                    <h2 style={{ fontSize: '4rem', fontWeight: 900, letterSpacing: '-2px', marginBottom: '1rem', color: 'var(--sidebar-bg)' }}>
                        Select Your Plan
                    </h2>
                    <p style={{ color: 'var(--text-muted)', fontSize: '1.4rem', maxWidth: '600px', margin: '0 auto' }}>
                        Choose the architecture that fits your business scale. Flexible, secure, and ready to launch.
                    </p>
                </header>

                <div className="plans-grid">
                    {plans.map((plan, index) => (
                        <div key={plan.id} className={`plan-card ${index === 1 ? 'popular' : ''}`}>
                            {index === 1 && <div className="popular-badge">Recommended</div>}
                            <h3 style={{ textAlign: 'center' }}>{plan.name}</h3>
                            <div className="price">{plan.price}</div>
                            <div className="duration" style={{ textAlign: 'center' }}>per {plan.duration_days === 365 ? 'year' : 'month'}</div>

                            <div style={{ flex: 1, margin: '3rem 0' }}>
                                <div style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '12px', fontWeight: 600 }}>
                                    <span style={{ color: 'var(--success)', fontSize: '1.2rem' }}>✓</span> Enterprise Security
                                </div>
                                <div style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '12px', fontWeight: 600 }}>
                                    <span style={{ color: 'var(--success)', fontSize: '1.2rem' }}>✓</span> Cloud Hosting Integration
                                </div>
                                <div style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '12px', fontWeight: 600 }}>
                                    <span style={{ color: 'var(--success)', fontSize: '1.2rem' }}>✓</span> Real-time Data Analytics
                                </div>
                                <div style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '12px', fontWeight: 600 }}>
                                    <span style={{ color: 'var(--success)', fontSize: '1.2rem' }}>✓</span> 24/7 Priority Support
                                </div>
                            </div>

                            <button onClick={() => handleSelect(plan.id)} className="btn-primary">
                                Launch Now
                            </button>
                        </div>
                    ))}
                    {plans.length === 0 && (
                        <div className="plan-card" style={{ gridColumn: '1/-1', textAlign: 'center', padding: '5rem' }}>
                            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⏳</div>
                            <h3>Coming Soon</h3>
                            <p style={{ color: 'var(--text-muted)' }}>We are currently finalizing the pricing tiers for this system.</p>
                        </div>
                    )}
                </div>

                <div style={{ marginTop: '6rem', textAlign: 'center' }}>
                    <button
                        onClick={() => navigate('/dashboard')}
                        style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontWeight: 800, fontSize: '1rem', borderBottom: '2px solid var(--border-light)' }}
                    >
                        ← Return to Workspaces
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PlanSelect;
