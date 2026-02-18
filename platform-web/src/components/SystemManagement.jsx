import React, { useEffect, useState } from 'react';
import api from '../services/api';

const SystemManagement = () => {
    const [systems, setSystems] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [newSystem, setNewSystem] = useState({ name: '', code: '', api_url: '', status: 'active' });

    useEffect(() => {
        fetchSystems();
    }, []);

    const fetchSystems = async () => {
        try {
            const res = await api.get('/systems');
            setSystems(res.data);
        } catch (err) {
            console.error('Failed to fetch systems', err);
        }
    };

    const handleAddSystem = async (e) => {
        e.preventDefault();
        try {
            await api.post('/systems', newSystem);
            setShowModal(false);
            setNewSystem({ name: '', code: '', api_url: '', status: 'active' });
            fetchSystems();
        } catch (err) {
            alert('Failed to add system');
        }
    };

    const deleteSystem = async (id) => {
        if (window.confirm('Delete this system?')) {
            try {
                await api.delete(`/systems/${id}`);
                fetchSystems();
            } catch (err) {
                alert('Delete failed');
            }
        }
    };

    return (
        <section className="management-section">
            <div className="section-header">
                <h3>System Portfolio</h3>
                <button onClick={() => setShowModal(true)} className="btn-primary-small">+ Register System</button>
            </div>

            <div className="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>Platform Name</th>
                            <th>Service Code</th>
                            <th>API Endpoint</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {systems.map(sys => (
                            <tr key={sys.id}>
                                <td>
                                    <div className="user-info-cell">
                                        <div className="user-avatar" style={{ background: '#f1f5f9', color: '#4f46e5' }}>
                                            {sys.name.charAt(0)}
                                        </div>
                                        <span style={{ fontWeight: 600 }}>{sys.name}</span>
                                    </div>
                                </td>
                                <td><code style={{ background: '#f1f5f9', padding: '2px 6px', borderRadius: '4px' }}>{sys.code}</code></td>
                                <td><a href={sys.api_url} target="_blank" rel="noreferrer" style={{ color: '#4f46e5', textDecoration: 'underline' }}>{sys.api_url}</a></td>
                                <td><span className={`badge ${sys.status}`}>{sys.status}</span></td>
                                <td>
                                    <button className="btn-action edit">Edit</button>
                                    <button onClick={() => deleteSystem(sys.id)} className="btn-action delete">Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {showModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h3>Register New Service</h3>
                        <form onSubmit={handleAddSystem}>
                            <div className="form-group">
                                <label>System Display Name</label>
                                <input
                                    className="form-control"
                                    placeholder="e.g. Fuel Management Pro"
                                    value={newSystem.name}
                                    onChange={e => setNewSystem({ ...newSystem, name: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Internal System Code</label>
                                <input
                                    className="form-control"
                                    placeholder="e.g. FUEL_GLOBAL_01"
                                    value={newSystem.code}
                                    onChange={e => setNewSystem({ ...newSystem, code: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>API Base URL</label>
                                <input
                                    className="form-control"
                                    placeholder="https://api.system.com"
                                    value={newSystem.api_url}
                                    onChange={e => setNewSystem({ ...newSystem, api_url: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Initial Status</label>
                                <select
                                    className="form-control"
                                    value={newSystem.status}
                                    onChange={e => setNewSystem({ ...newSystem, status: e.target.value })}
                                >
                                    <option value="active">Active / Public</option>
                                    <option value="inactive">Inactive / Private</option>
                                </select>
                            </div>
                            <div className="modal-btns">
                                <button type="submit" className="btn-primary-form">Register System</button>
                                <button type="button" onClick={() => setShowModal(false)} className="btn-secondary">Cancel</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </section>
    );
};

export default SystemManagement;
