import React from 'react';

interface PremiumModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const PremiumModal: React.FC<PremiumModalProps> = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 animate-fade-in-fast"
            onClick={onClose}
            role="dialog"
            aria-modal="true"
            aria-labelledby="premium-modal-title"
        >
            <div
                className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-8 text-center relative animate-modal-pop"
                onClick={(e) => e.stopPropagation()}
            >
                 <div className="w-16 h-16 rounded-full mx-auto bg-yellow-100 flex items-center justify-center mb-4 ring-4 ring-yellow-200">
                    <i className="fas fa-star text-3xl text-yellow-500"></i>
                </div>
                <h2 id="premium-modal-title" className="text-2xl font-bold text-[#37474f] mb-2">
                    Premium Feature
                </h2>
                <p className="text-[#78909c] mb-6">
                    This feature is exclusively available for our Premium members.
                </p>
                <button
                    onClick={onClose}
                    className="w-full bg-[#00838f] hover:bg-teal-800 text-white font-bold py-3 px-4 rounded-lg focus:outline-none focus:shadow-outline transition-colors"
                >
                    Got it
                </button>
            </div>
        </div>
    );
};

export default PremiumModal;
