import { useState, useEffect } from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from '../../components/ui/breadcrumb';
import { Pagination } from '../../components/ui/pagination';
import { libraryAPI, type LibraryActivity, type ActivitiesApiResponse } from '../../lib/api';

// Modal state interface
interface ModalState {
  isOpen: boolean;
  currentImageIndex: number;
  currentActivity: LibraryActivity | null;
}

// Real API function to fetch activities - sử dụng libraryAPI
const fetchActivitiesAPI = async (page: number, limit: number): Promise<ActivitiesApiResponse> => {
  return await libraryAPI.getActivities(page, limit);
};

// Image Modal Component
const ImageModal = ({ modalState, setModalState }: {
  modalState: ModalState;
  setModalState: (state: ModalState) => void;
}) => {
  if (!modalState.isOpen || !modalState.currentActivity) return null;

  // Get all images from both main images and days
  const getAllImages = (activity: LibraryActivity) => {
    const allImages: Array<{url: string, caption?: string, source: string}> = [];
    
    // Add main images
    if (activity.images && activity.images.length > 0) {
      activity.images.forEach(img => {
        allImages.push({
          url: img.url,
          caption: img.caption,
          source: 'main'
        });
      });
    }
    
    // Add images from days
    if (activity.days && activity.days.length > 0) {
      activity.days.forEach(day => {
        if (day.images && day.images.length > 0) {
          day.images.forEach(img => {
            allImages.push({
              url: img.url,
              caption: img.caption,
              source: day.title
            });
          });
        }
      });
    }
    
    return allImages;
  };

  const images = getAllImages(modalState.currentActivity);
  const currentImage = images[modalState.currentImageIndex];

  const handlePrevious = () => {
    const newIndex = modalState.currentImageIndex > 0 
      ? modalState.currentImageIndex - 1 
      : images.length - 1;
    setModalState({
      ...modalState,
      currentImageIndex: newIndex
    });
  };

  const handleNext = () => {
    const newIndex = modalState.currentImageIndex < images.length - 1 
      ? modalState.currentImageIndex + 1 
      : 0;
    setModalState({
      ...modalState,
      currentImageIndex: newIndex
    });
  };

  const handleClose = () => {
    setModalState({
      isOpen: false,
      currentImageIndex: 0,
      currentActivity: null
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      handleClose();
    } else if (e.key === 'ArrowLeft') {
      handlePrevious();
    } else if (e.key === 'ArrowRight') {
      handleNext();
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      onClick={handleClose}
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      <div className="relative max-w-7xl max-h-[90vh] w-full h-full flex items-center justify-center p-4">
        {/* Navigation buttons */}
        {images.length > 1 && (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handlePrevious();
              }}
              className="absolute left-8 top-1/2 transform -translate-y-1/2 bg-white/90 text-gray-800 w-10 h-10 rounded-full hover:bg-white hover:scale-105 transition-all duration-200 z-20 flex items-center justify-center shadow-xl border-2 border-gray-200"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleNext();
              }}
              className="absolute right-8 top-1/2 transform -translate-y-1/2 bg-white/90 text-gray-800 w-10 h-10 rounded-full hover:bg-white hover:scale-105 transition-all duration-200 z-20 flex items-center justify-center shadow-xl border-2 border-gray-200"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </>
        )}

        {/* Image Container */}
        <div className="flex items-center justify-center max-w-full max-h-full mx-20">
          <img
            src={currentImage.url}
            alt={currentImage.caption || modalState.currentActivity.title}
            className="max-w-full max-h-[80vh] object-contain rounded-lg shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      </div>
    </div>
  );
};

