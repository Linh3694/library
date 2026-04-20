import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn, createSlug, getImageUrl } from '../../lib/utils';
import { libraryAPI, type Library } from '../../lib/api';

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
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Fetch new libraries from backend
  useEffect(() => {
    const fetchNewLibraries = async () => {
      try {
        const books = await libraryAPI.getNewBooks(4);

        // Group books theo libraryId để tạo unique libraries
        const libraryMap = new Map<string, NewLibrary>();

        books.forEach((book: Library) => {
          const libraryId = book.libraryId || book._id;
          if (!libraryMap.has(libraryId)) {
            libraryMap.set(libraryId, {
              _id: libraryId,
              libraryCode: book.libraryCode,
              title: book.libraryTitle || book.bookTitle || book.title || 'Chưa có tên', // Fallback chain
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

  const handleScroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const scrollAmount = container.clientWidth * 0.8; // Scroll 80% of container width
      container.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section className={cn(
      "w-full bg-background relative py-12 lg:py-32 overflow-hidden",
      className
    )}>
      <div className="max-w-[1600px] mx-auto w-full px-4 md:px-8 2xl:px-0 flex flex-col">
        <div className="flex flex-col items-start gap-2 mb-8 lg:mb-12">
          <div className="w-full flex items-start">
            <div className="w-6 h-6 bg-amber rounded-full"></div>
          </div>
          <div className="w-full flex items-center justify-between">
            <h2 className="text-[32px] md:text-4xl lg:text-5xl font-extrabold text-oxford leading-none">SÁCH MỚI</h2>
            <Link
              to="/library?filter=new"
              className="text-red-orange font-extrabold hover:text-orange-600 transition-colors text-sm md:text-base"
            >
              XEM THÊM
            </Link>
          </div>
        </div>
      </div>

      {/* Libraries Container with Curved Border on Desktop, Scrollable on Mobile */}
      <div className="w-full relative lg:h-[600px] flex items-center">
        {/* Grey Box Border - Full Width Decorative Background */}
        <div className="absolute 2xl:left-[calc((100vw-1600px)*0.35)] lg:left-8 left-4 right-0 top-0 bottom-0 pointer-events-none lg:border-l-2 lg:border-y-2 lg:border-light-gray lg:rounded-l-full hidden lg:block"></div>
        <div className="max-w-[1600px] mx-auto w-full lg:px-8 2xl:px-0 h-full flex items-center relative z-10">
          <div
            ref={scrollContainerRef}
            className="w-full h-full flex items-center gap-6 lg:gap-0 flex-nowrap overflow-x-auto lg:overflow-x-visible snap-x snap-mandatory hide-scrollbar pb-8 lg:pb-0 px-[7.5vw] lg:px-0"
          >
            {loading ? (
              // Loading skeleton
              Array.from({ length: 4 }).map((_, index) => (
                <div
                  key={index}
                  className="w-[85vw] min-w-[85vw] md:w-1/2 lg:w-1/3 xl:w-1/4 lg:min-w-0 lg:h-full lg:justify-center flex flex-col items-center text-center group relative animate-pulse snap-center shrink-0"
                >
                  <div className="relative w-[200px] h-[266px] min-h-[266px] flex items-center justify-center">
                    <div className="w-full h-full bg-gray-300 rounded-lg"></div>
                  </div>
                  <div className="w-full text-center mt-2">
                    <div className="h-4 bg-gray-300 rounded w-3/4 mx-auto mb-12"></div>
                    <div className="h-3 bg-gray-300 rounded w-1/2 mx-auto mb-2"></div>
                    <div className="h-3 bg-gray-300 rounded w-1/3 mx-auto"></div>
                  </div>
                  {/* Divider Line */}
                  {index < 3 && (
                    <div className={cn(
                      "absolute right-0 top-1/2 -translate-y-1/2 w-[1px] h-[80%] bg-light-gray hidden",
                      index === 0 && "lg:block",
                      index === 1 && "lg:block",
                      index === 2 && "lg:block"
                    )}></div>
                  )}
                </div>
              ))
            ) : newLibraries.length > 0 ? (
              newLibraries.map((library, index) => (
                <div
                  key={library._id || index}
                  className="w-[85vw] min-w-[85vw] md:w-1/2 lg:w-1/3 xl:w-1/4 lg:min-w-0 lg:h-full lg:justify-center flex flex-col items-center text-center group relative snap-center shrink-0 pt-12 md:pt-16 lg:pt-0"
                >
                  {/* Divider Line */}
                  {index < newLibraries.length - 1 && index < 3 && (
                    <div className={cn(
                      "absolute right-0 top-1/2 -translate-y-1/2 w-[1px] h-[80%] bg-light-gray hidden lg:block"
                    )}></div>
                  )}
                  {/* Library Cover Container */}
                  <Link
                    to={`/library/book/${createSlug(library.title)}`}
                    className="relative w-[240px] h-[320px] md:w-[280px] md:h-[373px] lg:w-[200px] lg:h-[266px] flex items-center justify-center hover:scale-105 transition-transform duration-300">
                    {/* Library Cover */}
                    {library.coverImage ? (
                      <img
                        src={getImageUrl(library.coverImage)}
                        alt={library.title}
                        className="w-full h-full object-cover border border-medium-gray rounded-[2px]"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center border border-light-gray rounded-[2px] shadow-sm">
                        <div className="text-center p-4">
                          <div className="w-16 h-20 bg-white rounded shadow-sm mx-auto mb-3"></div>
                          <div className="text-xs text-gray-600 font-medium uppercase tracking-wide">
                            {library.title}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Arrow Icon */}
                    <div className="absolute w-[40px] h-[40px] md:w-[50px] md:h-[50px] xl:w-[60px] xl:h-[60px] -top-[15px] md:-top-[25px] xl:-top-[30px] -right-4 md:-right-10 xl:-right-[84px] bg-semi-white rounded-full text-gray-500 flex items-center justify-center shadow-sm">
                      <ArrowUpRight className="w-4 h-4 md:w-5 md:h-5 xl:w-6 xl:h-6" />
                    </div>

                    {/* New Badge - Chỉ hiển thị khi isNewBook = true */}
                    {library.isNewBook && (
                      <div className="absolute top-2 left-2 bg-yellow-400 text-white text-xs font-bold px-2 py-1 rounded-full">
                        MỚI
                      </div>
                    )}


                  </Link>

                  {/* Library Info */}
                  <div className="w-full text-center pt-8">
                    <p className="text-base font-bold uppercase text-oxford line-clamp-1">
                      {library.title}
                    </p>
                    <div className="mt-8 hidden lg:block">
                      <p className="text-sm font-semibold text-dark-gray">
                        {library.authors?.join(", ") || "Chưa có thông tin tác giả"}
                      </p>
                      <p className="text-sm font-semibold text-dark-gray">
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
                    <path d="M19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3M19 19H5V5H19V19Z" />
                  </svg>
                  <p className="text-gray-500 text-lg mb-2">Chưa có thư viện mới nào</p>
                  <p className="text-gray-400 text-sm">Vui lòng thêm Library với isNewBook: true để hiển thị thư viện mới</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Navigation Buttons for Mobile/Tablet */}
      <div className="flex lg:hidden items-center justify-center gap-4 mt-8">
        <button
          onClick={() => handleScroll('left')}
          className="w-14 h-14 rounded-full border border-gray-100 flex items-center justify-center bg-white shadow-sm active:bg-gray-50 transition-colors"
          aria-label="Previous"
        >
          <ChevronLeft className="w-6 h-6 text-oxford" />
        </button>
        <button
          onClick={() => handleScroll('right')}
          className="w-14 h-14 rounded-full border border-gray-100 flex items-center justify-center bg-white shadow-sm active:bg-gray-50 transition-colors"
          aria-label="Next"
        >
          <ChevronRight className="w-6 h-6 text-oxford" />
        </button>
      </div>
    </section>
  );
};

export default BookNew; 