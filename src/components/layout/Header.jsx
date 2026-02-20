import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import useAppStore from '../../store/useAppStore';

const STEPS = [
    { path: '/upload', label: 'Upload', step: 1 },
    { path: '/customize', label: 'Customize', step: 2 },
    { path: '/results', label: 'Results', step: 3 },
];

const Header = () => {
    const location = useLocation();
    const currentStep = useAppStore((s) => s.currentStep);
    const resetAll = useAppStore((s) => s.resetAll);
    const isHome = location.pathname === '/';

    return (
        <header className="bg-white/80 backdrop-blur-lg border-b border-gray-100 sticky top-0 z-50">
            <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
                <Link
                    to="/"
                    onClick={resetAll}
                    className="text-xl font-bold tracking-tight text-text-primary hover:opacity-70 transition-opacity"
                >
                    <img src="/newicon-sm.svg" alt="Autowerks" className="h-8" />
                </Link>

                {!isHome && (
                    <nav className="flex items-center gap-1">
                        {STEPS.map((s, i) => {
                            const isActive = location.pathname === s.path;
                            const isCompleted = currentStep > s.step;
                            return (
                                <React.Fragment key={s.path}>
                                    {i > 0 && (
                                        <div
                                            className={`w-8 h-px mx-1 ${isCompleted ? 'bg-primary' : 'bg-gray-200'
                                                }`}
                                        />
                                    )}
                                    <div
                                        className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${isActive
                                            ? 'bg-primary/10 text-primary'
                                            : isCompleted
                                                ? 'text-primary'
                                                : 'text-text-secondary'
                                            }`}
                                    >
                                        <span
                                            className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${isActive
                                                ? 'bg-primary text-white'
                                                : isCompleted
                                                    ? 'bg-primary text-white'
                                                    : 'bg-gray-200 text-text-secondary'
                                                }`}
                                        >
                                            {isCompleted ? '✓' : s.step}
                                        </span>
                                        <span className="hidden sm:inline">{s.label}</span>
                                    </div>
                                </React.Fragment>
                            );
                        })}
                    </nav>
                )}
            </div>
        </header>
    );
};

export default Header;
