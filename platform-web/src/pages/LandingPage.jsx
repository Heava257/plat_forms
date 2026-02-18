import React from 'react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
    return (
        <div className="landing-page">
            <nav className="landing-nav">
                <div className="logo">SaaS Hub</div>
                <div className="nav-links">
                    <Link to="/login" className="btn-login">Login</Link>
                    <Link to="/register" className="btn-signup">Sign Up</Link>
                </div>
            </nav>

            <header className="hero-section">
                <div className="hero-content">
                    <h1>One Platform, Multiple Systems</h1>
                    <p>Manage all your business systems in one central hub. From Point of Sale to School Management, we've got you covered.</p>
                    <div className="hero-btns">
                        <Link to="/login" className="btn-primary">Get Started</Link>
                        <button className="btn-secondary">View Demo</button>
                    </div>
                </div>
                <div className="hero-image">
                    {/* Placeholder for a nice illustration or screenshot */}
                    <div className="glass-card">
                        <div className="dots">
                            <span className="dot red"></span>
                            <span className="dot yellow"></span>
                            <span className="dot green"></span>
                        </div>
                        <div className="mock-ui">
                            <div className="sidebar"></div>
                            <div className="main-content">
                                <div className="card"></div>
                                <div className="card"></div>
                                <div className="card"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            <section className="features-section">
                <h2>Why Choose SaaS Hub?</h2>
                <div className="features-grid">
                    <div className="feature-card">
                        <h3>Centralized Control</h3>
                        <p>Manage users and subscriptions across all systems from a single dashboard.</p>
                    </div>
                    <div className="feature-card">
                        <h3>Independent Systems</h3>
                        <p>Each system runs on its own infrastructure for maximum performance and reliability.</p>
                    </div>
                    <div className="feature-card">
                        <h3>Easy Payments</h3>
                        <p>Integrated payment gateway supporting KHQR, ABA, and Wing.</p>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default LandingPage;
