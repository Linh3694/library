import React from 'react';
import { cn } from '../lib/utils';

interface HeroSectionProps {
  className?: string;
}

const HeroSection: React.FC<HeroSectionProps> = ({ className }) => {
  return (
    <section className={cn(
      "relative py-8 px-4 bg-gray-50 overflow-hidden",
      className
    )}>
      <div className="mx-auto text-center relative">
        {/* Main Content */}
        <div className="relative z-10">
         {/* Library Images */}
          <div className="flex items-center justify-center gap-10 relative">
            {/* Left Image */}
            <div className="relative mt-[15%]">
              <div className="w-96 h-96 rounded-full overflow-hidden border-4 border-white shadow-lg">
                <img 
                  src="/hero-01.jpg" 
                  alt="Library Scene 1" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Center Logo */}
            <div className="text-center z-30 relative pt-[2%]">
              <h1 className="text-9xl font-black text-[#F05023] tracking-wide pr-[20%]">
                 THƯ VIỆN
              </h1>
              <h1 className="text-9xl font-black text-[#002855] tracking-wider pt-[15%] pl-[10%]">
                WELLSPRING
              </h1>
            </div>

            {/* Right Image */}
            <div className="relative mb-[15%]">
              <div className="w-96 h-96 rounded-full overflow-hidden border-4 border-white shadow-lg">
                <img 
                  src="/hero-02.jpg" 
                  alt="Library Scene 2" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>

          {/* CTA Button */}
          <button className="inline-flex items-center px-8 py-3 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-full transition-colors duration-200 shadow-lg hover:shadow-xl">
            Mở tư sách
            <svg 
              className="ml-2 w-5 h-5" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M9 5l7 7-7 7" 
              />
            </svg>
          </button>
        </div>

        {/* Morse Code for WELLSPRING */}
        <div className="absolute top-1/2 left-0 right-0 flex items-center justify-center transform -translate-y-1/2 z-40">
          <div className="flex items-center space-x-3 px-12 py-6 rounded-full ">
            {/* W = .-- */}
            {/* <div className="w-10 h-10 bg-yellow-400 rounded-full"></div>
            <div className="w-20 h-10 bg-green-400 rounded-full"></div>
            <div className="w-20 h-10 bg-yellow-400 rounded-full"></div>
            <div className="w-6"></div> */}
            
            {/* E = . */}
            {/* <div className="w-10 h-10 bg-green-400 rounded-full"></div>
            <div className="w-6"></div> */}
            
            {/* L = .-.. */}
            <div className="w-10 h-10 bg-yellow-400 rounded-full"></div>
            <div className="w-20 h-10 bg-green-400 rounded-full"></div>
            <div className="w-20 h-10 bg-yellow-400 rounded-full"></div>
            <div className="w-10 h-10 bg-green-400 rounded-full"></div>
            <div className="w-6"></div>
            
            {/* L = .-.. */}
            <div className="w-10 h-10 bg-yellow-400 rounded-full"></div>
            <div className="w-20 h-10 bg-green-400 rounded-full"></div>
            <div className="w-20 h-10 bg-yellow-400 rounded-full"></div>
            <div className="w-10 h-10 bg-green-400 rounded-full"></div>
            <div className="w-6"></div>
            
            {/* S = ... */}
            <div className="w-10 h-10 bg-yellow-400 rounded-full"></div>
            <div className="w-20 h-10 bg-green-400 rounded-full"></div>
            <div className="w-20 h-10 bg-yellow-400 rounded-full"></div>
            <div className="w-10 h-10 bg-green-400 rounded-full"></div>
            
            {/* P = .--. */}
            <div className="w-10 h-10 bg-green-400 rounded-full"></div>
            <div className="w-20 h-10 bg-yellow-400 rounded-full"></div>
            <div className="w-20 h-10 bg-green-400 rounded-full"></div>
            <div className="w-10 h-10 bg-yellow-400 rounded-full"></div>
            <div className="w-6"></div>
            
            {/* R = .-. */}
            <div className="w-10 h-10 bg-green-400 rounded-full"></div>
            <div className="w-20 h-10 bg-yellow-400 rounded-full"></div>
            <div className="w-10 h-10 bg-green-400 rounded-full"></div>
            <div className="w-6"></div>
            
            {/* I = .. */}
            <div className="w-10 h-10 bg-yellow-400 rounded-full"></div>
            <div className="w-10 h-10 bg-green-400 rounded-full"></div>
            <div className="w-6"></div>
            
            {/* N = -. */}
            {/* <div className="w-20 h-10 bg-yellow-400 rounded-full"></div>
            <div className="w-10 h-10 bg-green-400 rounded-full"></div>
            <div className="w-6"></div> */}
            
            {/* G = --. */}
            {/* <div className="w-20 h-10 bg-yellow-400 rounded-full"></div>
            <div className="w-20 h-10 bg-green-400 rounded-full"></div>
            <div className="w-10 h-10 bg-yellow-400 rounded-full"></div> */}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection; 