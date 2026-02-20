import React from 'react';
import { Bell } from 'lucide-react';

const TopBar = () => {
    return (
        <div className="h-16 flex items-center justify-between px-8 bg-white fixed top-0 left-16 right-0 z-40">
            <h1 className="text-sm font-medium text-gray-900">ShopOS Pro</h1>

            <div className="flex items-center gap-4">
                <button className="w-8 h-8 flex items-center justify-center rounded-full text-gray-500 hover:bg-gray-100 transition-colors relative">
                    <Bell size={18} />
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-blue-500 rounded-full border-2 border-white"></span>
                </button>

                <div className="flex items-center gap-2 pl-3 pr-1 py-1 bg-gray-50 rounded-full border border-gray-100">
                    <div className="flex items-center gap-1.5 text-sm font-medium text-gray-700">
                        <img src="/icons/download.svg" alt="Credits" className="w-[14px] h-[14px]" />
                        <span>1001</span>
                    </div>
                    <button className="px-3 py-1 bg-white rounded-full text-xs font-semibold text-blue-600 shadow-sm border border-gray-100 hover:text-blue-700">
                        Upgrade
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TopBar;
