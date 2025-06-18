import React, { useState, useEffect } from 'react';
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
import { API_URL } from '../../lib/config';

// Define LibraryActivity interface based on backend model
interface LibraryActivity {
  _id: string;
  title: string;
  date: string;
  images: Array<{
    _id?: string;
    url: string;
    caption?: string;
    uploadedAt?: string;
  }>;
  isPublished: boolean;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

// API response interface
interface ApiResponse {
  activities: LibraryActivity[];
  totalPages: number;
  currentPage: number;
  total: number;
}

// Real API function to fetch activities
const fetchActivitiesAPI = async (page: number, limit: number): Promise<ApiResponse> => {
  try {
    const response = await fetch(`${API_URL}/library-activities?page=${page}&limit=${limit}&sortBy=date`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('API fetch error:', error);
    throw new Error('Không thể kết nối đến server');
  }
};

const ActivitiesHomePage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [activities, setActivities] = useState<LibraryActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(1);

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

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN');
  };

  // Group images by date (mock implementation for demo)
  const getImagesByDate = (activity: LibraryActivity) => {
    const images = activity.images.map((img: { url: string; caption?: string }) => img.url);
    return {
      date1: images.slice(0, 4),
      date2: images.slice(4, 8)
    };
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
                    const imageGroups = getImagesByDate(activity);
                    
                    return (
                      <div key={activity._id} className="space-y-6">
                        {/* Activity Title */}
                        <h2 className="text-2xl font-bold text-[#002855] text-left">
                          {activity.title}
                        </h2>
                        
                        {/* Images with dates */}
                        <div className="space-y-4 ml-[10%]">
                          {/* First row of images with date */}
                          {imageGroups.date1.length > 0 && (
                            <div className="flex gap-6 items-start">
                              <div className="w-20 flex-shrink-0">
                                <p className="text-sm text-[#757575] font-medium">{formatDate(activity.date)}</p>
                              </div>
                              <div className="flex-1">
                                <div className="grid grid-cols-4 gap-4">
                                  {imageGroups.date1.map((image: string, index: number) => (
                                    <div key={index} className="aspect-[4/3] rounded-2xl overflow-hidden">
                                      <img
                                        src={image}
                                        alt={`${activity.title} ${index + 1}`}
                                        className="w-full h-full object-cover"
                                      />
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          )}
                          
                          {/* Second row of images with different date */}
                          {imageGroups.date2.length > 0 && (
                            <div className="flex gap-6 items-start">
                              <div className="w-20 flex-shrink-0">
                                <p className="text-sm text-[#757575] font-medium">{formatDate(activity.date)}</p>
                              </div>
                              <div className="flex-1">
                                <div className="grid grid-cols-4 gap-4">
                                  {imageGroups.date2.map((image: string, index: number) => (
                                    <div key={index + 4} className="aspect-[4/3] rounded-2xl overflow-hidden">
                                      <img
                                        src={image}
                                        alt={`${activity.title} ${index + 5}`}
                                        className="w-full h-full object-cover"
                                      />
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
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

      <Footer />
    </div>
  );
};

export default ActivitiesHomePage; 