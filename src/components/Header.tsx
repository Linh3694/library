import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '../lib/utils';
import WellspringLogo from '../../public/wellspring-logo.png';

interface HeaderProps {
  userName?: string;
  className?: string;
}

const Header: React.FC<HeaderProps> = ({ 
  className 
}) => {
  const location = useLocation();
  
  const menuItems = [
    { label: 'Trang chủ', href: '/' },
    { label: 'Thư viện sách', href: '/library' },
    { label: 'Hoạt động', href: '/activities' },
    // { label: 'Mượn - Trả sách', href: '/borrow' },
    // { label: 'Tìm kiếm sách', href: '/search' },
  ];

  return (
    <header className={cn(
      "w-full bg-white bg-blend-saturation bg-opacity-87 backdrop-blur-[25px] ",
      className
    )}>
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-40">
                 <div className="flex items-center justify-between h-20">
           {/* Logo & Menu - Left Side */}
           <div className="flex items-center gap-10">
             {/* Logo */}
             <div className="flex items-center">
               <div className="flex-shrink-0">
                 <img src={WellspringLogo} alt="Wellspring Logo" className="w-28 h-auto" />
               </div>
             </div>

             {/* Navigation Menu */}
             <nav className="hidden md:flex items-center space-x-8">
               {menuItems.map((item) => (
                 <Link
                   key={item.label}
                   to={item.href}
                   className={cn(
                     "px-3 py-2 text-sm font-bold transition-colors duration-200",
                     location.pathname === item.href 
                       ? "text-[#002855] border-b-2 border-[#002855]"
                       : "text-[#002855] hover:text-[#004080]"
                   )}
                 >
                   {item.label}
                 </Link>
               ))}
             </nav>
           </div>

          {/* User Info */}
          <div className="flex items-center space-x-4">
            {/* <span className="text-[#757575] text-sm font-semi bold">
              Chào mừng WISer <span className="font-bold text-[#002855]">{userName}</span>
            </span> */}
            
            {/* Action Icons */}
            <div className="flex items-center space-x-2">
              {/* Notification Bell */}
              {/* <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z"/>
                </svg>
              </button> */}
              
              {/* User Avatar */}
              {/* <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">
                  {userName.split(' ').map(n => n[0]).join('').slice(0, 2)}
                </span>
              </div> */}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button className="text-gray-700 hover:text-blue-600 p-2">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header; 