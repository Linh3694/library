import React from 'react';
import { cn } from '../lib/utils';

interface FooterProps {
  className?: string;
}

const Footer: React.FC<FooterProps> = ({ className }) => {
  return (
    <footer className={cn(
      "bg-[#002855] text-white py-[5%] px-[10%]",
      className
    )}>
      <div className="mx-40">
        <div className="flex items-center justify-between gap-20">
          {/* Left Side - Logo */}
          <div className="flex-shrink-0">
            <img 
              src="/wellspring-logo-white.png" 
              alt="Wellspring Logo" 
              className="h-44 w-auto"
            />
          </div>

          {/* Right Side - Contact Information */}
          <div className="flex-1 ml-16">
            {/* Main Title */}
            <h2 className="text-2xl font-extrabold mb-8 text-start">
              WELLSPRING INTERNATIONAL BILINGUAL SCHOOLS
            </h2>

            {/* Contact Information Grid */}
            <div className="grid grid-cols-2 gap-12">
              {/* Wellspring Hanoi */}
              <div>
                <h3 className="text-lg font-bold mb-4">Wellspring Hanoi</h3>
                <p className="text-sm mb-2">(+84) 24 7308 6636</p>
                <p className="text-sm mb-4">hanoi@wellspring.edu.vn</p>
                
                <div className="mb-4">
                  <p className="font-bold text-sm mb-1">Admissions</p>
                  <p className="text-sm mb-1">(+84) 913 139 223</p>
                  <p className="text-sm">admissions.hn@wellspring.edu.vn</p>
                </div>

                <p className="text-xs leading-relaxed">
                  www.wellspring.edu.vn<br />
                  95 Ai Mo St., Bo De Ward, Long Bien Dist., Hanoi
                </p>
              </div>

              {/* Wellspring Saigon */}
              <div>
                <h3 className="text-lg font-bold mb-4">Wellspring Saigon</h3>
                <p className="text-sm mb-2">(+84) 28 3948 9995</p>
                <p className="text-sm mb-4">saigon@wellspring.edu.vn</p>

                <div className="mb-4">
                  <p className="font-bold text-sm mb-1">Admissions</p>
                  <p className="text-sm mb-1">(+84) 347 169 2943</p>
                  <p className="text-sm">admissions@wellspringsaigon.edu.vn</p>
                </div>

                <p className="text-xs leading-relaxed">
                  www.wellspring.edu.vn<br />
                  92 Nguyễn Hữu Cảnh St., Ward 22, Bình Thạnh Dist., Ho Chi Minh City
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 