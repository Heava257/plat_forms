import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { Package, Trash2, Edit3, Plus, X, Landmark } from 'lucide-react';
import Swal from 'sweetalert2';
import '../Management.css';

const SystemManagement = () => {
    const [systems, setSystems] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [showPlanModal, setShowPlanModal] = useState(false);
    const [selectedSystem, setSelectedSystem] = useState(null);
    const [plans, setPlans] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [newSystem, setNewSystem] = useState({ name: '', code: '', api_url: '', demo_url: '', image_url: '', status: 'active' });
    const [newPlan, setNewPlan] = useState({ name: '', description: '', price: '', duration_months: 12 });

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
            if (isEditing) {
                await api.put(`/systems/${newSystem.id}`, newSystem);
            } else {
                await api.post('/systems', newSystem);
            }
            setShowModal(false);
            setIsEditing(false);
            setNewSystem({ name: '', code: '', api_url: '', demo_url: '', image_url: '', status: 'active' });
            fetchSystems();
            Swal.fire({
                title: 'Success!',
                text: isEditing ? 'System updated successfully' : 'New system registered',
                icon: 'success',
                confirmButtonColor: '#3b7ddd'
            });
        } catch (err) {
            Swal.fire({
                title: 'Error',
                text: 'Operation failed',
                icon: 'error'
            });
        }
    };

    const handleEdit = (system) => {
        setNewSystem(system);
        setIsEditing(true);
        setShowModal(true);
    };

    const openPlanManager = async (system) => {
        setSelectedSystem(system);
        setShowPlanModal(true);
        fetchPlans(system.id);
    };

    const fetchPlans = async (systemId) => {
        try {
            const res = await api.get(`/plans/${systemId}`);
            setPlans(res.data);
        } catch (err) {
            console.error('Failed to fetch plans', err);
        }
    };

    const handleAddPlan = async (e) => {
        e.preventDefault();
        try {
            await api.post('/plans', { ...newPlan, system_id: selectedSystem.id });
            setNewPlan({ name: '', description: '', price: '', duration_months: 12 });
            fetchPlans(selectedSystem.id);
            Swal.fire({
                title: 'Plan Added',
                text: 'The billing plan has been added to the system',
                icon: 'success',
                confirmButtonColor: '#3b7ddd'
            });
        } catch (err) {
            Swal.fire({
                title: 'Error',
                text: 'Failed to add plan',
                icon: 'error'
            });
        }
    };

    const deleteSystem = async (id) => {
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: "This will permanently delete this system and its configuration.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            cancelButtonColor: '#64748b',
            confirmButtonText: 'Yes, delete it!'
        });

        if (result.isConfirmed) {
            try {
                await api.delete(`/systems/${id}`);
                fetchSystems();
                Swal.fire('Deleted!', 'The system has been removed.', 'success');
            } catch (err) {
                Swal.fire('Error', 'Delete failed', 'error');
            }
        }
    };

    return (
        <section className="management-section">
            <div className="section-header">
                <h3>System Portfolio</h3>
                <button onClick={() => { setIsEditing(false); setNewSystem({ name: '', code: '', api_url: '', demo_url: '', image_url: '', status: 'active' }); setShowModal(true); }} className="btn-primary-small"><Plus size={16} /> Register System</button>
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
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        <div style={{ width: '36px', height: '36px', background: '#f1f5f9', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#3b7ddd', fontWeight: 800 }}>
                                            {sys.name.charAt(0)}
                                        </div>
                                        <span style={{ fontWeight: 700 }}>{sys.name}</span>
                                    </div>
                                </td>
                                <td><code style={{ background: '#f8fafc', border: '1px solid #e2e8f0', padding: '4px 8px', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 700, color: '#475569' }}>{sys.code}</code></td>
                                <td><a href={sys.api_url} target="_blank" rel="noreferrer" style={{ color: '#3b7ddd', fontWeight: 600, fontSize: '0.9rem' }}>{sys.api_url}</a></td>
                                <td><span className={`badge ${sys.status}`}>{sys.status}</span></td>
                                <td>
                                    <div style={{ display: 'flex', gap: '8px' }}>
                                        <button onClick={() => openPlanManager(sys)} className="btn-secondary-mini" style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                                            <Package size={14} /> Plans
                                        </button>
                                        <button onClick={() => handleEdit(sys)} className="btn-secondary-mini" style={{ padding: '6px' }}><Edit3 size={14} /></button>
                                        <button onClick={() => deleteSystem(sys.id)} className="btn-secondary-mini" style={{ color: '#ef4444', border: '1px solid #fee2e2', padding: '6px' }}><Trash2 size={14} /></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* System Modal */}
            {showModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h3 style={{ marginBottom: '2rem', fontSize: '1.8rem', fontWeight: 900 }}>
                            {isEditing ? 'Update Service' : 'Register New Service'}
                        </h3>
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
                                <label>Demo URL (Public Access)</label>
                                <input
                                    className="form-control"
                                    placeholder="https://demo.system.com"
                                    value={newSystem.demo_url}
                                    onChange={e => setNewSystem({ ...newSystem, demo_url: e.target.value })}
                                />
                            </div>
                            <div className="form-group">
                                <label>System Preview Image (Background URL)</label>
                                <input
                                    className="form-control"
                                    placeholder="https://image-host.com/preview.jpg"
                                    value={newSystem.image_url}
                                    onChange={e => setNewSystem({ ...newSystem, image_url: e.target.value })}
                                />
                            </div>
                            <div style={{ display: 'flex', gap: '12px', marginTop: '3rem' }}>
                                <button type="submit" className="btn-primary">
                                    {isEditing ? 'Save Changes' : 'Register System'}
                                </button>
                                <button type="button" onClick={() => setShowModal(false)} style={{ flex: 1, padding: '1.2rem', borderRadius: '12px', border: '2px solid var(--border-light)', background: 'white', fontWeight: 800, cursor: 'pointer' }}>Cancel</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Plan Modal */}
            {showPlanModal && (
                <div className="modal-overlay">
                    <div className="modal-content" style={{ maxWidth: '800px', width: '90%' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                            <h3 style={{ fontSize: '1.6rem', fontWeight: 900 }}>Manage Plans for {selectedSystem?.name}</h3>
                            <button onClick={() => setShowPlanModal(false)} style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#64748b' }}><X size={24} /></button>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '2rem' }}>
                            {/* Form to add plan */}
                            <div style={{ background: '#f8fafc', padding: '2rem', borderRadius: '20px', border: '1px solid #e2e8f0' }}>
                                <h4 style={{ fontWeight: 800, marginBottom: '1.5rem' }}>Create New Plan</h4>
                                <form onSubmit={handleAddPlan} style={{ display: 'grid', gap: '1rem' }}>
                                    <div className="form-group">
                                        <label>Plan Name</label>
                                        <input className="form-control" placeholder="e.g. Platinum Tier" value={newPlan.name} onChange={e => setNewPlan({ ...newPlan, name: e.target.value })} required />
                                    </div>
                                    <div className="form-group">
                                        <label>Pricing ($)</label>
                                        <input className="form-control" type="number" placeholder="99.00" value={newPlan.price} onChange={e => setNewPlan({ ...newPlan, price: e.target.value })} required />
                                    </div>
                                    <div className="form-group">
                                        <label>Duration (Months)</label>
                                        <input className="form-control" type="number" value={newPlan.duration_months} onChange={e => setNewPlan({ ...newPlan, duration_months: e.target.value })} required />
                                    </div>
                                    <div className="form-group">
                                        <label>Feature Summary</label>
                                        <textarea className="form-control" style={{ minHeight: '80px' }} placeholder="What's included?" value={newPlan.description} onChange={e => setNewPlan({ ...newPlan, description: e.target.value })} required />
                                    </div>
                                    <button type="submit" className="btn-primary" style={{ marginTop: '1rem' }}>+ Add Plan to Portfolio</button>
                                </form>
                            </div>

                            {/* Existing Plans List */}
                            <div>
                                <h4 style={{ fontWeight: 800, marginBottom: '1.5rem' }}>Active Plans</h4>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '400px', overflowY: 'auto' }}>
                                    {plans.map(plan => (
                                        <div key={plan.id} style={{ padding: '1rem', background: 'white', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                                <strong style={{ fontWeight: 800, color: '#3b7ddd' }}>{plan.name}</strong>
                                                <span style={{ fontWeight: 900 }}>${plan.price}</span>
                                            </div>
                                            <p style={{ fontSize: '0.8rem', color: '#64748b', margin: 0 }}>{plan.duration_months} Months Access</p>
                                        </div>
                                    ))}
                                    {plans.length === 0 && (
                                        <div style={{ textAlign: 'center', padding: '2rem', color: '#94a3b8' }}>
                                            <Landmark size={40} style={{ opacity: 0.3, marginBottom: '1rem' }} />
                                            <p>No plans defined yet.</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
};

export default SystemManagement;
