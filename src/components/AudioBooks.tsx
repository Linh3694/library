import React, { useState, useEffect } from 'react';
import { cn } from '../lib/utils';
import { API_URL } from '../lib/config';

interface AudioBook {
  _id?: string;
  generatedCode?: string;
  bookTitle: string;
  isbn: string;
  isAudioBook: boolean;
  libraryId: string;
  libraryTitle?: string;
  authors?: string[];
  category?: string;
  coverImage?: string;
  publishYear?: number;
  duration?: string; // Thời lượng sách nói
  narrator?: string; // Người đọc
  rating?: number;
}

interface AudioBooksProps {
  className?: string;
}

const AudioBooks: React.FC<AudioBooksProps> = ({ className }) => {
  const [audioBooks, setAudioBooks] = useState<AudioBook[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch audio books from backend
  useEffect(() => {
    const fetchAudioBooks = async () => {
      try {
        const response = await fetch(`${API_URL}/libraries/audio-books?limit=4`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        // Check if response is actually JSON
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          throw new Error('Response is not JSON - API server may not be running or endpoint not found');
        }
        
        const books: AudioBook[] = await response.json();
        setAudioBooks(books);
      } catch (error) {
        console.error('Error fetching audio books:', error);
        // Set mock data as fallback
        setAudioBooks([
          {
            _id: '1',
            bookTitle: 'NGƯỜI DUBLIN',
            authors: ['JAMES JOYCE'],
            category: 'SỐNG VỮNG VÀNG',
            coverImage: undefined,
            duration: '8h 30m',
            narrator: 'Nguyễn Văn A',
            rating: 4.5,
            isbn: '',
            isAudioBook: true,
            libraryId: '1'
          },
          {
            _id: '2', 
            bookTitle: 'Nghệ thuật SỐNG VỮNG VÀNG',
            authors: ['BRAD STULBERG'],
            category: 'SỐNG VỮNG VÀNG',
            coverImage: undefined,
            duration: '6h 15m',
            narrator: 'Trần Thị B',
            rating: 4.8,
            isbn: '',
            isAudioBook: true,
            libraryId: '2'
          },
          {
            _id: '3',
            bookTitle: 'TỐT HƠN MỖI NGÀY',
            authors: ['QUAN VŨ'],
            category: 'TỐT HƠN MỖI NGÀY',
            coverImage: undefined,
            duration: '5h 45m',
            narrator: 'Lê Văn C',
            rating: 4.2,
            isbn: '',
            isAudioBook: true,
            libraryId: '3'
          },
          {
            _id: '4',
            bookTitle: 'ĐIỆP VIÊN HOÀN HẢO X6',
            authors: ['PHẠM XUÂN ÂN'],
            category: 'ĐIỆP VIÊN HOÀN HẢO X6',
            coverImage: undefined,
            duration: '7h 20m',
            narrator: 'Hoàng Thị D',
            rating: 4.6,
            isbn: '',
            isAudioBook: true,
            libraryId: '4'
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchAudioBooks();
  }, []);

  return (
    <section className={cn(
      "w-full min-h-screen flex items-center justify-center py-20 bg-gray-50",
      className
    )}>
      <div className="w-full max-w-7xl mx-auto px-8">
        {/* Header */}
        <div className="flex items-start gap-4 mb-[5%] ml-20">
          <div className="w-full flex flex-col items-start gap-4">
            <div className="w-full flex flex-row items-start gap-4">
              <div className="w-6 h-6 bg-[#FFCE02] rounded-full"></div>
              <div className="w-6 h-6 bg-[#BED232] rounded-full"></div>
              <div className="w-6 h-6 bg-[#FFCE02] rounded-full"></div>
            </div>
            <div className="w-full mx-auto flex items-center justify-between gap-4">
              <h2 className="text-5xl font-extrabold text-[#002855]">SÁCH NÓI</h2>
              <div className="ml-auto mr-20">
                <button className="text-[#F05023] font-extrabold hover:text-orange-600 transition-colors">
                  XEM THÊM
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Books Grid */}
        <div className="grid grid-cols-4 gap-8">
          {loading ? (
            // Loading skeleton
            Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="flex flex-col items-center animate-pulse">
                <div className="w-full aspect-[3/4] bg-gray-300 rounded-2xl mb-4"></div>
                <div className="w-full text-center space-y-2">
                  <div className="h-4 bg-gray-300 rounded w-3/4 mx-auto"></div>
                </div>
              </div>
            ))
          ) : (
            audioBooks.slice(0, 4).map((book, index) => (
              <div key={book._id || index} className="flex flex-col items-center group">
                {/* Oval Container with Cover and Title */}
                <div className="relative w-full aspect-[4/5] mb-4 cursor-pointer">
                  {/* Oval Background */}
                  <div className="absolute inset-0 bg-gray-100 rounded-full border border-gray-200"></div>
                  
                  {/* Category Badge - Top Right */}
                  <div className="absolute top-2 right-2 bg-green-100 text-green-800 text-xs font-medium px-3 py-1 rounded-full flex items-center gap-1 z-10">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    {index === 0 && "NGƯỜI DUBLIN"}
                    {index === 1 && "SỐNG VỮNG VÀNG"}  
                    {index === 2 && "TỐT HƠN MỖI NGÀY"}
                    {index === 3 && "ĐIỆP VIÊN HOÀN HẢO X6"}
                  </div>
                  
                  {/* Book Cover - Center of oval */}
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2/3 h-2/5">
                    {book.coverImage ? (
                      <img 
                        src={book.coverImage} 
                        alt={book.bookTitle}
                        className="w-full h-full object-cover rounded-lg shadow-md"
                      />
                    ) : (
                      <div className={cn(
                        "w-full h-full rounded-lg shadow-md flex flex-col items-center justify-center text-white font-bold text-center p-3 relative overflow-hidden",
                        index === 0 && "bg-[#2D5A3D]", // Xanh đậm cho NGƯỜI DUBLIN
                        index === 1 && "bg-[#1E3A5F]", // Xanh navy cho Nghệ thuật sống vững vàng
                        index === 2 && "bg-white text-black border-2 border-dotted border-gray-400", // Trắng viền chấm cho TỐT HƠN MỖI NGÀY
                        index === 3 && "bg-[#8B1538]" // Đỏ đậm cho ĐIỆP VIÊN HOÀN HẢO
                      )}>
                        {/* Background pattern for book 2 */}
                        {index === 1 && (
                          <div className="absolute inset-0 opacity-20">
                            <div className="absolute top-1 left-1 w-3 h-3 bg-yellow-400 rounded-full"></div>
                            <div className="absolute top-1/3 right-2 w-0 h-0 border-l-[8px] border-r-[8px] border-b-[14px] border-l-transparent border-r-transparent border-b-white"></div>
                          </div>
                        )}
                        
                        {/* Book content - scaled down more */}
                        <div className="relative z-10 flex flex-col items-center justify-center h-full">
                          {index === 0 && (
                            <>
                              <div className="text-lg font-black mb-1">NGƯỜI</div>
                              <div className="text-lg font-black mb-1">DUBLIN</div>
                              <div className="text-[10px] font-normal">JAMES JOYCE</div>
                            </>
                          )}
                          
                          {index === 1 && (
                            <>
                              <div className="text-[10px] mb-1">BRAD STULBERG</div>
                              <div className="text-xs font-bold mb-1">Nghệ thuật</div>
                              <div className="text-sm font-black text-yellow-400 mb-0">SỐNG</div>
                              <div className="text-sm font-black text-yellow-400">VỮNG VÀNG</div>
                              <div className="text-[8px] mt-1 opacity-75">PRACTICE OF GROUNDEDNESS</div>
                            </>
                          )}
                          
                          {index === 2 && (
                            <>
                              <div className="w-8 h-12 bg-gray-200 rounded mb-1 flex items-center justify-center">
                                <div className="w-6 h-9 bg-white rounded shadow"></div>
                              </div>
                              <div className="text-xs font-black text-black">TỐT HƠN MỖI NGÀY</div>
                              <div className="text-[10px] text-gray-600">by Quan Vũ</div>
                            </>
                          )}
                          
                          {index === 3 && (
                            <>
                              <div className="text-[10px] font-bold mb-1">PHẠM XUÂN ÂN</div>
                              <div className="text-xs font-bold mb-1">PERFECT SPY</div>
                              <div className="text-xs font-black mb-1">ĐIỆP VIÊN</div>
                              <div className="text-xs font-black mb-1">HOÀN HẢO</div>
                              <div className="text-2xl font-black text-blue-300">X6</div>
                            </>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Book Title - Bottom of oval */}
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-4/5 text-center">
                    <p className="text-xs font-bold uppercase text-[#002855] leading-tight px-2">
                      {book.bookTitle}
                    </p>
                  </div>

                  {/* Play Button Overlay */}
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 rounded-full flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white rounded-full p-2 shadow-lg">
                      <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z"/>
                      </svg>
                    </div>
                  </div>

                  {/* Micro Icon - Top Left */}
                  <div className="absolute top-2 left-2 bg-green-500 text-white rounded-full p-1.5 shadow-md z-10">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C13.1 2 14 2.9 14 4V10C14 11.1 13.1 12 12 12C10.9 12 10 11.1 10 10V4C10 2.9 10.9 2 12 2M19 10V12C19 15.3 16.3 18 13 18V20H11V18C7.7 18 5 15.3 5 12V10H7V12C7 14.2 8.8 16 11 16H13C15.2 16 17 14.2 17 12V10H19Z"/>
                    </svg>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
};

export default AudioBooks; 