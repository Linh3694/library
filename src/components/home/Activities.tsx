import React, { useState, useEffect } from 'react';
import { cn } from '../../lib/utils';
import {
  type CarouselApi,
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from '../../components/ui/carousel';
import { getImageUrl as getImageUrlFromConfig } from '../../lib/utils';
import { libraryAPI, type LibraryActivity } from '../../lib/api';

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
  return url || '/hero-01.png'; // fallback image nếu không có URL
};

const Activities: React.FC<ActivitiesProps> = ({ className }) => {
  const [galleries, setGalleries] = useState<Gallery[]>([]);
  const [selectedGallery, setSelectedGallery] = useState<Gallery | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [api, setApi] = useState<CarouselApi>();
  const [mobileApi, setMobileApi] = useState<CarouselApi>();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [mobileCurrentSlide, setMobileCurrentSlide] = useState(0);

  // Track desktop carousel slide
  useEffect(() => {
    if (!api) return;
    setCurrentSlide(api.selectedScrollSnap());
    api.on("select", () => {
      setCurrentSlide(api.selectedScrollSnap());
    });
  }, [api]);

  // Track mobile carousel slide
  useEffect(() => {
    if (!mobileApi) return;
    setMobileCurrentSlide(mobileApi.selectedScrollSnap());
    mobileApi.on("select", () => {
      setMobileCurrentSlide(mobileApi.selectedScrollSnap());
    });
  }, [mobileApi]);

  // Reset slide when changing gallery
  useEffect(() => {
    if (api) {
      api.scrollTo(0);
    }
    if (mobileApi) {
      mobileApi.scrollTo(0);
    }
  }, [selectedGallery, api, mobileApi]);

  // Fetch activities từ backend
  const fetchActivities = async () => {
    try {
      setLoading(true);
      const response = await libraryAPI.getActivities(1, 5);
      const activities: LibraryActivity[] = response.activities || [];

      // Chuyển đổi activities thành galleries format
      const convertedGalleries: Gallery[] = activities.map(activity => {
        // Gom tất cả ảnh từ activity.images và tất cả ảnh từ days
        const allImages: string[] = [];

        // Thêm ảnh từ activity.images (nếu có)
        activity.images.forEach(img => {
          allImages.push(getImageUrl(img.url));
        });

        // Thêm ảnh từ tất cả các days
        activity.days.forEach(day => {
          day.images.forEach(img => {
            allImages.push(getImageUrl(img.url));
          });
        });

        // Nếu không có ảnh nào, thêm ảnh mặc định
        if (allImages.length === 0) {
          allImages.push('/hero-01.png');
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
          images: ['/hero-01.png', '/hero-02.jpg', '/wellspring-logo.png']
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
        "relative px-4 pb-20 pt-10 bg-background",
        className
      )}>
        <div className="flex flex-col mx-40">
          <div className="flex flex-col items-start gap-4">
            <div className="flex items-center gap-4">
              <div className="w-6 h-6 bg-amber rounded-full"></div>
              <div className="w-6 h-6 bg-lime rounded-full"></div>
              <div className="w-6 h-6 bg-amber rounded-full"></div>
              <div className="w-6 h-6 bg-lime rounded-full"></div>
            </div>
            <h2 className="text-5xl font-extrabold text-oxford">HOẠT ĐỘNG</h2>
          </div>

          <div className="flex justify-center pt-[3%]">
            <div className="bg-semi-white rounded-[60px] px-6 py-8 min-h-[550px] border-4 border-light-gray w-fit">
              <div className="flex h-full items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-oxford"></div>
                <span className="ml-4 text-oxford">Đang tải hoạt động...</span>
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
        "relative bg-background w-full max-w-[1920px] mx-auto py-12 lg:py-32",
        className
      )}>
        <div className="max-w-[1600px] mx-auto w-full px-4 md:px-8 2xl:px-0 flex flex-col">
          <div className="flex flex-col items-start gap-4">
            <div className="flex items-center gap-4">
              <div className="w-6 h-6 bg-amber rounded-full transition-all duration-300"></div>
              <div className="w-6 h-6 bg-lime rounded-full transition-all duration-300"></div>
              <div className="w-6 h-6 bg-amber rounded-full transition-all duration-300"></div>
              <div className="w-6 h-6 bg-lime rounded-full transition-all duration-300"></div>
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-oxford leading-tight lg:leading-relaxed transition-all duration-300">HOẠT ĐỘNG</h2>
          </div>

          <div className="flex justify-center pt-8 lg:pt-[3%]">
            <div className="bg-semi-white rounded-[32px] lg:rounded-[60px] px-6 py-8 min-h-[400px] lg:min-h-[550px] border-4 border-light-gray w-full lg:w-fit transition-all duration-300">
              <div className="flex h-full items-center justify-center text-center">
                <div>
                  <p className="text-dark-gray mb-4">Không thể tải hoạt động</p>
                  <button
                    onClick={fetchActivities}
                    className="px-4 py-2 bg-oxford text-white rounded-lg hover:bg-oxford/80 transition-all duration-300 ease-out"
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
      "relative bg-background w-full max-w-[1920px] mx-auto py-12 lg:py-32",
      className
    )}>
      <div className="max-w-[1600px] mx-auto w-full px-4 md:px-8 2xl:px-0 flex flex-col">
        {/* Header */}
        <div className="flex flex-col items-start gap-4">
          <div className="flex items-center gap-4">
            <div className="w-6 h-6 bg-amber rounded-full transition-all duration-300"></div>
            <div className="w-6 h-6 bg-lime rounded-full transition-all duration-300"></div>
            <div className="w-6 h-6 bg-amber rounded-full transition-all duration-300"></div>
            <div className="w-6 h-6 bg-lime rounded-full transition-all duration-300"></div>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-oxford leading-tight lg:leading-relaxed transition-all duration-300">HOẠT ĐỘNG</h2>
        </div>

        {/* Main Content - Container */}
        <div className="flex pt-8 lg:pt-[3%] w-full h-auto lg:h-[600px] transition-all duration-300">
          <div className="bg-semi-white rounded-[32px] lg:rounded-[48px] w-full h-full p-4 lg:p-6 flex flex-col md:flex-col lg:flex-row relative gap-4 lg:gap-0 transition-all duration-300">

            {/* Left Side - Gallery List (Accordion on Mobile) */}
            <div className="w-full lg:w-[35%] h-auto lg:h-full flex flex-col relative lg:pr-8 lg:pl-4 py-2 lg:py-4">
              <div className="flex-1 overflow-y-auto lg:overflow-y-auto scrollbar-thin scrollbar-thumb-medium-gray scrollbar-track-transparent pr-0 lg:pr-4 space-y-6 lg:space-y-8">
                {galleries.map((gallery) => (
                  <div key={gallery.id} className="w-full">
                    <button
                      onClick={() => setSelectedGallery(gallery)}
                      className="w-full text-left transition-all duration-200 group block"
                    >
                      <div className={cn(
                        "relative text-[15px] leading-relaxed pb-1 inline-block transition-colors duration-300 ease-out",
                        selectedGallery?.id === gallery.id
                          ? "text-oxford font-bold"
                          : "text-dark-gray font-medium group-hover:text-oxford"
                      )}>
                        {gallery.name}
                        <span className={cn(
                          "absolute bottom-0 left-0 h-[1.5px] bg-oxford transition-all duration-300 ease-out",
                          selectedGallery?.id === gallery.id ? "w-full" : "w-0"
                        )}></span>
                      </div>
                    </button>

                    {/* Mobile-only Image Preview (Accordion) */}
                    {selectedGallery?.id === gallery.id && (
                      <div className="mt-4 block lg:hidden w-full aspect-square relative rounded-2xl bg-semi-white overflow-hidden animate-in fade-in slide-in-from-top-4 duration-500">
                        <Carousel setApi={setMobileApi} className="w-full h-full flex flex-col">
                          <CarouselContent className="h-full min-h-full items-center">
                            {gallery.images.map((image, idx) => (
                              <CarouselItem key={idx} className="h-full w-full relative grid place-items-center">
                                <img
                                  src={image}
                                  alt={`${gallery.name} - ${idx + 1}`}
                                  className="max-w-full max-h-full object-contain"
                                  onError={(e) => {
                                    const target = e.target as HTMLImageElement;
                                    target.src = '/hero-01.png';
                                  }}
                                />
                              </CarouselItem>
                            ))}
                          </CarouselContent>

                          {/* Optional: Mobile dots or indicators could go here */}
                          <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-1.5 z-20">
                            {gallery.images.map((_, idx) => (
                              <div
                                key={idx}
                                className={cn(
                                  "w-1.5 h-1.5 rounded-full transition-all duration-300",
                                  mobileCurrentSlide === idx ? "bg-white w-4" : "bg-white/40"
                                )}
                              />
                            ))}
                          </div>
                        </Carousel>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* View More Button */}
              <div className="mt-6 lg:mt-8 relative w-fit">
                <button
                  onClick={() => window.location.href = '/activities'}
                  className="group font-bold text-sm flex items-center hover:-translate-y-0.5 transition-all duration-300 ease-out"
                >
                  <span className="bg-gradient-to-r from-red-orange from-50% to-oxford to-50% bg-[length:200%_100%] bg-right group-hover:bg-left bg-clip-text text-transparent transition-all duration-300 ease-out">
                    Xem thêm
                  </span>
                  <svg className="w-4 h-4 ml-2 text-oxford group-hover:text-red-orange transform group-hover:translate-x-1 transition-all duration-300 ease-out" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Right Side - Image Carousel (Desktop Only) */}
            <div className="hidden lg:block lg:flex-1 h-full relative rounded-[40px] overflow-hidden group lg:ml-2 shadow-sm transition-all duration-300 ease-out">
              {selectedGallery && (
                <>
                  <Carousel setApi={setApi} className="w-full h-full">
                    <CarouselContent className="h-full">
                      {selectedGallery.images.map((image, index) => (
                        <CarouselItem key={index} className="h-full relative overflow-hidden">
                          <img
                            src={image}
                            alt={`${selectedGallery.name} - Ảnh ${index + 1}`}
                            className="w-full h-full object-cover transition-transform duration-[800ms] group-hover:scale-105"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = '/hero-01.png';
                            }}
                          />
                        </CarouselItem>
                      ))}
                    </CarouselContent>

                    {/* Navigation buttons */}
                    <div className="absolute inset-0 flex items-center justify-between p-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          const carousel = e.currentTarget.closest('[data-slot="carousel"]');
                          if (carousel) {
                            const prevBtn = carousel.querySelector('[data-slot="carousel-previous"]') as HTMLButtonElement;
                            prevBtn?.click();
                          }
                        }}
                        disabled={selectedGallery.images.length <= 1}
                        className="w-12 h-12 rounded-full bg-white/90 hover:bg-white text-oxford border-2 border-oxford/30 hover:border-oxford transition-all duration-200 flex items-center justify-center shadow-lg disabled:opacity-50 disabled:cursor-not-allowed pointer-events-auto"
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
                        className="w-12 h-12 rounded-full bg-white/90 hover:bg-white text-oxford border-2 border-oxford/30 hover:border-oxford transition-all duration-200 flex items-center justify-center shadow-lg disabled:opacity-50 disabled:cursor-not-allowed pointer-events-auto"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </div>

                    {/* Hidden built-in navigation buttons */}
                    <CarouselPrevious className="hidden" />
                    <CarouselNext className="hidden" />
                  </Carousel>

                  {/* Smooth Gradient Overlay for entire bottom text */}
                  <div className="absolute inset-x-0 bottom-0 h-3/5 bg-gradient-to-t from-black/60 via-black/10 to-transparent pointer-events-none z-10 transition-opacity duration-300"></div>

                  {/* Title and Pagination Overlay positioned exactly as mockup */}
                  <div className="absolute bottom-8 left-8 right-8 z-20 pointer-events-none">
                    <h3 className="text-white font-bold text-lg leading-tight drop-shadow-md mb-2">
                      {selectedGallery.name}
                    </h3>
                    <p className="text-white/80 text-sm font-medium drop-shadow-md">
                      {currentSlide + 1} / {selectedGallery.images.length}
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Activities; 