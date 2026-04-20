import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X as CloseIcon, ChevronRight, ArrowLeft } from 'lucide-react';
import LibraryMegaMenu from './LibraryMegaMenu';
import SearchMegaMenu from './SearchMegaMenu';

interface MobileMenuProps {
    isOpen: boolean;
    onClose: () => void;
    menuItems: any[];
}

const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen, onClose, menuItems }) => {
    const [activeSubMenu, setActiveSubMenu] = useState<'library' | 'search' | null>(null);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
            setActiveSubMenu(null);
        }
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [isOpen]);

    const handleLinkClick = () => {
        onClose();
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0, x: '100%' }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: '100%' }}
                    transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                    className="fixed inset-0 z-[100] bg-background flex flex-col h-screen"
                >
                    {/* Header */}
                    <div className="h-20 px-4 flex items-center justify-between border-b border-light-gray flex-shrink-0 bg-background/80 backdrop-blur-[16px] sticky top-0 z-10">
                        <div className="flex items-center gap-2">
                            {activeSubMenu ? (
                                <button
                                    onClick={() => setActiveSubMenu(null)}
                                    className="p-2 -ml-2 text-oxford hover:text-red-orange transition-colors"
                                >
                                    <ArrowLeft size={24} />
                                </button>
                            ) : (
                                <img src="/wellspring-logo.png" alt="Wellspring Logo" className="w-24 h-auto" />
                            )}
                            <span className="font-bold text-oxford">
                                {activeSubMenu === 'library' ? 'Thư viện sách' :
                                    activeSubMenu === 'search' ? 'Tìm kiếm' : ''}
                            </span>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 text-oxford hover:text-red-orange transition-colors"
                        >
                            <CloseIcon size={24} />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="flex-1 overflow-y-auto hide-scrollbar pb-10">
                        <div className="relative h-full">
                            {/* Main Menu items */}
                            <AnimatePresence mode="wait">
                                {!activeSubMenu ? (
                                    <motion.div
                                        key="main-menu"
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        className="p-4 flex flex-col gap-2"
                                    >
                                        {menuItems.map((item) => (
                                            <div key={item.label} className="border-b border-light-gray last:border-none">
                                                {item.menuType ? (
                                                    <button
                                                        onClick={() => setActiveSubMenu(item.menuType)}
                                                        className="w-full flex items-center justify-between py-5 text-xl font-bold text-oxford hover:text-red-orange group"
                                                    >
                                                        <span>{item.label}</span>
                                                        <ChevronRight size={20} className="text-medium-gray group-hover:text-red-orange transition-colors" />
                                                    </button>
                                                ) : (
                                                    <Link
                                                        to={item.href}
                                                        onClick={handleLinkClick}
                                                        className="block py-5 text-xl font-bold text-oxford hover:text-red-orange"
                                                    >
                                                        {item.label}
                                                    </Link>
                                                )}
                                            </div>
                                        ))}
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key="submenu"
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: 20 }}
                                        className="h-full"
                                    >
                                        {activeSubMenu === 'library' && (
                                            <div className="p-0">
                                                <LibraryMegaMenu
                                                    isOpen={true}
                                                    onMouseEnter={() => { }}
                                                    onMouseLeave={() => { }}
                                                    onSearchClick={() => setActiveSubMenu('search')}
                                                />
                                            </div>
                                        )}
                                        {activeSubMenu === 'search' && (
                                            <div className="p-0">
                                                <SearchMegaMenu
                                                    isOpen={true}
                                                    onMouseEnter={() => { }}
                                                    onMouseLeave={() => { }}
                                                    onLibraryClick={() => setActiveSubMenu('library')}
                                                />
                                            </div>
                                        )}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default MobileMenu;
