import React, { useEffect, useState, useContext } from 'react';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const CompanySelect = () => {
    const [companies, setCompanies] = useState([]);
    const [newCompany, setNewCompany] = useState('');
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            fetchCompanies();
        }
    }, [user]);

    const fetchCompanies = async () => {
        try {
            const res = await api.get(`/companies?user_id=${user.id}`);
            setCompanies(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            await api.post('/companies', { user_id: user.id, name: newCompany });
            setNewCompany('');
            fetchCompanies();
        } catch (err) {
            console.error(err);
        }
    };

    const selectCompany = (companyId) => {
        localStorage.setItem('companyId', companyId);
        navigate('/dashboard');
    };

    return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', background: 'var(--bg-main)' }}>
            <div className="company-select-container">
                <h2>Access Workspace</h2>

                <div className="company-list">
                    {companies.map(c => (
                        <button key={c.id} onClick={() => selectCompany(c.id)} className="company-btn">
                            <span style={{ marginRight: '10px' }}>🏢</span> {c.name}
                        </button>
                    ))}
                    {companies.length === 0 && (
                        <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>No companies found for your profile.</p>
                    )}
                </div>

                <h3>Register New Business</h3>
                <form onSubmit={handleCreate} className="company-form">
                    <input
                        className="form-control"
                        type="text"
                        value={newCompany}
                        onChange={(e) => setNewCompany(e.target.value)}
                        placeholder="Company Name"
                        required
                    />
                    <button type="submit" className="btn-primary">Create</button>
                </form>
            </div>
        </div>
    );
};

export default CompanySelect;
