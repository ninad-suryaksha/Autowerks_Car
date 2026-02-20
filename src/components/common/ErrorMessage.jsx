import React from 'react';

/**
 * Error message display with optional dismiss
 */
const ErrorMessage = ({ message, onDismiss }) => {
    if (!message) return null;

    return (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3 fade-in">
            <span className="text-error text-lg shrink-0">⚠️</span>
            <p className="text-error text-sm font-medium flex-1">{message}</p>
            {onDismiss && (
                <button
                    onClick={onDismiss}
                    className="text-error/60 hover:text-error transition-colors text-lg leading-none"
                    aria-label="Dismiss error"
                >
                    ×
                </button>
            )}
        </div>
    );
};

export default ErrorMessage;
