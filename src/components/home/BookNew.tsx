import React, { useState, useEffect } from 'react';
import { cn } from '../../lib/utils';
import { API_URL, getImageUrl } from '../../lib/config';

interface NewLibrary {
  _id?: string;
  libraryCode?: string;
  title: string; // Library title
  authors?: string[];
  category?: string;
  coverImage?: string;
  seriesName?: string;
  documentType?: string;
  isNewBook?: boolean;
  isFeaturedBook?: boolean;
  isAudioBook?: boolean;
  // Thông tin bổ sung từ books trong library
  totalBooks?: number;
  averageRating?: number;
  totalBorrowCount?: number;
  publishYear?: number;
}

interface BookNewProps {
  className?: string;
}

const BookNew: React.FC<BookNewProps> = ({ className }) => {
  const [newLibraries, setNewLibraries] = useState<NewLibrary[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch new libraries from backend
  useEffect(() => {
    const fetchNewLibraries = async () => {
      try {
        const response = await fetch(`${API_URL}/libraries/new-books?limit=4`);
        
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
        const libraryMap = new Map<string, NewLibrary>();
        
        books.forEach((book: { 
          libraryId: string; 
          libraryCode?: string; 
          libraryTitle?: string; 
          bookTitle: string; 
          authors?: string[]; 
          category?: string; 
          coverImage?: string; 
          seriesName?: string;
          documentType?: string;
          isNewBook?: boolean; 
          isFeaturedBook?: boolean; 
          isAudioBook?: boolean;
          rating?: number; 
          borrowCount?: number;
          publishYear?: number;
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
              seriesName: book.seriesName,
              documentType: book.documentType,
              isNewBook: book.isNewBook || false,
              isFeaturedBook: book.isFeaturedBook,
              isAudioBook: book.isAudioBook,
              totalBooks: 1,
              averageRating: book.rating || 0,
              totalBorrowCount: book.borrowCount || 0,
              publishYear: book.publishYear
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
        setNewLibraries(uniqueLibraries);
        
      } catch (error) {
        console.error('Error fetching new libraries:', error);
        // Set empty array so UI doesn't break
        setNewLibraries([]);
      } finally {
        setLoading(false);
      }
    };

    fetchNewLibraries();
  }, []);

  return (
    <section className={cn(
      "w-full h-screen items-center justify-center pt-[5%] pl-20 bg-gray-50",
      className
    )}>
      <div className="flex items-center gap-4 mb-[5%]">
        <div className="w-full flex flex-col px-20 items-start gap-4">
          <div className="w-6 h-6 bg-yellow-400 rounded-full"></div>
            <div className="w-full mx-auto flex items-center justify-between gap-4">
                <h2 className="text-5xl font-extrabold text-[#002855]">THƯ VIỆN MỚI</h2>
                <div className="ml-auto mr-20">
                <button className="text-[#F05023] font-extrabold hover:text-orange-600 transition-colors">
                    XEM THÊM
                </button>
            </div>
            </div>
         </div>
      </div>

      {/* Libraries Container with Curved Border */}
      <div className="border-l-2 border-y-2 border-[#DDDDDD] rounded-l-full py-10 pl-20 flex justify-center gap-6 overflow-x-hidden">
        {loading ? (
          // Loading skeleton
          Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className={cn(
                "w-1/3 flex flex-col items-center text-center group relative animate-pulse",
                index < 3 && "border-r-2 border-[#DDDDDD]"
              )}
            >
              <div className="relative w-[200px] h-[266px] min-h-[266px] flex items-center justify-center">
                <div className="w-full h-full bg-gray-300 rounded-lg"></div>
              </div>
              <div className="w-full text-center mt-2">
                <div className="h-4 bg-gray-300 rounded w-3/4 mx-auto mb-12"></div>
                <div className="h-3 bg-gray-300 rounded w-1/2 mx-auto mb-2"></div>
                <div className="h-3 bg-gray-300 rounded w-1/3 mx-auto"></div>
              </div>
            </div>
          ))
        ) : newLibraries.length > 0 ? (
          newLibraries.map((library, index) => (
            <div
              key={library._id || index}
              className={cn(
                "w-1/3 flex flex-col items-center text-center group relative",
                index < newLibraries.length - 1 && "border-r-2 border-[#DDDDDD]"
              )}
            >
              {/* Library Cover Container */}
              <div className="relative w-[200px] h-[266px] min-h-[266px] flex items-center justify-center">
                {/* Library Cover */}
                {library.coverImage ? (
                  <img 
                    src={getImageUrl(library.coverImage)} 
                    alt={library.title}
                    className="w-full h-full object-cover rounded-lg shadow-lg"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center rounded-lg shadow-lg">
                    <div className="text-center p-4">
                      <div className="w-16 h-20 bg-white rounded shadow-sm mx-auto mb-3"></div>
                      <div className="text-xs text-gray-600 font-medium uppercase tracking-wide">
                        {library.title}
                      </div>
                    </div>
                  </div>
                )}

                {/* Arrow Icon */}
                <div className="absolute -top-2 -right-12 bg-[#f6f6f6] rounded-full p-2 shadow text-gray-500 flex items-center justify-center">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </div>

                {/* New Badge - Chỉ hiển thị khi isNewBook = true */}
                {library.isNewBook && (
                  <div className="absolute top-2 left-2 bg-yellow-400 text-white text-xs font-bold px-2 py-1 rounded-full">
                    MỚI
                  </div>
                )}
    
            
              </div>

              {/* Library Info */}
              <div className="w-full text-center pt-5">
                <p className="text-sm font-bold uppercase text-[#002855] mt-2">
                  {library.title}
                </p>
                <div className="mt-10">
                  <p className="text-sm font-semibold text-[#757575]">
                    {library.authors?.join(", ") || "Chưa có thông tin tác giả"}
                  </p>
                  <p className="text-sm font-semibold text-[#757575]">
                    {library.documentType || "Chủ đề đa dạng"}
                  </p>
                </div>
              </div>
            </div>
          ))
        ) : (
          // No libraries found
          <div className="w-full text-center py-20">
            <div className="flex flex-col items-center">
              <svg className="w-16 h-16 text-gray-400 mb-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3M19 19H5V5H19V19Z"/>
              </svg>
              <p className="text-gray-500 text-lg mb-2">Chưa có thư viện mới nào</p>
              <p className="text-gray-400 text-sm">Vui lòng thêm Library với isNewBook: true để hiển thị thư viện mới</p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default BookNew; 