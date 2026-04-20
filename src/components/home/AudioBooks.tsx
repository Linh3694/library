import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { cn } from '../../lib/utils';
import { createSlug, getImageUrl } from '../../lib/utils';
import { libraryAPI, type Library } from '../../lib/api';

interface AudioLibrary {
  _id?: string;
  libraryCode?: string;
  title: string; // Library title
  authors?: string[];
  category?: string;
  coverImage?: string;
  isAudioBook: boolean;
  isNewBook?: boolean;
  isFeaturedBook?: boolean;
  // Thông tin bổ sung từ books trong library
  totalBooks?: number;
  averageRating?: number;
  totalBorrowCount?: number;
}

interface AudioBooksProps {
  className?: string;
}

const AudioBooks: React.FC<AudioBooksProps> = ({ className }) => {
  const [audioLibraries, setAudioLibraries] = useState<AudioLibrary[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch audio libraries from backend
  useEffect(() => {
    const fetchAudioLibraries = async () => {
      try {
        const libraries = await libraryAPI.getAudioBooks(4);

        // Chuyển đổi libraries sang format của AudioLibrary interface
        const audioLibrariesData = libraries.map((library: Library) => ({
          _id: library._id || library.libraryId,
          libraryCode: library.libraryCode,
          title: library.title,
          authors: library.authors,
          category: library.category,
          coverImage: library.coverImage,
          isAudioBook: library.isAudioBook,
          isNewBook: library.isNewBook,
          isFeaturedBook: library.isFeaturedBook,
          totalBooks: library.totalBooks || 0,
          averageRating: library.rating || 0,
          totalBorrowCount: library.borrowCount || 0
        }));

        setAudioLibraries(audioLibrariesData);

      } catch (error) {
        console.error('Error fetching audio libraries:', error);
        // Set empty array when API fails
        setAudioLibraries([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAudioLibraries();
  }, []);

  return (
    <section className={cn(
      "w-full bg-background relative max-w-[1920px] mx-auto py-12 lg:py-32",
      className
    )}>
      <div className="max-w-[1600px] mx-auto w-full px-4 md:px-8 2xl:px-0 flex flex-col">
        {/* Header */}
        <div className="flex flex-col items-start gap-4 mb-8 lg:mb-12">
          <div className="w-full flex items-start gap-4">
            <div className="flex items-center gap-4 transition-all duration-300">
              <div className="w-6 h-6 bg-amber rounded-full"></div>
              <div className="w-6 h-6 bg-lime rounded-full"></div>
              <div className="w-6 h-6 bg-amber rounded-full"></div>
            </div>
          </div>
          <div className="w-full flex items-center justify-between gap-4">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-oxford leading-tight lg:leading-relaxed transition-all duration-300">SÁCH NÓI</h2>
            <div className="ml-auto">
              <Link
                to="/library?filter=audio"
                className="text-red-orange font-extrabold hover:text-orange-600 transition-colors text-sm md:text-base"
              >
                XEM THÊM
              </Link>
            </div>
          </div>
        </div>

        {/* Libraries Grid / Mobile Swipeable Flex */}
        <div className="flex flex-nowrap overflow-x-auto snap-x snap-mandatory scrollbar-none md:grid md:grid-cols-2 lg:grid-cols-4 md:overflow-x-visible md:snap-none gap-4 md:gap-6 lg:gap-8 pb-4 md:pb-0">
          {loading ? (
            // Loading skeleton
            Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="flex flex-col items-center animate-pulse w-[85vw] flex-shrink-0 snap-center md:w-auto md:flex-none md:snap-align-none">
                <div className="w-full aspect-[4/5] bg-semi-white rounded-full mb-4"></div>
              </div>
            ))
          ) : audioLibraries.length > 0 ? (
            audioLibraries.slice(0, 4).map((library, index) => (
              <div key={library._id || index} className="flex flex-col items-center group w-[85vw] flex-shrink-0 snap-center md:w-auto md:flex-none md:snap-align-none transition-all duration-300 ease-out">
                {/* Oval Container with Cover and Title */}
                <Link
                  to={`/library/book/${createSlug(library.title)}`}
                  className="relative w-full aspect-[4/5] mb-4 cursor-pointer hover:scale-105 transition-transform duration-300">
                  {/* Oval Background */}
                  <div className="absolute inset-0 bg-semi-white rounded-4xl"></div>
                  {/* Positions 1 and 3 (index 0,2): Title at bottom + Headphone icon */}
                  {(index === 0 || index === 2) && (
                    <>
                      {/* Library Cover - Large with border */}
                      <div className="absolute top-[8%] left-1/2 transform -translate-x-1/2 w-[70%] h-[73%]">
                        {library.coverImage ? (
                          <>
                            <img
                              src={getImageUrl(library.coverImage)}
                              alt={library.title}
                              className="w-full h-full object-cover rounded-[40px]"
                            />
                            <div className="absolute inset-0 rounded-[40px] border-4 border-white/80 pointer-events-none"></div>
                          </>
                        ) : (
                          <div className="w-full h-full rounded-4xl shadow-lg border-2 border-white flex flex-col items-center justify-center text-white font-bold relative py-8 px-4 md:px-8 bg-background overflow-hidden bg-gradient-to-br from-green-500 to-green-600">
                            <div className="text-center">
                              <div className="text-base font-bold uppercase">
                                {library.title}
                              </div>
                              {library.totalBooks && (
                                <div className="text-sm mt-2 opacity-90">
                                  {library.totalBooks} quyển
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Title and Micro Icon - Bottom */}
                      <div className="absolute bottom-[5%] left-[10%] w-[80%] text-start">
                        <div className="inline-flex items-start justify-start text-oxford font-medium px-3 py-1 rounded-full">
                          <img
                            src="/micro.svg"
                            alt="Micro"
                            className="w-8 h-8 mr-2 flex-shrink-0"
                          />
                          <span className="font-bold uppercase text-base break-words whitespace-normal leading-tight">{library.title}</span>
                        </div>
                      </div>
                    </>
                  )}

                  {/* Positions 2 and 4 (index 1,3): Title at top */}
                  {(index === 1 || index === 3) && (
                    <>
                      {/* Library Title - Top of oval */}
                      <div className="absolute top-[5%] left-[10%] w-[80%] text-start">
                        <div className="inline-flex items-start justify-start text-oxford font-medium px-3 py-1 rounded-full">
                          <img
                            src="/micro.svg"
                            alt="Micro"
                            className="w-8 h-8 mr-2 flex-shrink-0"
                          />
                          <span className="font-bold uppercase text-base break-words whitespace-normal leading-tight">{library.title}</span>
                        </div>
                      </div>

                      {/* Library Cover - Lower center of oval */}
                      <div className="absolute top-[15%] left-1/2 transform -translate-x-1/2 w-[70%] h-[75%]">
                        {library.coverImage ? (
                          <>
                            <img
                              src={getImageUrl(library.coverImage)}
                              alt={library.title}
                              className="w-full h-full object-cover rounded-[40px]"
                            />
                            <div className="absolute inset-0 rounded-[40px] border-4 border-white/80 pointer-events-none"></div>
                          </>
                        ) : (
                          <div className="w-full h-full rounded-4xl shadow-md flex flex-col items-center justify-center text-white font-bold text-center p-3 relative overflow-hidden bg-gradient-to-br from-blue-500 to-blue-600">
                            <div className="text-center">
                              <div className="text-xs font-bold uppercase leading-tight">
                                {library.title}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </>
                  )}

                  {/* Library Stats Overlay */}

                </Link>
              </div>
            ))
          ) : (
            // No audio libraries found
            <div className="col-span-4 text-center py-20">
              <div className="flex flex-col items-center">
                <svg className="w-16 h-16 text-gray-400 mb-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C13.1 2 14 2.9 14 4V10C14 11.1 13.1 12 12 12C10.9 12 10 11.1 10 10V4C10 2.9 10.9 2 12 2M19 10V12C19 15.3 16.3 18 13 18V20H11V18C7.7 18 5 15.3 5 12V10H7V12C7 14.2 8.8 16 11 16H13C15.2 16 17 14.2 17 12V10H19Z" />
                </svg>
                <p className="text-gray-500 text-lg mb-2">Chưa có thư viện sách nói nào</p>
                <p className="text-gray-400 text-sm">Vui lòng thêm Library với isAudioBook: true để hiển thị thư viện sách nói</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default AudioBooks; 