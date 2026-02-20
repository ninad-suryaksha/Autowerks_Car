import React from 'react';

/**
 * Animated progress bar with percentage label
 */
const ProgressBar = ({ progress = 0, label = '' }) => {
    return (
        <div className="w-full space-y-2">
            {label && (
                <div className="flex justify-between items-center">
                    <span className="text-sm text-text-secondary">{label}</span>
                    <span className="text-sm font-medium text-text-primary">
                        {Math.round(progress)}%
                    </span>
                </div>
            )}
            <div className="w-full h-2 bg-gray-50 rounded-full overflow-hidden shadow-inner">
                <div
                    className="h-full rounded-full transition-all duration-500 ease-out shadow-sm"
                    style={{
                        width: `${Math.min(progress, 100)}%`,
                        background: '#6366f1',
                        backgroundImage: 'linear-gradient(to right, #6366f1, #a855f7, #d946ef, #fca5a5)'
                    }}
                />
            </div>
        </div>
    );
};

export default ProgressBar;
