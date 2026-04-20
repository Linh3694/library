import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { cn } from '../lib/utils';
import LibraryMegaMenu from './LibraryMegaMenu';
import SearchMegaMenu from './SearchMegaMenu';
import { Menu, X as CloseIcon } from 'lucide-react';
import MobileMenu from './MobileMenu';

interface HeaderProps {
  userName?: string;
  className?: string;
}

const Header: React.FC<HeaderProps> = ({
  className
}) => {

  const [activeMenu, setActiveMenu] = useState<'library' | 'search' | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const menuItems = [
    { label: 'Trang chủ', href: '/' },
    { label: 'Thư viện sách', href: '/library', menuType: 'library' as const },
    { label: 'Giới thiệu sách', href: '/book-introductions' },
    { label: 'Hoạt động', href: '/activities' },
    { label: 'Tìm kiếm sách', menuType: 'search' as const },
  ];

  const handleMouseEnter = (item: typeof menuItems[0]) => {
    setActiveMenu(item.menuType || null);
  };

  const handleMouseLeave = () => {
    setActiveMenu(null);
  };

  return (
    <div
      className={cn(
        "w-full sticky top-0 z-50",
        className
      )}
      onMouseLeave={handleMouseLeave}
    >
      {/* Header Background & Content Container */}
      <div className={cn(
        "relative w-full max-w-[1920px] mx-auto h-20 transition-all duration-300",
        activeMenu
          ? "bg-background/80 backdrop-blur-[16px]"
          : "bg-background/87 backdrop-blur-[16px]"
      )}>
        <div className="max-w-[1600px] mx-auto px-4 md:px-8 2xl:px-0 h-full flex items-center justify-between">
          {/* Logo & Menu - Left Side */}
          <div className="flex items-center gap-10">
            {/* Logo */}
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <img src="/wellspring-logo.png" alt="Wellspring Logo" className="w-28 h-auto" />
              </div>
            </div>

            {/* Navigation Menu */}
            <nav className="hidden md:flex items-center space-x-[48px] h-full">
              {menuItems.map((item) => (
                <div
                  key={item.label}
                  className="h-full flex items-center"
                  onMouseEnter={() => handleMouseEnter(item)}
                >
                  <Link
                    to={item.href || '#'}
                    className={cn(
                      "px-3 py-2 text-sm font-semibold transition-all duration-200 border-b-2 border-transparent",
                      "text-oxford hover:text-red-orange hover:border-red-orange"
                    )}
                  >
                    {item.label}
                  </Link>
                </div>
              ))}
            </nav>
          </div>

          {/* User Info */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              className="text-oxford hover:text-red-orange p-2 transition-colors"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <CloseIcon size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        menuItems={menuItems}
      />

      {/* Mega Menus as Absolute Overlays (Desktop) */}
      <div className="hidden md:block absolute top-20 left-0 w-full pointer-events-none">
        <div className="pointer-events-auto">
          <AnimatePresence mode="wait">
            {activeMenu === 'library' && (
              <LibraryMegaMenu
                isOpen={true}
                onMouseEnter={() => setActiveMenu('library')}
                onMouseLeave={handleMouseLeave}
                onSearchClick={() => setActiveMenu('search')}
              />
            )}
            {activeMenu === 'search' && (
              <SearchMegaMenu
                isOpen={true}
                onMouseEnter={() => setActiveMenu('search')}
                onMouseLeave={handleMouseLeave}
                onLibraryClick={() => setActiveMenu('library')}
              />
            )}
          </AnimatePresence>
        </div>
      </div>
    </div >
  );
};

export default Header;
