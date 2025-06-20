import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { cn, createSlug } from '../../lib/utils';
import { API_URL, getImageUrl } from '../../lib/config';

interface FeaturedLibrary {
  _id?: string;
  libraryCode?: string;
  title: string; // Library title
  authors?: string[];
  category?: string;
  coverImage?: string;
  isNewBook?: boolean;
  isFeaturedBook?: boolean;
  isAudioBook?: boolean;
  // Thông tin bổ sung từ books trong library
  totalBooks?: number;
  averageRating?: number;
  totalBorrowCount?: number;
}

interface BookFeaturedProps {
  className?: string;
}

const BookFeatured: React.FC<BookFeaturedProps> = ({ className }) => {
  const [featuredLibraries, setFeaturedLibraries] = useState<FeaturedLibrary[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch featured libraries from backend
  useEffect(() => {
    const fetchFeaturedLibraries = async () => {
      try {
        const response = await fetch(`${API_URL}/libraries/featured-books?limit=4`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        // Check if response is actually JSON
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          throw new Error('Response is not JSON - API server may not be running or endpoint not found');
        }
        
        // API trả về books với library info, cần group theo library
        const books = await response.json();
        
        // Group books theo libraryId để tạo unique libraries
        const libraryMap = new Map<string, FeaturedLibrary>();
        
        books.forEach((book: { 
          libraryId: string; 
          libraryCode?: string; 
          libraryTitle?: string; 
          bookTitle: string; 
          authors?: string[]; 
          category?: string; 
          coverImage?: string; 
          isNewBook?: boolean; 
          isFeaturedBook?: boolean; 
          isAudioBook?: boolean;
          rating?: number; 
          borrowCount?: number; 
        }) => {
          const libraryId = book.libraryId;
          if (!libraryMap.has(libraryId)) {
            libraryMap.set(libraryId, {
              _id: libraryId,
              libraryCode: book.libraryCode,
              title: book.libraryTitle || book.bookTitle, // Fallback to bookTitle if no libraryTitle
              authors: book.authors,
              category: book.category,
              coverImage: book.coverImage,
              isNewBook: book.isNewBook,
              isFeaturedBook: book.isFeaturedBook || false,
              isAudioBook: book.isAudioBook,
              totalBooks: 1,
              averageRating: book.rating || 0,
              totalBorrowCount: book.borrowCount || 0
            });
          } else {
            // Update existing library with more book data
            const existingLibrary = libraryMap.get(libraryId)!;
            existingLibrary.totalBooks = (existingLibrary.totalBooks || 0) + 1;
            existingLibrary.averageRating = ((existingLibrary.averageRating || 0) + (book.rating || 0)) / 2;
            existingLibrary.totalBorrowCount = (existingLibrary.totalBorrowCount || 0) + (book.borrowCount || 0);
          }
        });
        
        // Convert map to array và chỉ lấy 4 libraries đầu tiên
        const uniqueLibraries = Array.from(libraryMap.values()).slice(0, 4);
        setFeaturedLibraries(uniqueLibraries);
        
      } catch (error) {
        console.error('Error fetching featured libraries:', error);
        // Set empty array so UI doesn't break
        setFeaturedLibraries([]);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedLibraries();
  }, []);

  return (
    <section className={cn(
      "w-full flex not-odd:relative",
      className
    )}>
      {/* Main Content Container */}
      <div className="flex items-start w-full pt-20 mx-20">
        {/* Left Section - 1 Library with Circle Background */}
        <div className="flex-1 flex justify-center items-start py-10">
          {loading ? (
            // Loading skeleton
            <div className="relative">
              <div className="w-96 h-96 rounded-full bg-gray-200 flex items-center justify-center animate-pulse">
                <div className="w-[200px] h-[270px] bg-gray-300 rounded-lg"></div>
              </div>
              <div className="mt-8 space-y-3">
                <div className="h-6 bg-gray-300 rounded w-80 mx-auto"></div>
                <div className="h-4 bg-gray-300 rounded w-48 mx-auto"></div>
                <div className="h-4 bg-gray-300 rounded w-64 mx-auto"></div>
                <div className="h-3 bg-gray-300 rounded w-40 mx-auto"></div>
              </div>
            </div>
          ) : featuredLibraries.length > 0 ? (
            // First library with special layout
            <div className="flex flex-col items-start mt-[80%] ml-[10%] group hover:scale-105 transition-transform duration-300">
              {/* Circle Container */}
              <Link 
                to={`/library/book/${createSlug(featuredLibraries[0].title)}`}
                className="relative w-96 h-64 rounded-full bg-gray-100 flex items-center justify-center mb-8">
                {/* Library Cover */}
                <div className="relative w-[150px] h-[200px] flex items-center justify-center">
                  {featuredLibraries[0].coverImage ? (
                    <img 
                      src={getImageUrl(featuredLibraries[0].coverImage)} 
                      alt={featuredLibraries[0].title}
                      className="w-full h-full object-cover rounded-lg shadow-2xl"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-blue-200 to-blue-300 flex items-center justify-center rounded-lg shadow-2xl">
                      <div className="text-center p-4">
                        <div className="w-16 h-20 bg-white rounded shadow-sm mx-auto mb-3"></div>
                        <div className="text-sm text-blue-800 font-medium uppercase tracking-wide leading-tight">
                          {featuredLibraries[0].title}
                        </div>
                        {featuredLibraries[0].totalBooks && (
                          <div className="text-xs mt-1 opacity-90">
                            {featuredLibraries[0].totalBooks} quyển
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </Link>

              {/* Library Information */}
              <div className="text-left ml-[10%] max-w-md">
                {/* Library Title */}
                <h3 className="text-lg font-bold uppercase text-[#002855] mb-3 leading-tight">
                  {featuredLibraries[0].title}
                </h3>
                
                {/* Author */}
                <p className="text-base text-[#757575] mb-4 font-medium">
                  {featuredLibraries[0].authors?.join(", ") || "Tác giả đa dạng"}
                </p>
                
                {/* Description */}
                <p className="text-sm text-[#666666] mb-4 leading-relaxed">
                  Bộ sưu tập sách nổi bật với {featuredLibraries[0].totalBooks || 1} quyển sách chất lượng cao
                </p>
                
                {/* Publication Info */}
                <p className="text-sm text-[#999999] italic">
                  Thư viện nổi bật tháng {new Date().getMonth() + 1}
                </p>
              </div>
            </div>
          ) : (
            // No libraries found
            <div className="w-full text-center py-20">
              <div className="flex flex-col items-center">
                <svg className="w-16 h-16 text-gray-400 mb-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 17.27L18.18 21L16.54 13.97L22 9.24L14.81 8.63L12 2L9.19 8.63L2 9.24L7.46 13.97L5.82 21L12 17.27Z"/>
                </svg>
                <p className="text-gray-500 text-lg mb-2">Chưa có thư viện nổi bật nào</p>
                <p className="text-gray-400 text-sm">Vui lòng thêm Library với isFeaturedBook: true để hiển thị thư viện nổi bật</p>
              </div>
            </div>
          )}
        </div>

        {/* Center Section - Discover Circle */}
        <div className="flex-1 flex justify-start items-center pt-[15%]">
          <div className="relative">
            {/* Main Circle */}
            <div className="w-80 h-80 rounded-full border-4 border-[#F05023] flex items-center justify-center bg-white hover:bg-gray-50 transition-colors duration-300 cursor-pointer group">
              <div className="text-center">
                <h3 className="text-4xl font-extrabold text-[#F05023]">
                  KHÁM PHÁ
                </h3>
              </div>
            </div>
            {/* Arrow Icon - Top Right Corner */}
            <div className="absolute -top-2 -right-2 w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17L17 7M17 7H7M17 7V17" />
              </svg>
            </div>
          </div>
        </div>

        {/* Right Section - 2 Libraries with Different Heights */}
        <div className="flex-1 flex justify-start items-start pt-[10%] mr-[5%]">
          <div className="flex gap-8 items-start">
            {loading ? (
              // Loading skeleton
              <>
                {/* Short Library - Left */}
                <div className="flex flex-col items-center text-center animate-pulse">
                  <div className="relative mb-4 flex items-center justify-center">
                    {/* Gray Oval Background */}
                        <div className="absolute bg-gray-200 w-[560px] h-[360px] rounded-full"></div>
                        {/* Library Placeholder */}
                       <div className="relative z-10 w-[240px] h-[320px] bg-gray-300 rounded-lg"></div>
                  </div>
                  <div className="w-full text-center">
                    <div className="h-4 bg-gray-300 rounded w-3/4 mx-auto mb-2"></div>
                    <div className="h-3 bg-gray-300 rounded w-1/2 mx-auto mb-2"></div>
                    <div className="h-3 bg-gray-300 rounded w-1/3 mx-auto"></div>
                  </div>
                </div>
                {/* Tall Library - Right */}
                <div className="flex flex-col items-center text-center animate-pulse">
                  <div className="relative mb-4 flex items-center justify-center">
                        {/* Gray Oval Background */}
                        <div className="absolute bg-gray-200 w-[400px] h-[640px] rounded-full"></div>
                        {/* Library Placeholder */}
                       <div className="relative z-10 w-[320px] h-[480px] bg-gray-300 rounded-lg"></div>
                  </div>
                  <div className="w-full text-center">
                    <div className="h-4 bg-gray-300 rounded w-3/4 mx-auto mb-2"></div>
                    <div className="h-3 bg-gray-300 rounded w-1/2 mx-auto mb-2"></div>
                    <div className="h-3 bg-gray-300 rounded w-1/3 mx-auto"></div>
                  </div>
                </div>
              </>
            ) : (
              // Always show exactly 2 libraries with fixed layout
              <>
                {/* Short Library - Left - Chỉ hiển thị khi có dữ liệu thật */}
                {featuredLibraries.length > 1 && (
                  <div className="flex flex-col mr-10 items-center text-center group hover:scale-105 transition-transform duration-300">
                    {/* Library Cover Container with Gray Oval Background */}
                    <Link
                      to={`/library/book/${createSlug(featuredLibraries[1].title)}`}
                      className="relative mb-4 flex items-center justify-center">
                      {/* Gray Oval Background - Horizontal for short library */}
                      <div className="absolute bg-gray-200 w-[400px] h-[250px] rounded-full"></div>
                      {/* Library Cover */}
                      <div className="relative z-10 flex items-center justify-center w-[150px] h-[200px]">
                        {featuredLibraries[1].coverImage ? (
                          <img 
                            src={getImageUrl(featuredLibraries[1].coverImage)} 
                            alt={featuredLibraries[1].title}
                            className="w-full h-full object-cover rounded-lg shadow-xl"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-blue-200 to-blue-300 flex items-center justify-center rounded-lg shadow-xl">
                            <div className="text-center p-6">
                              <div className="w-12 h-20 bg-white rounded shadow-sm mx-auto mb-4"></div>
                              <div className="text-sm text-blue-800 font-medium uppercase tracking-wide">
                                {featuredLibraries[1].title}
                              </div>
                              {featuredLibraries[1].totalBooks && (
                                <div className="text-xs mt-1 opacity-90">
                                  {featuredLibraries[1].totalBooks} quyển
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>                           
                    </Link>

                    {/* Library Info */}
                    <div className="w-[350px] text-start mt-12 -ml-10">
                      <p className="text-lg font-bold uppercase text-[#002855] mb-3 leading-tight">
                        {featuredLibraries[1].title}
                      </p>
                      <p className="text-base text-[#757575] mb-2">
                        {featuredLibraries[1].authors?.join(", ") || "Tác giả đa dạng"}
                      </p>
                      <p className="text-sm text-[#666666] mb-3 leading-relaxed">
                        Bộ sưu tập {featuredLibraries[1].totalBooks || 1} quyển sách chất lượng cao được lựa chọn kỹ càng
                      </p>
                      <p className="text-sm text-[#999999] italic">
                        Thư viện nổi bật tháng {new Date().getMonth() + 1}
                      </p>
                    </div>
                  </div>
                )}

                {/* Tall Library - Right - Chỉ hiển thị khi có dữ liệu thật */}
                {featuredLibraries.length > 2 && (
                  <div className="flex flex-col items-center text-center group hover:scale-105 transition-transform duration-300">
                    {/* Library Cover Container with Gray Oval Background */}
                    <Link 
                      to={`/library/book/${createSlug(featuredLibraries[2].title)}`}
                      className="relative mb-4 flex items-center justify-center">
                      {/* Gray Oval Background - Vertical for tall library */}
                      <div className="absolute bg-gray-200 w-[350px] h-[500px] rounded-[100px] -top-10"></div>
                      {/* Library Cover */}
                      <div className="relative z-10 flex items-center justify-center w-[250px] h-[333px] top-10">
                        {featuredLibraries[2].coverImage ? (
                          <img 
                            src={getImageUrl(featuredLibraries[2].coverImage)} 
                            alt={featuredLibraries[2].title}
                            className="w-full h-full object-cover rounded-4xl shadow-xl"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-green-200 to-green-300 flex items-center justify-center rounded-lg shadow-xl">
                            <div className="text-center p-8">
                              <div className="w-20 h-28 bg-white rounded shadow-sm mx-auto mb-4"></div>
                              <div className="text-sm text-green-800 font-medium uppercase tracking-wide">
                                {featuredLibraries[2].title}
                              </div>
                              {featuredLibraries[2].totalBooks && (
                                <div className="text-xs mt-1 opacity-90">
                                  {featuredLibraries[2].totalBooks} quyển
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>                           
                    </Link>

                    {/* Library Info */}
                    <div className="w-[350px] text-start mt-32">
                      <p className="text-lg font-bold uppercase text-[#002855] mb-3 leading-tight">
                        {featuredLibraries[2].title}
                      </p>
                      <p className="text-base text-[#757575] mb-2">
                        {featuredLibraries[2].authors?.join(", ") || "Tác giả đa dạng"}
                      </p>
                      <p className="text-sm text-[#666666] mb-3 leading-relaxed">
                        Bộ sưu tập {featuredLibraries[2].totalBooks || 1} quyển sách chọn lọc với nội dung phong phú
                      </p>
                      <p className="text-sm text-[#999999] italic">
                        Thư viện nổi bật tháng {new Date().getMonth() + 1}
                      </p>
                    </div>
                  </div>
                )}

                {/* Thông báo khi không đủ dữ liệu */}
                {featuredLibraries.length <= 2 && (
                  <div className="flex items-center justify-center w-full text-center py-10">
                    <div className="flex flex-col items-center">
                      <svg className="w-12 h-12 text-gray-400 mb-3" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 17.27L18.18 21L16.54 13.97L22 9.24L14.81 8.63L12 2L9.19 8.63L2 9.24L7.46 13.97L5.82 21L12 17.27Z"/>
                      </svg>
                      <p className="text-gray-500 text-sm">Cần thêm thư viện nổi bật để hiển thị đầy đủ</p>
                      <p className="text-gray-400 text-xs mt-1">Vui lòng tạo thêm Library với isFeaturedBook: true</p>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Section Title */}
      <div className="absolute top-16 left-40">
        <div className="flex flex-col items-start gap-4">
            <div className="flex items-center gap-4">
          <div className="w-6 h-6 bg-[#FFCE02] rounded-full"></div>
          <div className="w-6 h-6 bg-[#BED232] rounded-full"></div>
            </div>
          <h2 className="text-5xl font-extrabold text-[#002855]">THƯ VIỆN NỔI BẬT</h2>
        </div>
      </div>
    </section>
  );
};

export default BookFeatured; 