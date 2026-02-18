import React from 'react';
import '../Management.css';

const PlatformSettings = () => {
    return (
        <section className="management-section">
            <div className="section-header">
                <h3>Platform Configuration</h3>
            </div>

            <div className="settings-grid-premium" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginTop: '1rem' }}>
                <div className="settings-card" style={{ background: 'white', padding: '2.5rem', borderRadius: '32px', border: '1px solid var(--border-light)' }}>
                    <h4 style={{ marginBottom: '1.5rem', fontWeight: 900 }}>General Security</h4>
                    <div className="form-group-standard">
                        <label>Multi-Factor Authentication</label>
                        <select className="form-control">
                            <option>Enforced for Admins</option>
                            <option>Optional for All</option>
                            <option>Disabled</option>
                        </select>
                    </div>
                    <div className="form-group-standard">
                        <label>Session Timeout (Minutes)</label>
                        <input type="number" className="form-control" defaultValue="60" />
                    </div>
                    <button className="btn-primary" style={{ width: 'auto', padding: '1rem 2.5rem' }}>Save Security Defaults</button>
                </div>

                <div className="settings-card" style={{ background: 'white', padding: '2.5rem', borderRadius: '32px', border: '1px solid var(--border-light)' }}>
                    <h4 style={{ marginBottom: '1.5rem', fontWeight: 900 }}>API & Integrations</h4>
                    <div className="form-group-standard">
                        <label>Master API Gateway</label>
                        <input type="text" className="form-control" defaultValue="https://api.v1.saashub.com" readOnly />
                    </div>
                    <div className="form-group-standard">
                        <label>Webhook Notifications</label>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <input type="checkbox" defaultChecked /> <span>Enable Payment Callbacks</span>
                        </div>
                    </div>
                    <button className="btn-primary" style={{ width: 'auto', padding: '1rem 2.5rem' }}>Regenerate API Keys</button>
                </div>
            </div>
        </section>
    );
};

export default PlatformSettings;
