import React from 'react';
import { cn } from '../lib/utils';

interface FooterProps {
  className?: string;
}

const Footer: React.FC<FooterProps> = ({ className }) => {
  return (
    <footer className={cn(
      "w-full bg-oxford text-white py-12 lg:py-20",
      className
    )}>
      <div className="max-w-[1600px] mx-auto px-4 md:px-8 2xl:px-0">
        <div className="flex flex-col lg:flex-row items-center lg:items-center justify-between gap-12 lg:gap-20 w-full">
          {/* Left Side - Logo */}
          <div className="flex-shrink-0">
            <img
              src="/wellspring-logo-white.png"
              alt="Wellspring Logo"
              className="h-32 lg:h-44 w-auto"
            />
          </div>

          {/* Right Side - Contact Information */}
          <div className="flex-1 w-full lg:ml-16">
            {/* Main Title */}
            <h2 className="text-xl lg:text-2xl font-extrabold mb-6 lg:mb-8 text-center lg:text-start">
              WELLSPRING INTERNATIONAL BILINGUAL SCHOOLS
            </h2>

            {/* Contact Information Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-12 md:gap-y-0 text-center md:text-left">
              {/* Hanoi Column */}
              <div className="flex flex-col gap-6">
                <h3 className="text-lg font-bold">Wellspring Hanoi</h3>
                <div>
                  <p className="text-sm mb-1">(+84) 24 7305 8668</p>
                  <p className="text-sm">No 95 Ai Mo St., Bo De Ward, Ha Noi</p>
                </div>
                <div>
                  <p className="font-bold text-lg mb-2">Admissions</p>
                  <p className="text-sm mb-1">(+84) 973 759 229</p>
                  <p className="text-sm">tuyensinh@wellspring.edu.vn</p>
                </div>
              </div>

              {/* Saigon Column */}
              <div className="flex flex-col gap-6">
                <h3 className="text-lg font-bold">Wellspring Saigon</h3>
                <div>
                  <p className="text-sm mb-1">(+84) 28 3840 9292</p>
                  <p className="text-sm">No. 1, D4 St., Saigon Pearl, 92 Nguyen Huu Canh St., Thanh My Tay Ward, Ho Chi Minh City</p>
                </div>
                <div>
                  <p className="font-bold text-lg mb-2">Admissions</p>
                  <p className="text-sm mb-1">(+84) 937 099 229</p>
                  <p className="text-sm">admissions@wellspringsaigon.edu.vn</p>
                </div>
                <div className="mt-4 pt-4 border-t border-white/10 lg:border-none lg:mt-2 lg:pt-0">
                  <p className="text-sm">www.wellspring.edu.vn</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 