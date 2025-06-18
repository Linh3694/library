import React, { useState } from 'react';
import { cn } from '../../lib/utils';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from '../../components/ui/carousel';

interface Gallery {
  id: string;
  name: string;
  images: string[];
}

interface ActivitiesProps {
  className?: string;
}

// Dữ liệu mẫu cho các gallery
const galleries: Gallery[] = [
  {
    id: '1',
    name: 'Cuộc thi BookStar season 2',
    images: [
      '/hero-01.jpg',
      '/hero-02.jpg',
      '/wellspring-logo.png',
    ]
  },
  {
    id: '2',
    name: 'Chung kết cuộc thi WVMO',
    images: [
      '/hero-02.jpg',
      '/hero-01.jpg',
      '/wellspring-logo.png',
    ]
  },
  {
    id: '3',
    name: 'Hoạt động làm báo tường chào mừng 20/11',
    images: [
      '/wellspring-logo.png',
      '/hero-01.jpg',
      '/hero-02.jpg',
    ]
  },
  {
    id: '4',
    name: 'Buổi Workshop CLB BOW',
    images: [
      '/hero-01.jpg',
      '/wellspring-logo.png',
      '/hero-02.jpg',
    ]
  },
];

const Activities: React.FC<ActivitiesProps> = ({ className }) => {
  const [selectedGallery, setSelectedGallery] = useState<Gallery>(galleries[0]);

  return (
    <section className={cn(
      "relative px-4 pb-20 pt-10 bg-gray-50",
      className
    )}>
      <div className="flex flex-col mx-40">
        {/* Header */}
        <div className="flex flex-col items-start gap-4">
            <div className="flex items-center gap-4">
          <div className="w-6 h-6 bg-[#FFCE02] rounded-full"></div>
          <div className="w-6 h-6 bg-[#BED232] rounded-full"></div>
          <div className="w-6 h-6 bg-[#FFCE02] rounded-full"></div>
          <div className="w-6 h-6 bg-[#BED232] rounded-full"></div>
            </div>
          <h2 className="text-5xl font-extrabold text-[#002855]">HOẠT ĐỘNG</h2>
        </div>

                 {/* Main Content - Oval Container */}
         <div className="flex justify-center pt-[3%]">
           <div className="bg-[#f6f6f6] rounded-[60px] px-6 py-8 min-h-[550px] border-4 border-gray-100 w-fit">
            <div className="flex h-full items-center">
                             {/* Left Side - Gallery List (1/4) */}
               <div className="relative w-80 p-4 h-full">
                 <div className="max-h-[400px] overflow-y-auto scrollbar-thin scrollbar-thumb-[#F05023] scrollbar-track-gray-100">
                  {galleries.map((gallery) => (
                    <button
                      key={gallery.id}
                      onClick={() => setSelectedGallery(gallery)}
                      className="w-full text-left p-4 transition-all duration-200"
                    >
                      <div className={cn(
                        "text-sm font-semibold line-clamp-3 inline-block transition-all duration-200",
                        selectedGallery.id === gallery.id
                          ? "text-[#002855] border-b-2 border-[#002855] pb-3"
                          : "text-[#757575]"
                      )}>
                        {gallery.name}
                      </div>
                    </button>
                  ))}
                </div>
                
                {/* View More Button */}
                <button className="absolute bottom-4 left-4 px-4 py-2  text-[#002855] hover:border-b-2 hover:border-[#002855] transition-all duration-1 flex items-center gap-2  font-semibold text-sm">
                  Xem thêm
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>

              {/* Right Side - Image Carousel */}
              <div className="w-full h-full">
                <div className="h-full flex flex-col">               
                 {/* Carousel Container */}
                   <div className="flex-1 flex items-center justify-center">
                     <Carousel className="w-full h-full">
                       <CarouselContent className="h-full">
                         {selectedGallery.images.map((image, index) => (
                           <CarouselItem key={index} className="h-full">
                             <div className="relative w-full h-[450px] rounded-4xl overflow-hidden shadow-lg">
                               <img
                                 src={image}
                                 alt={`${selectedGallery.name} - Ảnh ${index + 1}`}
                                 className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                               />
                               
                               {/* Navigation buttons inside image */}
                               <div className="absolute inset-0 flex items-center justify-between p-4 opacity-0 hover:opacity-100 transition-opacity duration-300">
                                 <button
                                   onClick={(e) => {
                                     e.stopPropagation();
                                     // Access carousel API through parent
                                     const carousel = e.currentTarget.closest('[data-slot="carousel"]');
                                     if (carousel) {
                                       const prevBtn = carousel.querySelector('[data-slot="carousel-previous"]') as HTMLButtonElement;
                                       prevBtn?.click();
                                     }
                                   }}
                                   disabled={selectedGallery.images.length <= 1}
                                   className="w-12 h-12 rounded-full bg-white/90 hover:bg-white text-[#002855] border-2 border-[#002855]/30 hover:border-[#002855] transition-all duration-200 flex items-center justify-center shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                                 >
                                   <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                   </svg>
                                 </button>
                                 
                                 <button
                                   onClick={(e) => {
                                     e.stopPropagation();
                                     const carousel = e.currentTarget.closest('[data-slot="carousel"]');
                                     if (carousel) {
                                       const nextBtn = carousel.querySelector('[data-slot="carousel-next"]') as HTMLButtonElement;
                                       nextBtn?.click();
                                     }
                                   }}
                                   disabled={selectedGallery.images.length <= 1}
                                   className="w-12 h-12 rounded-full bg-white/90 hover:bg-white text-[#002855] border-2 border-[#002855]/30 hover:border-[#002855] transition-all duration-200 flex items-center justify-center shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                                 >
                                   <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                   </svg>
                                 </button>
                               </div>
                               
                               {/* Image info overlay */}
                               <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent p-4">
                                 <h3 className="text-white font-bold text-lg mb-1">
                                   {selectedGallery.name}
                                 </h3>
                                 <p className="text-white/80 text-sm">
                                   {index + 1} / {selectedGallery.images.length}
                                 </p>
                               </div>
                             </div>
                           </CarouselItem>
                         ))}
                       </CarouselContent>
                       
                       {/* Hidden original navigation buttons - still needed for functionality */}
                       <CarouselPrevious className="hidden" />
                       <CarouselNext className="hidden" />
                     </Carousel>
                   </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>


    </section>
  );
};

export default Activities; 