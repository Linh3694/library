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
}

interface BookNewProps {
  className?: string;
}

const BookNew: React.FC<BookNewProps> = ({ className }) => {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch new books from backend
  useEffect(() => {
    const fetchNewBooks = async () => {
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
        
        const newBooks: Book[] = await response.json();
        setBooks(newBooks);
      } catch (error) {
        console.error('Error fetching new books:', error);
        // Set empty array so UI doesn't break
        setBooks([]);
      } finally {
        setLoading(false);
      }
    };

    fetchNewBooks();
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
                <h2 className="text-5xl font-extrabold text-[#002855]">SÁCH MỚI</h2>
                <div className="ml-auto mr-20">
                <button className="text-[#F05023] font-extrabold hover:text-orange-600 transition-colors">
                    XEM THÊM
                </button>
            </div>
            </div>
         </div>
      </div>

      {/* Books Container with Curved Border */}
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
        ) : books.length > 0 ? (
          books.map((book, index) => (
            <div
              key={book.generatedCode || book._id}
              className={cn(
                "w-1/3 flex flex-col items-center text-center group relative",
                index < books.length - 1 && "border-r-2 border-[#DDDDDD]"
              )}
            >
              {/* Book Cover Container */}
              <div className="relative w-[200px] h-[266px] min-h-[266px] flex items-center justify-center">
                {/* Book Cover */}
                {book.coverImage ? (
                  <img 
                    src={book.coverImage} 
                    alt={book.bookTitle}
                    className="w-full h-full object-cover rounded-lg shadow-lg"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center rounded-lg shadow-lg">
                    <div className="text-center p-4">
                      <div className="w-16 h-20 bg-white rounded shadow-sm mx-auto mb-3"></div>
                      <div className="text-xs text-gray-600 font-medium uppercase tracking-wide">
                        {book.bookTitle}
                      </div>
                    </div>
                  </div>
                )}

                {/* Arrow Icon */}
                <div className="absolute -top-2 -right-10 bg-[#f6f6f6] rounded-full p-2 shadow text-gray-500">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </div>

                {/* New Badge - Chỉ hiển thị khi isNewBook = true */}
                {book.isNewBook && (
                  <div className="absolute top-2 left-2 bg-yellow-400 text-white text-xs font-bold px-2 py-1 rounded-full">
                    MỚI
                  </div>
                )}
              </div>

              {/* Book Info */}
              <div className="w-full text-center">
                <p className="text-sm font-bold uppercase text-[#002855] mt-2">
                  {book.bookTitle}
                </p>
                <div className="mt-12">
                  <p className="text-sm font-semibold text-[#757575]">
                    {book.authors?.join(", ") || "Chưa có tác giả"}
                  </p>
                  <p className="text-sm font-semibold text-[#757575]">
                    {book.category || "Chưa có thể loại"}
                  </p>
                  {book.publishYear && (
                    <p className="text-xs text-[#999999] mt-1">
                      Năm XB: {book.publishYear}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          // No books found
          <div className="w-full text-center py-20">
            <div className="flex flex-col items-center">
              <svg className="w-16 h-16 text-gray-400 mb-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3M19 19H5V5H19V19Z"/>
              </svg>
              <p className="text-gray-500 text-lg mb-2">Chưa có sách mới nào</p>
              <p className="text-gray-400 text-sm">Vui lòng thêm Library với isNewBook: true để hiển thị sách mới</p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default BookNew; 