const ActivitiesHomePage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [activities, setActivities] = useState<LibraryActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(1);
  const [modalState, setModalState] = useState<ModalState>({
    isOpen: false,
    currentImageIndex: 0,
    currentActivity: null
  });

  const activitiesPerPage = 20;

  // Fetch activities from API
  useEffect(() => {
    const fetchActivities = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetchActivitiesAPI(currentPage, activitiesPerPage);
        
        setActivities(response.activities);
        setTotalPages(response.totalPages);
      } catch (err) {
        console.error('Error fetching activities:', err);
        setError(err instanceof Error ? err.message : 'Không thể tải danh sách hoạt động');
        setActivities([]);
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, [currentPage]);

  // Handle keyboard events for modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (modalState.isOpen) {
        if (e.key === 'Escape') {
          setModalState({
            isOpen: false,
            currentImageIndex: 0,
            currentActivity: null
          });
        } else if (e.key === 'ArrowLeft' && modalState.currentActivity) {
          const images = modalState.currentActivity.images;
          const newIndex = modalState.currentImageIndex > 0 
            ? modalState.currentImageIndex - 1 
            : images.length - 1;
          setModalState({
            ...modalState,
            currentImageIndex: newIndex
          });
        } else if (e.key === 'ArrowRight' && modalState.currentActivity) {
          const images = modalState.currentActivity.images;
          const newIndex = modalState.currentImageIndex < images.length - 1 
            ? modalState.currentImageIndex + 1 
            : 0;
          setModalState({
            ...modalState,
            currentImageIndex: newIndex
          });
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [modalState]);

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN');
  };

  // Handle image click with global index across all images
  const handleImageClick = (activity: LibraryActivity, globalImageIndex: number) => {
    setModalState({
      isOpen: true,
      currentImageIndex: globalImageIndex,
      currentActivity: activity
    });
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="sticky top-0 z-10">
        <Header />
      </div>

      {/* Main Content */}
      <div className="mx-[7%] px-4 sm:px-6 lg:px-8 py-6">
        {/* Breadcrumb */}
        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Trang chủ</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Hoạt động</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="flex gap-8">
          {/* Main Content */}
          <div className="flex-1">
              {loading ? (
                <div className="text-center py-12">
                  <p className="text-gray-500">Đang tải...</p>
                </div>
              ) : error ? (
                <div className="text-center py-12">
                  <p className="text-red-500">{error}</p>
                </div>
              ) : activities.length > 0 ? (
                <div className="space-y-12 ml-[5%]">
                  {/* Render each activity */}
                  {activities.map((activity) => {
                    let globalImageIndex = 0;
                    
                    return (
                      <div key={activity._id} className="space-y-6 pb-[2%]">
                        {/* Activity Title */}
                        <h2 className="text-2xl font-bold text-[#002855] text-left">
                          {activity.title}
                        </h2>
                        
                        {/* Activity Description */}
                        {activity.description && (
                          <p className="text-gray-600 text-left ml-[10%]">
                            {activity.description}
                          </p>
                        )}
                        
                        {/* Main images (backward compatibility) */}
                        {activity.images && activity.images.length > 0 && (
                          <div className="space-y-4 ml-[10%]">
                            <div className="flex gap-6 items-start">
                              <div className="w-20 flex-shrink-0">
                                <p className="text-sm text-[#757575] font-medium">{formatDate(activity.date)}</p>
                              </div>
                              <div className="flex-1">
                                <div className="grid grid-cols-4 gap-4">
                                  {activity.images.map((image, index) => {
                                    const currentGlobalIndex = globalImageIndex++;
                                    return (
                                      <div 
                                        key={index} 
                                        className="aspect-[4/3] rounded-2xl overflow-hidden cursor-pointer hover:opacity-80 transition-opacity"
                                        onClick={() => handleImageClick(activity, currentGlobalIndex)}
                                      >
                                        <img
                                          src={image.url}
                                          alt={image.caption || `${activity.title} ${index + 1}`}
                                          className="w-full h-full object-cover"
                                        />
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                        
                        {/* Days with images - Hiển thị theo ngày */}
                        {activity.days && activity.days.length > 0 && (
                          <div className="space-y-4 ml-[10%]">
                            {activity.days
                              // Sắp xếp days theo ngày
                              .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                              // Chỉ hiển thị days có images
                              .filter(day => day.images && day.images.length > 0)
                              .map((day) => (
                                <div key={day._id || day.dayNumber} className="space-y-4">
                                  {/* Day Header với ngày, tiêu đề và ảnh song song */}
                                  <div className="flex gap-6 items-start">
                                    <div className="w-24 flex-shrink-0">
                                      <div className=" text-[#757575] text-end">
                                        <p className="text-sm font-semibold"> {day.title}</p>
                                        <p className="text-sm font-semibold">{formatDate(day.date)}</p>
                                      </div>
                                    </div>
                                   {/* Day Images Grid - song song với title và date */}
                                    <div className="flex-1">
                                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                                        {day.images.map((image, index) => {
                                          const currentGlobalIndex = globalImageIndex++;
                                          return (
                                            <div 
                                              key={index} 
                                              className="group relative aspect-[4/3] rounded-xl overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-105"
                                              onClick={() => handleImageClick(activity, currentGlobalIndex)}
                                            >
                                              <img
                                                src={image.url}
                                                alt={image.caption || `${day.title} - Ảnh ${index + 1}`}
                                                className="w-full h-full object-cover transition-all duration-300 group-hover:brightness-110"
                                                loading="lazy"
                                              />
                                              {/* Overlay hiển thị khi hover */}
                                              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
                                                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                                                  </svg>
                                                </div>
                                              </div>
                                              {/* Caption overlay */}
                                              {image.caption && (
                                                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3">
                                                  <p className="text-white text-xs font-medium">{image.caption}</p>
                                                </div>
                                              )}
                                            </div>
                                          );
                                        })}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-500">Không tìm thấy hoạt động nào</p>
                </div>
              )}

             {/* Pagination */}
             {totalPages > 1 && (
               <div className="mt-8">
                 <Pagination
                   currentPage={currentPage}
                   totalPages={totalPages}
                   onPageChange={setCurrentPage}
                   showPrevNext={true}
                   showFirstLast={false}
                   maxVisiblePages={5}
                 />
               </div>
             )}
          </div>
        </div>
      </div>

      {/* Image Modal */}
      <ImageModal modalState={modalState} setModalState={setModalState} />

      <Footer />
    </div>
  );
};

export default ActivitiesHomePage; 