import React, { useState, useEffect } from 'react';
import { cn } from '../../lib/utils';
import { API_URL } from '../../lib/config';

interface Book {
  _id?: string;
  generatedCode?: string;
  bookTitle: string;
  isbn: string;
  isNewBook?: boolean; // Từ library level
  isFeaturedBook?: boolean; // Từ library level
  isAudioBook?: boolean; // Từ library level
  libraryId: string;
  libraryTitle?: string;
  authors?: string[];
  category?: string;
  coverImage?: string;
  publishYear?: number;
  rating?: number;
  borrowCount?: number;
}

interface BookFeaturedProps {
  className?: string;
}

const BookFeatured: React.FC<BookFeaturedProps> = ({ className }) => {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch featured books from backend
  useEffect(() => {
    const fetchFeaturedBooks = async () => {
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
        
        const featuredBooks: Book[] = await response.json();
        setBooks(featuredBooks);
      } catch (error) {
        console.error('Error fetching featured books:', error);
        // Set empty array so UI doesn't break
        setBooks([]);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedBooks();
  }, []);

  return (
    <section className={cn(
      "w-full flex not-odd:relative",
      className
    )}>
      {/* Main Content Container */}
      <div className="flex items-start w-full pt-20 mx-20">
        {/* Left Section - 1 Book with Circle Background */}
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
          ) : books.length > 0 ? (
            // First book with special layout
            <div className="flex flex-col items-start mt-[80%] ml-[10%]">
              {/* Circle Container */}
              <div className="relative w-96 h-64 rounded-full bg-gray-100 flex items-center justify-center mb-8 group">
                {/* Book Cover */}
                <div className="relative w-[150px] h-[200px] flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                  {books[0].coverImage ? (
                    <img 
                      src={books[0].coverImage} 
                      alt={books[0].bookTitle}
                      className="w-full h-full object-cover rounded-lg shadow-2xl"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-blue-200 to-blue-300 flex items-center justify-center rounded-lg shadow-2xl">
                      <div className="text-center p-4">
                        <div className="w-16 h-20 bg-white rounded shadow-sm mx-auto mb-3"></div>
                        <div className="text-sm text-blue-800 font-medium uppercase tracking-wide leading-tight">
                          {books[0].bookTitle}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Book Information */}
              <div className="text-left ml-[10%] max-w-md">
                {/* Book Title */}
                <h3 className="text-lg font-bold uppercase text-[#002855] mb-3 leading-tight">
                  {books[0].bookTitle}
                </h3>
                
                {/* Author */}
                <p className="text-base text-[#757575] mb-4 font-medium">
                  {books[0].authors?.join(", ") || "Jason Schenker"}
                </p>
                
                {/* Description */}
                <p className="text-sm text-[#666666] mb-4 leading-relaxed">
                  Câu chuyện về bà mẹ dũng cảm bỏ phở về quê để con học cách tự lập
                </p>
                
                {/* Publication Info */}
                <p className="text-sm text-[#999999] italic">
                  Giới thiệu sách tháng {new Date().getMonth() + 1}
                </p>
              </div>
            </div>
          ) : (
            // No books found
            <div className="w-full text-center py-20">
              <div className="flex flex-col items-center">
                <svg className="w-16 h-16 text-gray-400 mb-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 17.27L18.18 21L16.54 13.97L22 9.24L14.81 8.63L12 2L9.19 8.63L2 9.24L7.46 13.97L5.82 21L12 17.27Z"/>
                </svg>
                <p className="text-gray-500 text-lg mb-2">Chưa có sách nổi bật nào</p>
                <p className="text-gray-400 text-sm">Vui lòng thêm Library với isFeaturedBook: true để hiển thị sách nổi bật</p>
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

        {/* Right Section - 2 Books with Different Heights */}
        <div className="flex-1 flex justify-start items-start pt-[10%] mr-[5%]">
          <div className="flex gap-8 items-start">
            {loading ? (
              // Loading skeleton
              <>
                {/* Short Book - Left */}
                <div className="flex flex-col items-center text-center animate-pulse">
                  <div className="relative mb-4 flex items-center justify-center">
                    {/* Gray Oval Background */}
                        <div className="absolute bg-gray-200 w-[560px] h-[360px] rounded-full"></div>
                        {/* Book Placeholder */}
                       <div className="relative z-10 w-[240px] h-[320px] bg-gray-300 rounded-lg"></div>
                  </div>
                  <div className="w-full text-center">
                    <div className="h-4 bg-gray-300 rounded w-3/4 mx-auto mb-2"></div>
                    <div className="h-3 bg-gray-300 rounded w-1/2 mx-auto mb-2"></div>
                    <div className="h-3 bg-gray-300 rounded w-1/3 mx-auto"></div>
                  </div>
                </div>
                {/* Tall Book - Right */}
                <div className="flex flex-col items-center text-center animate-pulse">
                  <div className="relative mb-4 flex items-center justify-center">
                        {/* Gray Oval Background */}
                        <div className="absolute bg-gray-200 w-[400px] h-[640px] rounded-full"></div>
                        {/* Book Placeholder */}
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
              // Always show exactly 2 books with fixed layout
              <>
                {/* Short Book - Left */}
                <div className="flex flex-col mr-10 items-center text-center group hover:scale-105 transition-transform duration-300">
                  {/* Book Cover Container with Gray Oval Background */}
                  <div className="relative mb-4 flex items-center justify-center">
                    {/* Gray Oval Background - Horizontal for short book */}
                    <div className="absolute bg-gray-200 w-[400px] h-[250px] rounded-full"></div>
                    {/* Book Cover - Double size */}
                    <div className="relative z-10 flex items-center justify-center w-[150px] h-[200px]">
                      {books.length > 1 && books[1].coverImage ? (
                        <img 
                          src={books[1].coverImage} 
                          alt={books[1].bookTitle}
                          className="w-full h-full object-cover rounded-lg shadow-xl"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-blue-200 to-blue-300 flex items-center justify-center rounded-lg shadow-xl">
                          <div className="text-center p-6">
                            <div className="w-12 h-20 bg-white rounded shadow-sm mx-auto mb-4"></div>
                            <div className="text-sm text-blue-800 font-medium uppercase tracking-wide">
                              {books.length > 1 ? books[1].bookTitle : "HARRY POTTER"}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>                           
                  </div>

                  {/* Book Info */}
                  <div className="w-[350px] text-start mt-12 -ml-10">
                    <p className="text-lg font-bold uppercase text-[#002855] mb-3 leading-tight">
                      {books.length > 1 ? books[1].bookTitle : "HARRY POTTER"}
                    </p>
                    <p className="text-base text-[#757575] mb-2">
                      {books.length > 1 ? books[1].authors?.join(", ") || "JK Rowling" : "JK Rowling"}
                    </p>
                    <p className="text-sm text-[#666666] mb-3 leading-relaxed">
                      Câu chuyện về bà mẹ dũng cảm bỏ phở về quê để con học cách tự lập
                    </p>
                    <p className="text-sm text-[#999999] italic">
                      Giới thiệu sách tháng 12
                    </p>
                  </div>
                </div>

                {/* Tall Book - Right */}
                <div className="flex flex-col items-center text-center group hover:scale-105 transition-transform duration-300">
                  {/* Book Cover Container with Gray Oval Background */}
                  <div className="relative mb-4 flex items-center justify-center">
                    {/* Gray Oval Background - Vertical for tall book */}
                    <div className="absolute bg-gray-200 w-[350px] h-[500px] rounded-[100px] -top-10"></div>
                    {/* Book Cover - Double size */}
                    <div className="relative z-10 flex items-center justify-center w-[250px] h-[333px] top-10">
                      {books.length > 2 && books[2].coverImage ? (
                        <img 
                          src={books[2].coverImage} 
                          alt={books[2].bookTitle}
                          className="w-full h-full object-cover rounded-4xl shadow-xl"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-green-200 to-green-300 flex items-center justify-center rounded-lg shadow-xl">
                          <div className="text-center p-8">
                            <div className="w-20 h-28 bg-white rounded shadow-sm mx-auto mb-4"></div>
                            <div className="text-sm text-green-800 font-medium uppercase tracking-wide">
                              {books.length > 2 ? books[2].bookTitle : "QUỐW"}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>                           
                  </div>

                  {/* Book Info */}
                  <div className="w-[350px] text-start mt-32">
                    <p className="text-lg font-bold uppercase text-[#002855] mb-3 leading-tight">
                      {books.length > 2 ? books[2].bookTitle : "QUỐW"}
                    </p>
                    <p className="text-base text-[#757575] mb-2">
                      {books.length > 2 ? books[2].authors?.join(", ") || "JK Rowling" : "JK Rowling"}
                    </p>
                    <p className="text-sm text-[#666666] mb-3 leading-relaxed">
                      Câu chuyện về bà mẹ dũng cảm bỏ phở về quê để con học cách tự lập
                    </p>
                    <p className="text-sm text-[#999999] italic">
                      Giới thiệu sách tháng 3
                    </p>
                  </div>
                </div>
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
          <h2 className="text-5xl font-extrabold text-[#002855]">SÁCH NỔI BẬT</h2>
        </div>
      </div>
    </section>
  );
};

export default BookFeatured; 