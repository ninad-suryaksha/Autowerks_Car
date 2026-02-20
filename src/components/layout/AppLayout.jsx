import React from 'react';
import Sidebar from './Sidebar';
import TopBar from './TopBar';

const AppLayout = ({ children }) => {
    return (
        <div className="min-h-screen bg-white font-sans text-gray-900">
            <Sidebar />
            <div className="pl-16">
                <TopBar />
                <main className="pt-20 px-8 pb-8 max-w-7xl mx-auto">
                    {children}
                </main>
            </div>
            {/* Contextual Action Button (Help) */}
            <button className="fixed bottom-6 right-6 w-12 h-12 bg-black text-white rounded-full flex items-center justify-center font-bold text-lg shadow-lg hover:scale-105 transition-transform">
                ?
            </button>
        </div>
    );
};

export default AppLayout;
