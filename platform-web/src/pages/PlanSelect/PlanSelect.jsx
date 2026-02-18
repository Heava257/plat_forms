import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import './PlanSelect.css';

const PlanSelect = () => {
    const { systemId } = useParams();
    const [plans, setPlans] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPlans = async () => {
            try {
                const res = await api.get(`/plans/${systemId}`);
                setPlans(res.data);
                setLoading(false);
            } catch (err) {
                console.error(err);
                setLoading(false);
            }
        };
        fetchPlans();
    }, [systemId]);

    const handleSelect = (planId) => {
        navigate(`/payment/${systemId}/${planId}`);
    };

    if (loading) return <div className="loading-screen">Architecting Plans...</div>;

    return (
        <div className="fullscreen-center-bg" style={{ display: 'block', overflowY: 'auto', padding: '100px 0' }}>
            <div className="plan-select-container">
                <header className="page-header-standard">
                    <h2 className="title-standard" style={{ fontSize: '4rem' }}>Select Your Plan</h2>
                    <p className="subtitle-standard">Choose the architecture that fits your business scale. Flexible, secure, and ready to launch.</p>
                </header>

                <div className="plans-grid">
                    {plans.map((plan, index) => (
                        <div key={plan.id} className={`plan-card ${index === 1 ? 'popular' : ''}`}>
                            {index === 1 && <div className="popular-badge">Recommended</div>}
                            <h3 style={{ textAlign: 'center' }}>{plan.name}</h3>
                            <div style={{ textAlign: 'center' }}>
                                <div className="price">${Number(plan.price).toFixed(2)}</div>
                                <div className="duration">
                                    {plan.duration_months >= 12
                                        ? `${plan.duration_months / 12} year(s)`
                                        : `${plan.duration_months} month(s)`} access
                                </div>
                            </div>

                            <div className="feature-list">
                                {plan.description ? plan.description.split('\n').map((feature, i) => (
                                    <div key={i} className="feature-item">
                                        <span className="feature-check">✓</span> {feature.replace(/^- /, '')}
                                    </div>
                                )) : (
                                    <>
                                        <div className="feature-item"><span className="feature-check">✓</span> Enterprise Security</div>
                                        <div className="feature-item"><span className="feature-check">✓</span> Scalable Infrastructure</div>
                                        <div className="feature-item"><span className="feature-check">✓</span> 24/7 Support</div>
                                    </>
                                )}
                            </div>

                            <button onClick={() => handleSelect(plan.id)} className="btn-primary" style={{ marginTop: 'auto' }}>
                                Launch Infrastructure
                            </button>
                        </div>
                    ))}

                    {plans.length === 0 && (
                        <div className="plan-card" style={{ gridColumn: '1/-1', textAlign: 'center', padding: '8rem' }}>
                            <div style={{ fontSize: '5rem', marginBottom: '2rem' }}>💎</div>
                            <h3>Exclusive Tiers</h3>
                            <p style={{ color: '#64748b', fontSize: '1.2rem' }}>We are currently finalizing the high-performance pricing tiers for this system.</p>
                        </div>
                    )}
                </div>

                <div style={{ marginTop: '8rem', textAlign: 'center' }}>
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="link-standard"
                        style={{ fontSize: '1.1rem', paddingBottom: '8px' }}
                    >
                        ← Return to Workspaces
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PlanSelect;
