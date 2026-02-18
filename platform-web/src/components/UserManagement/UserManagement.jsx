import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import Swal from 'sweetalert2';
import '../Management.css';

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [newUser, setNewUser] = useState({
        name: '',
        email: '',
        password: '',
        roleId: '2',
        status: 'active'
    });

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const res = await api.get('/users');
            setUsers(res.data);
            setLoading(false);
        } catch (err) {
            console.error('Failed to fetch users', err);
            setLoading(false);
        }
    };

    const handleAddUser = async (e) => {
        e.preventDefault();
        try {
            await api.post('/users', newUser);
            setShowModal(false);
            setNewUser({ name: '', email: '', password: '', roleId: '2', status: 'active' });
            fetchUsers();
            Swal.fire('Success', 'User has been added', 'success');
        } catch (err) {
            Swal.fire({
                title: 'Error',
                text: 'Failed to add user: ' + (err.response?.data?.error || err.message),
                icon: 'error'
            });
        }
    };

    const toggleStatus = async (id, currentStatus) => {
        const newStatus = currentStatus === 'active' ? 'suspended' : 'active';
        try {
            await api.put(`/users/${id}/status`, { status: newStatus });
            fetchUsers();
            Swal.fire('Updated', `User is now ${newStatus}`, 'success');
        } catch (err) {
            Swal.fire('Error', 'Update failed', 'error');
        }
    };

    const deleteUser = async (id) => {
        const result = await Swal.fire({
            title: 'Delete User?',
            text: "This action cannot be undone.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            cancelButtonColor: '#64748b',
            confirmButtonText: 'Yes, delete it!'
        });

        if (result.isConfirmed) {
            try {
                await api.delete(`/users/${id}`);
                fetchUsers();
                Swal.fire('Deleted!', 'User has been removed.', 'success');
            } catch (err) {
                Swal.fire('Error', 'Delete failed', 'error');
            }
        }
    };

    if (loading) return <div style={{ padding: '2rem' }}>Loading Users...</div>;

    return (
        <section className="management-section">
            <div className="section-header">
                <h3>User Management</h3>
                <button onClick={() => setShowModal(true)} className="btn-primary-small">+ Add New User</button>
            </div>

            <div className="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email Address</th>
                            <th>Role</th>
                            <th>Status</th>
                            <th>Created At</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(user => (
                            <tr key={user.id}>
                                <td>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        <div style={{ width: '36px', height: '36px', background: 'var(--grade-primary)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 800 }}>
                                            {user.name.charAt(0)}
                                        </div>
                                        <span style={{ fontWeight: 700 }}>{user.name}</span>
                                    </div>
                                </td>
                                <td>{user.email}</td>
                                <td>
                                    <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--primary)', background: 'var(--f5f3ff)', padding: '4px 8px', borderRadius: '6px' }}>
                                        {user.role || 'User'}
                                    </span>
                                </td>
                                <td>
                                    <span className={`badge ${user.status}`}>
                                        {user.status}
                                    </span>
                                </td>
                                <td>{new Date(user.created_at).toLocaleDateString()}</td>
                                <td>
                                    <div style={{ display: 'flex', gap: '8px' }}>
                                        <button
                                            onClick={() => toggleStatus(user.id, user.status)}
                                            style={{ padding: '6px 12px', borderRadius: '8px', border: '1px solid var(--border-light)', background: 'white', cursor: 'pointer', fontWeight: 700 }}
                                        >
                                            {user.status === 'active' ? 'Suspend' : 'Activate'}
                                        </button>
                                        <button
                                            onClick={() => deleteUser(user.id)}
                                            style={{ padding: '6px 12px', borderRadius: '8px', border: 'none', background: 'var(--danger)', color: 'white', cursor: 'pointer', fontWeight: 700 }}
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {showModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h3 style={{ marginBottom: '2rem', fontSize: '1.8rem', fontWeight: 900 }}>Create New User</h3>
                        <form onSubmit={handleAddUser}>
                            <div className="form-group">
                                <label>Full Name</label>
                                <input
                                    className="form-control"
                                    placeholder="Enter full name"
                                    value={newUser.name}
                                    onChange={e => setNewUser({ ...newUser, name: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Email Address</label>
                                <input
                                    className="form-control"
                                    type="email"
                                    placeholder="name@example.com"
                                    value={newUser.email}
                                    onChange={e => setNewUser({ ...newUser, email: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Password</label>
                                <input
                                    className="form-control"
                                    type="password"
                                    placeholder="Min. 6 characters"
                                    value={newUser.password}
                                    onChange={e => setNewUser({ ...newUser, password: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Assign Role</label>
                                <select
                                    className="form-control"
                                    value={newUser.roleId}
                                    onChange={e => setNewUser({ ...newUser, roleId: e.target.value })}
                                >
                                    <option value="2">Standard User</option>
                                    <option value="1">Executive Admin</option>
                                </select>
                            </div>
                            <div style={{ display: 'flex', gap: '12px', marginTop: '3rem' }}>
                                <button type="submit" className="btn-primary">Save User</button>
                                <button type="button" onClick={() => setShowModal(false)} style={{ flex: 1, padding: '1.2rem', borderRadius: '12px', border: '2px solid var(--border-light)', background: 'white', fontWeight: 800, cursor: 'pointer' }}>Cancel</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </section>
    );
};

export default UserManagement;
