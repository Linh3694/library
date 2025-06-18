import React, { useState, useEffect } from 'react';
import { cn } from '../../lib/utils';
import { API_URL } from '../../lib/config';

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
        // Set empty array when API fails
        setAudioBooks([]);
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
      <div className="w-full mx-20">
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
        <div className="grid grid-cols-4 gap-8 mx-20">
          {loading ? (
            // Loading skeleton
            Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="flex flex-col items-center animate-pulse">
                <div className="w-full aspect-[4/5] bg-[#f6f6f6] rounded-full mb-4"></div>
              </div>
            ))
          ) : audioBooks.length > 0 ? (
            audioBooks.slice(0, 4).map((book, index) => (
              <div key={book._id || index} className="flex flex-col items-center group">
                {/* Oval Container with Cover and Title */}
                <div className="relative w-full aspect-[4/5] mb-4 cursor-pointer">
                  {/* Oval Background */}
                  <div className="absolute inset-0 bg-[#f6f6f6] rounded-4xl"></div>
                  {/* Positions 1 and 3 (index 0,2): Title at bottom + Headphone icon */}
                  {(index === 0 || index === 2) && (
                    <>
                      {/* Book Cover - Large with border */}
                      <div className="absolute top-[8%] left-1/2 transform -translate-x-1/2 w-[70%] h-[70%]">
                        {book.coverImage ? (
                          <img 
                            src={book.coverImage} 
                            alt={book.bookTitle}
                            className="w-full h-full object-cover rounded-2xl shadow-lg border-2 border-white"
                          />
                        ) : (
                          <div className="w-full h-full rounded-4xl shadow-lg border-2 border-white flex flex-col items-center justify-center text-white font-bold text-center p-4 relative overflow-hidden bg-gradient-to-br from-green-500 to-green-600">
                            <div className="text-center">
                              <div className="text-lg font-bold uppercase leading-tight">
                                {book.bookTitle}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Title and Micro Icon - Bottom */}
                      <div className="absolute bottom-[5%] left-[10%] w-full text-start">
                        <div className="inline-flex items-center justify-center  text-[#002855] font-medium px-3 py-1 rounded-full">
                          <img 
                            src="/micro.svg" 
                            alt="Micro" 
                            className="w-10 h-10 mr-2"
                          />
                          <span className="font-bold uppercase text-xl">{book.bookTitle}</span>
                        </div>
                      </div>
                    </>
                  )}

                  {/* Positions 2 and 4 (index 1,3): Title at top */}
                  {(index === 1 || index === 3) && (
                    <>
                      {/* Book Title - Top of oval */}
                       <div className="absolute top-[5%] left-[10%] w-full text-start">
                        <div className="inline-flex items-center justify-start  text-[#002855] font-medium px-3 py-1 rounded-full">
                          <img 
                            src="/micro.svg" 
                            alt="Micro" 
                            className="w-10 h-10 mr-2"
                          />
                          <span className="font-bold uppercase text-xl">{book.bookTitle}</span>
                        </div>
                      </div>

                      {/* Book Cover - Lower center of oval */}
                      <div className="absolute top-[22%] left-1/2 transform -translate-x-1/2 w-[70%] h-[70%]">
                        {book.coverImage ? (
                          <img 
                            src={book.coverImage} 
                            alt={book.bookTitle}
                            className="w-full h-full object-cover rounded-4xl shadow-lg border-2 border-white"
                          />
                        ) : (
                          <div className="w-full h-full rounded-4xl shadow-md flex flex-col items-center justify-center text-white font-bold text-center p-3 relative overflow-hidden bg-gradient-to-br from-blue-500 to-blue-600">
                            <div className="text-center">
                              <div className="text-xs font-bold uppercase leading-tight">
                                {book.bookTitle}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </div>
              </div>
            ))
          ) : (
            // No audio books found
            <div className="col-span-4 text-center py-20">
              <div className="flex flex-col items-center">
                <svg className="w-16 h-16 text-gray-400 mb-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C13.1 2 14 2.9 14 4V10C14 11.1 13.1 12 12 12C10.9 12 10 11.1 10 10V4C10 2.9 10.9 2 12 2M19 10V12C19 15.3 16.3 18 13 18V20H11V18C7.7 18 5 15.3 5 12V10H7V12C7 14.2 8.8 16 11 16H13C15.2 16 17 14.2 17 12V10H19Z"/>
                </svg>
                <p className="text-gray-500 text-lg mb-2">Chưa có sách nói nào</p>
                <p className="text-gray-400 text-sm">Vui lòng thêm sách với isAudioBook: true trong database</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default AudioBooks; 