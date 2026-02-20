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
            <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                    className="h-full bg-primary rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${Math.min(progress, 100)}%` }}
                />
            </div>
        </div>
    );
};

export default ProgressBar;
