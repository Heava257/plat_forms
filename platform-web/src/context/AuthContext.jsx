import { createContext, useState, useEffect } from 'react';
import api from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [selectedCompany, setSelectedCompany] = useState(JSON.parse(localStorage.getItem('selectedCompany')));

    useEffect(() => {
        const fetchProfile = async () => {
            if (token) {
                try {
                    const res = await api.get('/auth/me');
                    setUser(res.data);
                } catch (err) {
                    console.error('Session expired or invalid token');
                    logout();
                }
            }
        };
        fetchProfile();
    }, [token]);

    const setSelection = (company) => {
        localStorage.setItem('selectedCompany', JSON.stringify(company));
        setSelectedCompany(company);
    };

    const login = async (email, password) => {
        try {
            const res = await api.post('/auth/login', { email, password });
            localStorage.setItem('token', res.data.token);
            setToken(res.data.token);
            setUser(res.data.user);
            return res.data.user;
        } catch (err) {
            console.error(err);
            return null;
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('selectedCompany');
        setToken(null);
        setUser(null);
        setSelectedCompany(null);
    };

    return (
        <AuthContext.Provider value={{ user, token, selectedCompany, setSelection, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
