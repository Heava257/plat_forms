import React from 'react';
import './Modal.css';

const Modal = ({ isOpen, onClose, type = 'success', title, message, buttonText = 'Continue' }) => {
    if (!isOpen) return null;

    const getIcon = () => {
        switch (type) {
            case 'success': return '✓';
            case 'error': return '✕';
            case 'info': return 'ℹ';
            default: return '✓';
        }
    };

    return (
        <div className="modal-overlay-premium" onClick={onClose}>
            <div className="modal-card-premium" onClick={e => e.stopPropagation()}>
                <div className={`modal-icon-container ${type}`}>
                    {getIcon()}
                </div>
                <h3>{title}</h3>
                <p>{message}</p>
                <button className="modal-btn-primary" onClick={onClose}>
                    {buttonText}
                </button>
            </div>
        </div>
    );
};

export default Modal;
