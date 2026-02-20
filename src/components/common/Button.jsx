import React from 'react';

/**
 * Reusable button with loading state and variants
 */
const Button = ({
    children,
    onClick,
    variant = 'primary',
    disabled = false,
    loading = false,
    className = '',
    type = 'button',
}) => {
    const base =
        'inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold text-base transition-all duration-200 min-h-[48px]';

    const variants = {
        primary:
            'bg-primary text-white hover:brightness-90 active:brightness-75',
        secondary:
            'bg-surface text-text-primary border border-gray-200 hover:bg-gray-200 active:bg-gray-300',
        danger: 'bg-error text-white hover:brightness-90 active:brightness-75',
    };

    const disabledClass = disabled || loading ? 'opacity-50 cursor-not-allowed' : '';

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled || loading}
            className={`${base} ${variants[variant]} ${disabledClass} ${className}`}
        >
            {loading && (
                <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full spinner" />
            )}
            {loading ? 'Processing...' : children}
        </button>
    );
};

export default Button;
