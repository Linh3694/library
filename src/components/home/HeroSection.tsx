import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { cn } from '../../lib/utils';

interface HeroSectionProps {
  className?: string;
}

const HeroSection: React.FC<HeroSectionProps> = ({ className }) => {
  const navigate = useNavigate();

  const handleOpenLibrary = () => {
    navigate('/library');
  };

  return (
    <section className={cn(
      "relative py-8 px-4 md:px-8 bg-background overflow-hidden",
      className
    )}>
      <div className="max-w-[1600px] mx-auto text-center relative 2xl:px-0">
        {/* Main Content */}
        <div className="relative z-10">
          {/* Library Images */}
          <div className="flex items-center justify-center gap-10 relative">
            {/* Left Image */}
            <div className="relative mt-[10%] lg:mt-[15%]">
              <div className="w-24 h-24 sm:w-40 sm:h-40 md:w-64 md:h-64 lg:w-96 lg:h-96 rounded-full overflow-hidden">
                <img
                  src="/hero-01.png"
                  alt="Library Scene 1"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Center Logo */}
            <div className="text-center z-30 relative pt-[2%]">
              <h1 className="text-4xl sm:text-6xl md:text-8xl lg:text-9xl font-black text-red-orange tracking-wide lg:pr-[20%]">
                THƯ VIỆN
              </h1>
              <h1 className="text-4xl sm:text-6xl md:text-8xl lg:text-9xl font-black text-oxford tracking-wider pt-4 lg:pt-[15%] lg:pl-[10%]">
                WELLSPRING
              </h1>
            </div>

            {/* Right Image */}
            <div className="relative mb-[10%] lg:mb-[15%]">
              <div className="w-24 h-24 sm:w-40 sm:h-40 md:w-64 md:h-64 lg:w-96 lg:h-96 rounded-full overflow-hidden">
                <img
                  src="/hero-02.jpg"
                  alt="Library Scene 2"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>

          {/* CTA Button */}
          <button
            onClick={handleOpenLibrary}
            className="inline-flex items-center px-8 py-4 bg-red-orange hover:bg-orange-600 hover:scale-105 text-white font-bold rounded-full transition-colors duration-200"
          >
            Mở tủ sách
            <ArrowUpRight className="ml-2 w-6 h-6" strokeWidth={2.5} />
          </button>
        </div>

        {/* Morse Code for WELLSPRING - Hidden on mobile/tablet */}
        <div className="absolute top-1/2 left-0 right-0 hidden lg:flex items-center justify-center transform -translate-y-1/2 z-40 px-4">
          <div className="flex items-center space-x-3 px-12 py-6 rounded-full ">

            {/* L = .-.. */}
            <div className="w-10 h-10 bg-amber rounded-full"></div>
            <div className="w-20 h-10 bg-lime rounded-full"></div>
            <div className="w-10 h-10 bg-amber rounded-full"></div>
            <div className="w-10 h-10 bg-lime rounded-full"></div>
            <div className="w-6"></div>

            {/* I = .. */}
            <div className="w-10 h-10 bg-amber rounded-full"></div>
            <div className="w-10 h-10 bg-lime rounded-full"></div>
            <div className="w-6"></div>

            {/* B = -... */}
            <div className="w-20 h-10 bg-amber rounded-full"></div>
            <div className="w-10 h-10 bg-lime rounded-full"></div>
            <div className="w-10 h-10 bg-amber rounded-full"></div>
            <div className="w-10 h-10 bg-lime rounded-full"></div>
            <div className="w-6"></div>

            {/* R = .-. */}
            <div className="w-10 h-10 bg-amber rounded-full"></div>
            <div className="w-20 h-10 bg-lime rounded-full"></div>
            <div className="w-10 h-10 bg-amber rounded-full"></div>
            <div className="w-6"></div>

            {/* A = .- */}
            <div className="w-10 h-10 bg-lime rounded-full"></div>
            <div className="w-20 h-10 bg-amber rounded-full"></div>
            <div className="w-6"></div>

            {/* R = .-. */}
            <div className="w-10 h-10 bg-lime rounded-full"></div>
            <div className="w-20 h-10 bg-amber rounded-full"></div>
            <div className="w-10 h-10 bg-lime rounded-full"></div>
            <div className="w-6"></div>

            {/* Y = -.-- */}
            <div className="w-20 h-10 bg-amber rounded-full"></div>
            <div className="w-10 h-10 bg-lime rounded-full"></div>
            <div className="w-20 h-10 bg-amber rounded-full"></div>
            <div className="w-20 h-10 bg-lime rounded-full"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection; 