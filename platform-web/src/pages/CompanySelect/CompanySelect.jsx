import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { AuthContext } from '../../context/AuthContext';
import Swal from 'sweetalert2';
import './CompanySelect.css';

const CompanySelect = () => {
    const [companies, setCompanies] = useState([]);
    const [newCompany, setNewCompany] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const { user, setSelection } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        fetchCompanies();
    }, []);

    const fetchCompanies = async () => {
        try {
            const res = await api.get('/companies');
            setCompanies(res.data);
            setIsLoading(false);
        } catch (err) {
            console.error(err);
            setIsLoading(false);
        }
    };

    const handleSelect = (company) => {
        setSelection(company);

        // Animation before navigating
        const card = document.querySelector('.company-select-container');
        card.style.opacity = '0';
        card.style.transform = 'translateY(-20px)';
        card.style.transition = 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)';

        setTimeout(() => {
            navigate('/dashboard');
        }, 400);
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            await api.post('/companies', {
                name: newCompany,
                user_id: user?.id
            });
            setNewCompany('');
            fetchCompanies();
            Swal.fire({
                title: 'Workspace Initialized',
                text: 'New business unit has been registered successfully.',
                icon: 'success',
                confirmButtonColor: '#3b7ddd'
            });
        } catch (err) {
            console.error(err);
            Swal.fire('Error', 'Failed to register unit', 'error');
        }
    };

    const filteredCompanies = companies.filter(c =>
        c.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (isLoading) return <div className="loading-screen">Initializing Environment...</div>;

    return (
        <div className="fullscreen-center-bg">
            <div className="company-select-container">
                <header className="page-header-standard">
                    <div className="header-icon-premium">🏢</div>
                    <h2 className="title-standard">Workspace Selection</h2>
                    <p className="subtitle-standard">Please select or create your business unit to continue.</p>
                </header>

                <div className="workspace-list-section">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                        <span className="section-label" style={{ marginBottom: 0 }}>Your Organizations</span>
                        <div className="search-mini">
                            <input
                                type="text"
                                placeholder="Search workspace..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                style={{
                                    padding: '0.6rem 1.25rem',
                                    borderRadius: '14px',
                                    border: '1.5px solid #e2e8f0',
                                    fontSize: '0.9rem',
                                    outline: 'none',
                                    width: '180px',
                                    transition: 'all 0.3s'
                                }}
                            />
                        </div>
                    </div>

                    <div className="company-scroll-area">
                        <div className="company-grid-mini">
                            {filteredCompanies.map(company => (
                                <button key={company.id} onClick={() => handleSelect(company)} className="company-btn">
                                    <span>{company.name}</span>
                                </button>
                            ))}
                        </div>
                        {filteredCompanies.length === 0 && (
                            <div className="empty-state-card-mini">
                                <p>{searchTerm ? 'No results found.' : 'No workspaces available.'}</p>
                            </div>
                        )}
                    </div>
                </div>

                <div className="initialize-section">
                    <span className="section-label">Initialize New Unit</span>
                    <form onSubmit={handleCreate} className="input-group-standard">
                        <input
                            type="text"
                            placeholder="Unit Name (e.g. Petronas Cambodia)"
                            className="form-control"
                            value={newCompany}
                            onChange={(e) => setNewCompany(e.target.value)}
                            required
                        />
                        <button type="submit" className="btn-primary" style={{ width: 'auto', padding: '0 2.5rem' }}>
                            Register
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CompanySelect;
