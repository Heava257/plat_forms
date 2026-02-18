import React from 'react';
import { Link } from 'react-router-dom';
import './LandingPage.css';

const LandingPage = () => {
    return (
        <div className="landing-page">
            <nav className="landing-nav">
                <div className="nav-container">
                    <div className="logo-section">
                        <div className="logo-icon-main">💠</div>
                        <span className="logo-text-main">SaaS Hub</span>
                    </div>
                    <div className="nav-links-center">
                        <a href="#features">Product</a>
                        <a href="#pricing">Pricing</a>
                        <a href="#about">Ecosystem</a>
                    </div>
                    <div className="nav-actions">
                        <Link to="/login" className="login-link">Sign In</Link>
                        <Link to="/register" className="start-free-btn">Start Free</Link>
                    </div>
                </div>
            </nav>

            <header className="hero-modern">
                <div className="hero-grid">
                    <div className="hero-content-modern">
                        <span className="hero-badge">Next Generation Platform</span>
                        <h1 className="hero-headline">
                            The Most Modern <span className="gradient-text">ERP Ecosystem</span> for Your Business
                        </h1>
                        <p className="hero-subtext">
                            A unified platform that grows with you. Manage payments, operations, and infrastructure with institutional-grade security and modern aesthetics.
                        </p>
                        <div className="hero-cta-group">
                            <Link to="/register" className="cta-primary">Launch Project →</Link>
                            <button className="cta-secondary">View Demo</button>
                        </div>
                        <div className="hero-trust">
                            <div className="trust-icons">✅ Free Registration ✅ Great Service</div>
                        </div>
                    </div>
                    <div className="hero-visual">
                        <div className="floating-ui-container">
                            <div className="ui-card card-1">
                                <div className="ui-header">
                                    <div className="dots"><span /><span /><span /></div>
                                </div>
                                <div className="ui-body">
                                    <div className="bar-chart-mock">
                                        <div className="bar" style={{ height: '60%' }}></div>
                                        <div className="bar" style={{ height: '90%' }}></div>
                                        <div className="bar" style={{ height: '40%' }}></div>
                                        <div className="bar" style={{ height: '70%' }}></div>
                                    </div>
                                    <div className="ui-lines">
                                        <div className="line"></div>
                                        <div className="line short"></div>
                                    </div>
                                </div>
                            </div>
                            <div className="ui-card card-2">
                                <div className="revenue-stat">
                                    <span>Revenue</span>
                                    <h3>$140,948</h3>
                                    <span className="trend">+12.5%</span>
                                </div>
                            </div>
                            <div className="ui-card card-3 shadow-premium">
                                <div className="recent-activity-mini">
                                    <div className="activity-item-mini"></div>
                                    <div className="activity-item-mini"></div>
                                    <div className="activity-item-mini"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            <section className="logo-cloud">
                <div className="logo-container">
                    <p>Over 32k+ software businesses growing with SaaS Hub</p>
                    <div className="logos-wrapper">
                        <span className="brand-logo">OpenZeppelin</span>
                        <span className="brand-logo">ORACLE</span>
                        <span className="brand-logo">MORPHEUS</span>
                        <span className="brand-logo">SAMSUNG</span>
                        <span className="brand-logo">monday.com</span>
                        <span className="brand-logo">segment</span>
                    </div>
                </div>
            </section>

            <section id="features" className="features-premium">
                <div className="section-header-center">
                    <h2 className="section-title">We help your business grow faster</h2>
                    <p className="section-subtitle">Why leading enterprises choose our centralized management infrastructure.</p>
                </div>

                <div className="features-grid-premium">
                    <div className="feature-card-premium">
                        <div className="feature-icon-box blue">👥</div>
                        <h3>Centralized Hub</h3>
                        <p>Manage users, roles, and global subscriptions across all platform systems from a single secure dashboard.</p>
                        <a href="#" className="feature-link">Read More →</a>
                    </div>
                    <div className="feature-card-premium">
                        <div className="feature-icon-box purple">🌩️</div>
                        <h3>Scale Anywhere</h3>
                        <p>Isolated infrastructure for each system ensures zero interference and localized performance scaling.</p>
                        <a href="#" className="feature-link">Read More →</a>
                    </div>
                    <div className="feature-card-premium">
                        <div className="feature-icon-box green">💳</div>
                        <h3>Modern Payments</h3>
                        <p>Integrated payment gateway supporting KHQR, ABA, and Bakong for instant system activation.</p>
                        <a href="#" className="feature-link">Read More →</a>
                    </div>
                </div>
            </section>

            <section className="cta-banner-premium">
                <div className="banner-content">
                    <h2>Push your product to next level.</h2>
                    <p>End-to-end financial and historical management in a single platform.</p>
                    <Link to="/register" className="banner-btn">Get Started Now</Link>
                </div>
            </section>
        </div>
    );
};

export default LandingPage;
