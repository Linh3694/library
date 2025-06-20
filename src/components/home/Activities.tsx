import React, { useState, useEffect } from 'react';
import { cn } from '../../lib/utils';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from '../../components/ui/carousel';
import { API_URL, getImageUrl as getImageUrlFromConfig } from '../../lib/config';

interface ActivityDay {
  _id?: string;
  dayNumber: number;
  date: string;
  title: string;
  description: string;
  isPublished?: boolean;
  images: Array<{
    _id?: string;
    url: string;
    caption?: string;
    uploadedAt?: string;
  }>;
}

interface LibraryActivity {
  _id: string;
  title: string;
  description?: string;
  date: string;
  days: ActivityDay[];
  images: Array<{
    _id: string;
    url: string;
    caption?: string;
    uploadedAt: string;
  }>;
  isPublished: boolean;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

interface Gallery {
  id: string;
  name: string;
  images: string[];
}

interface ActivitiesProps {
  className?: string;
}

// Helper function để lấy URL ảnh đầy đủ với fallback
const getImageUrl = (imagePath: string) => {
  const url = getImageUrlFromConfig(imagePath);
  return url || '/hero-01.jpg'; // fallback image nếu không có URL
};

const Activities: React.FC<ActivitiesProps> = ({ className }) => {
  const [galleries, setGalleries] = useState<Gallery[]>([]);
  const [selectedGallery, setSelectedGallery] = useState<Gallery | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch activities từ backend
  const fetchActivities = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/library-activities?limit=10&includeHidden=false`);
      
      if (!response.ok) {
        throw new Error('Không thể tải danh sách hoạt động');
      }

      const data = await response.json();
      const activities: LibraryActivity[] = data.activities || [];

      // Chuyển đổi activities thành galleries format
      const convertedGalleries: Gallery[] = activities.map(activity => {
        // Gom tất cả ảnh từ activity.images và tất cả ảnh từ days
        const allImages: string[] = [];
        
        // Thêm ảnh từ activity.images (nếu có)
        activity.images.forEach(img => {
          allImages.push(getImageUrl(img.url));
        });
        
        // Thêm ảnh từ tất cả các days (chỉ những days đã published)
        activity.days.forEach(day => {
          if (day.isPublished !== false) { // Default true nếu undefined
            day.images.forEach(img => {
              allImages.push(getImageUrl(img.url));
            });
          }
        });

        // Nếu không có ảnh nào, thêm ảnh mặc định
        if (allImages.length === 0) {
          allImages.push('/hero-01.jpg');
        }

        return {
          id: activity._id,
          name: activity.title,
          images: allImages
        };
      });

      setGalleries(convertedGalleries);
      
      // Set gallery đầu tiên làm mặc định
      if (convertedGalleries.length > 0) {
        setSelectedGallery(convertedGalleries[0]);
      }

    } catch (err) {
      console.error('Error fetching activities:', err);
      setError(err instanceof Error ? err.message : 'Có lỗi xảy ra');
      
      // Fallback to mock data nếu có lỗi
      const fallbackGalleries: Gallery[] = [
        {
          id: 'fallback-1',
          name: 'Cuộc thi BookStar season 2',
          images: ['/hero-01.jpg', '/hero-02.jpg', '/wellspring-logo.png']
        }
      ];
      setGalleries(fallbackGalleries);
      setSelectedGallery(fallbackGalleries[0]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivities();
  }, []);

  // Loading state
  if (loading) {
    return (
      <section className={cn(
        "relative px-4 pb-20 pt-10 bg-gray-50",
        className
      )}>
        <div className="flex flex-col mx-40">
          <div className="flex flex-col items-start gap-4">
            <div className="flex items-center gap-4">
              <div className="w-6 h-6 bg-[#FFCE02] rounded-full"></div>
              <div className="w-6 h-6 bg-[#BED232] rounded-full"></div>
              <div className="w-6 h-6 bg-[#FFCE02] rounded-full"></div>
              <div className="w-6 h-6 bg-[#BED232] rounded-full"></div>
            </div>
            <h2 className="text-5xl font-extrabold text-[#002855]">HOẠT ĐỘNG</h2>
          </div>
          
          <div className="flex justify-center pt-[3%]">
            <div className="bg-[#f6f6f6] rounded-[60px] px-6 py-8 min-h-[550px] border-4 border-gray-100 w-fit">
              <div className="flex h-full items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#002855]"></div>
                <span className="ml-4 text-[#002855]">Đang tải hoạt động...</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Error state
  if (error && galleries.length === 0) {
    return (
      <section className={cn(
        "relative px-4 pb-20 pt-10 bg-gray-50",
        className
      )}>
        <div className="flex flex-col mx-40">
          <div className="flex flex-col items-start gap-4">
            <div className="flex items-center gap-4">
              <div className="w-6 h-6 bg-[#FFCE02] rounded-full"></div>
              <div className="w-6 h-6 bg-[#BED232] rounded-full"></div>
              <div className="w-6 h-6 bg-[#FFCE02] rounded-full"></div>
              <div className="w-6 h-6 bg-[#BED232] rounded-full"></div>
            </div>
            <h2 className="text-5xl font-extrabold text-[#002855]">HOẠT ĐỘNG</h2>
          </div>
          
          <div className="flex justify-center pt-[3%]">
            <div className="bg-[#f6f6f6] rounded-[60px] px-6 py-8 min-h-[550px] border-4 border-gray-100 w-fit">
              <div className="flex h-full items-center justify-center text-center">
                <div>
                  <p className="text-[#757575] mb-4">Không thể tải hoạt động</p>
                  <button 
                    onClick={fetchActivities}
                    className="px-4 py-2 bg-[#002855] text-white rounded-lg hover:bg-[#002855]/80"
                  >
                    Thử lại
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

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
                        selectedGallery?.id === gallery.id
                          ? "text-[#002855] border-b-2 border-[#002855] pb-3"
                          : "text-[#757575]"
                      )}>
                        {gallery.name}
                      </div>
                    </button>
                  ))}
                </div>
                
                {/* View More Button */}
                <button 
                  onClick={() => window.location.href = '/activities'}
                  className="absolute bottom-4 left-4 px-4 py-2 text-[#002855] hover:border-b-2 hover:border-[#002855] transition-all duration-1 flex items-center gap-2 font-semibold text-sm"
                >
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
                    {selectedGallery && (
                      <Carousel className="w-full h-full">
                        <CarouselContent className="h-full">
                          {selectedGallery.images.map((image, index) => (
                            <CarouselItem key={index} className="h-full">
                              <div className="relative w-full h-[450px] rounded-4xl overflow-hidden shadow-lg">
                                <img
                                  src={image}
                                  alt={`${selectedGallery.name} - Ảnh ${index + 1}`}
                                  className="w-full h-full object-contain hover:scale-105 transition-transform duration-300"
                                  onError={(e) => {
                                    // Fallback nếu ảnh không load được
                                    const target = e.target as HTMLImageElement;
                                    target.src = '/hero-01.jpg';
                                  }}
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
                    )}
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