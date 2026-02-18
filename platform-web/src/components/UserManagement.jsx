import React, { useEffect, useState } from 'react';
import api from '../services/api';

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
        } catch (err) {
            alert('Failed to add user: ' + (err.response?.data?.error || err.message));
        }
    };

    const toggleStatus = async (id, currentStatus) => {
        const newStatus = currentStatus === 'active' ? 'suspended' : 'active';
        try {
            await api.put(`/users/${id}/status`, { status: newStatus });
            fetchUsers();
        } catch (err) {
            alert('Update failed');
        }
    };

    const deleteUser = async (id) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            try {
                await api.delete(`/users/${id}`);
                fetchUsers();
            } catch (err) {
                alert('Delete failed');
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
                                    <div className="user-info-cell">
                                        <div className="user-avatar">{user.name.charAt(0)}</div>
                                        <span style={{ fontWeight: 600 }}>{user.name}</span>
                                    </div>
                                </td>
                                <td>{user.email}</td>
                                <td>
                                    <span className={`badge-role ${(user.role || 'user').toLowerCase()}`}>
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
                                    <button
                                        onClick={() => toggleStatus(user.id, user.status)}
                                        className="btn-action edit"
                                    >
                                        {user.status === 'active' ? 'Suspend' : 'Activate'}
                                    </button>
                                    <button
                                        onClick={() => deleteUser(user.id)}
                                        className="btn-action delete"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {showModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h3>Create New User</h3>
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
                            <div className="modal-btns">
                                <button type="submit" className="btn-primary-form">Save User</button>
                                <button type="button" onClick={() => setShowModal(false)} className="btn-secondary">Cancel</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </section>
    );
};

export default UserManagement;
