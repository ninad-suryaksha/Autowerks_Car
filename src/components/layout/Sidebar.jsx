import React from 'react';
import { Copy } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const NavItem = ({ icon, isSvg, to, active }) => {
    const content = isSvg ? (
        <img src={icon} alt="icon" className="w-5 h-5 opacity-80" />
    ) : (
        React.createElement(icon, { size: 20, strokeWidth: 1.5, className: "opacity-80" })
    );

    return (
        <Link
            to={to || '#'}
            className={`w-10 h-10 flex items-center justify-center rounded-xl transition-all mb-3 ${active
                ? 'bg-gray-200 text-gray-900'
                : 'text-gray-500 hover:bg-gray-100'
                }`}
        >
            {content}
        </Link>
    );
};

const Sidebar = () => {
    const location = useLocation();
    const pathname = location.pathname;

    return (
        <div className="w-16 h-screen flex flex-col items-center py-4 bg-[#F5F5F7] fixed left-0 top-0 z-50 border-r border-[#E5E5E5]">
            {/* Logo */}
            <div className="mb-8">
                <Link to="/" className="w-10 h-10 flex items-center justify-center">
                    <img src="/icons/imgi_1_newicon-sm.svg" alt="Logo" className="w-8 h-8" />
                </Link>
            </div>

            {/* Navigation Items */}
            <div className="flex-1 w-full flex flex-col items-center">
                {/* Item 1: Edit (Square Pen) */}
                <NavItem
                    icon="/icons/svg-2.svg"
                    isSvg={true}
                    to="/"
                    active={pathname === '/'}
                />

                {/* Item 2: Space/Planet (imgi_2_spaces.svg) */}
                <NavItem
                    icon="/icons/spaces.svg"
                    isSvg={true}
                    to="#"
                />

                {/* Item 3: Images/Library (imgi_3_library.svg) */}
                <NavItem
                    icon="/icons/library.svg"
                    isSvg={true}
                    to="#"
                />

                {/* Item 4: Videos (SVG-11) */}
                <NavItem
                    icon="/icons/svg-11.svg"
                    isSvg={true}
                    to="#"
                />

                {/* Item 5: Brand Memory (imgi_5_brand-memory.svg) */}
                <NavItem
                    icon="/icons/brand-memory.svg"
                    isSvg={true}
                    to="#"
                />

                {/* Item 6: Copy (Lucide Copy fallback) */}
                <NavItem
                    icon={Copy}
                    isSvg={false}
                    to="#"
                />

                {/* Divider */}
                <div className="w-8 h-px bg-gray-300 my-2"></div>

                {/* Item 7: History (SVG-3) */}
                <NavItem
                    icon="/icons/svg-3.svg"
                    isSvg={true}
                    to="#"
                />
            </div>

            {/* Bottom Actions */}
            <div className="mt-auto flex flex-col items-center gap-4 w-full">
                {/* Diamond (SVG-4) */}
                <div className="w-10 h-10 flex items-center justify-center text-gray-500 hover:text-gray-900 cursor-pointer">
                    <img src="/icons/svg-4.svg" alt="Premium" className="w-5 h-5 opacity-80" />
                </div>

                {/* Avatar */}
                <div className="w-9 h-9 rounded-full overflow-hidden border border-gray-200 cursor-pointer hover:opacity-80 transition-opacity mb-2 bg-black flex items-center justify-center">
                    <img
                        src="/Autowerks-Logo-AW.png"
                        alt="Profile"
                        className="w-full h-full object-contain p-1"
                    />
                </div>
            </div>
        </div>
    );
};

export default Sidebar;
