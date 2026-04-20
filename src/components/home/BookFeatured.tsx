import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { cn, createSlug, getImageUrl } from '../../lib/utils';
import { libraryAPI, type BookIntroduction } from '../../lib/api';

interface BookFeaturedProps {
  className?: string;
}

const BookFeatured: React.FC<BookFeaturedProps> = ({ className }) => {
  const navigate = useNavigate();
  const [introductions, setIntroductions] = useState<BookIntroduction[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch book introductions from backend
  useEffect(() => {
    const fetchIntroductions = async () => {
      try {
        // Fetch latest 3 introductions (not just featured)
        const response = await libraryAPI.getBookIntroductions(1, 3, false);
        setIntroductions(response.introductions || []);
      } catch (error) {
        console.error('Error fetching book introductions:', error);
        setIntroductions([]);
      } finally {
        setLoading(false);
      }
    };

    fetchIntroductions();
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
            </div>
          </div>
          <div className="w-full flex items-center justify-between gap-4">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-oxford leading-tight lg:leading-relaxed transition-all duration-300">GIỚI THIỆU SÁCH</h2>
            <div className="ml-auto">
              <Link
                to="/library?filter=featured"
                className="text-red-orange font-extrabold hover:text-orange-600 transition-colors text-sm md:text-base"
              >
                XEM THÊM
              </Link>
            </div>
          </div>
        </div>

        {/* Grid Layout Section */}
        <div className="w-full">
          <div className="flex flex-col md:grid md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-6 lg:gap-10">
            {loading ? (
              // Loading skeleton matching the grid layout
              Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="flex flex-col items-center animate-pulse">
                  <div className="w-full aspect-[4/5] bg-gray-100 rounded-4xl"></div>
                </div>
              ))
            ) : introductions.length > 0 ? (
              <>
                {/* Box 1: Book Intro 1 */}
                {introductions[0] && (
                  <div className="flex flex-col items-center group transition-all pt-0 md:pt-8 lg:pt-[240px]">
                    <Link
                      to={`/book-introductions/${introductions[0].slug}`}
                      className="w-full"
                    >
                      <div className="aspect-[380/260] w-full bg-semi-white rounded-[130px] relative overflow-hidden group/box">
                        {/* Image Layer */}
                        <div className="absolute inset-0 flex items-center justify-center transition-all duration-500 ease-in-out group-hover/box:opacity-0 group-hover/box:-translate-y-4 z-10">
                          {introductions[0].relatedBook?.cover_image ? (
                            <img
                              src={getImageUrl(introductions[0].relatedBook.cover_image)}
                              alt={introductions[0].title}
                              className="w-[42%] h-[84%] object-cover rounded-[2px] border border-light-gray"
                            />
                          ) : (
                            <div className="w-[42%] h-[84%] bg-gray-200 rounded-[2px] flex items-center justify-center text-[12px] text-gray-500 p-2 text-center">
                              {introductions[0].title}
                            </div>
                          )}
                        </div>

                        {/* Hover Content Layer */}
                        <div className="absolute inset-0 px-8 py-10 flex items-center justify-center opacity-0 translate-y-12 group-hover/box:opacity-100 group-hover/box:translate-y-0 transition-all duration-500 ease-in-out z-20">
                          <p className="text-sm text-dark-gray leading-relaxed line-clamp-[6] text-center w-full">
                            {introductions[0].content || introductions[0].description}
                          </p>
                        </div>
                      </div>
                      <div className="mt-8 px-[10%]">
                        <h3 className="text-base font-bold text-oxford uppercase line-clamp-2 leading-tight mb-2">
                          {introductions[0].title}
                        </h3>
                        <p className="text-base text-dark-gray font-semibold mb-10 line-clamp-1">
                          {introductions[0].relatedBook?.authors?.join(", ") || "Chưa rõ tác giả"}
                        </p>
                        <p className="text-base text-dark-gray font-bold italic opacity-80">
                          {introductions[0].description}
                        </p>
                      </div>
                    </Link>
                  </div>
                )}

                {/* Box 2: Discovery Circle */}
                <div className="flex flex-col items-center pt-8 lg:pt-[110px]">
                  <div
                    className="relative w-full aspect-square rounded-full border-[3px] border-red-orange flex items-center justify-center bg-background duration-300 group cursor-pointer hover:bg-red-orange transition-colors"
                    onClick={() => navigate('/library?filter=featured')}
                  >
                    <div className="relative flex items-center justify-center transition-all duration-500 ease-out group-hover:scale-110">
                      <span className="text-4xl font-black text-red-orange uppercase z-10 transition-all duration-500 group-hover:text-white group-hover:-translate-x-5">
                        Khám phá
                      </span>
                      <div className="absolute top-1/2 -translate-y-1/2 left-full pl-2 opacity-0 -translate-x-10 transition-all duration-500 ease-out flex items-center group-hover:-translate-x-5 group-hover:opacity-100">
                        <ArrowUpRight className="w-8 h-8 text-white transition-transform duration-500 ease-out" />
                      </div>
                    </div>
                    <div className="absolute w-[60px] h-[60px] -top-[30px] right-0 bg-semi-white rounded-full text-gray-500 flex items-center justify-center transition-all duration-500 ease-in-out group-hover:opacity-0 group-hover:scale-0 group-hover:translate-x-4 group-hover:-translate-y-4 pointer-events-none">
                      <ArrowUpRight className="w-6 h-6" />
                    </div>
                  </div>
                </div>

                {/* Box 3: Book Intro 2 */}
                {introductions[1] && (
                  <div className="flex flex-col items-center group transition-all">
                    <Link
                      to={`/book-introductions/${introductions[1].slug}`}
                      className="w-full"
                    >
                      <div className="aspect-[380/260] w-full bg-semi-white rounded-[130px] relative overflow-hidden group/box">
                        {/* Image Layer */}
                        <div className="absolute inset-0 flex items-center justify-center transition-all duration-500 ease-in-out group-hover/box:opacity-0 group-hover/box:-translate-y-4 z-10">
                          {introductions[1].relatedBook?.cover_image ? (
                            <img
                              src={getImageUrl(introductions[1].relatedBook.cover_image)}
                              alt={introductions[1].title}
                              className="w-[42%] h-[84%] object-cover rounded-[2px] border border-ligh-gray"
                            />
                          ) : (
                            <div className="w-[42%] h-[84%] bg-gray-200 rounded-[2px] flex items-center justify-center text-[12px] text-gray-500 p-2 text-center">
                              {introductions[1].title}
                            </div>
                          )}
                        </div>

                        {/* Hover Content Layer */}
                        <div className="absolute inset-0 px-8 py-10 flex items-center justify-center opacity-0 translate-y-12 group-hover/box:opacity-100 group-hover/box:translate-y-0 transition-all duration-500 ease-in-out z-20">
                          <p className="text-sm text-dark-gray leading-relaxed line-clamp-[6] text-center w-full">
                            {introductions[1].content || introductions[1].description}
                          </p>
                        </div>
                      </div>
                      <div className="mt-8 px-[10%]">
                        <h3 className="text-base font-bold text-oxford uppercase line-clamp-2 leading-tight mb-2">
                          {introductions[1].title}
                        </h3>
                        <p className="text-base text-dark-gray font-semibold mb-10 line-clamp-1">
                          {introductions[1].relatedBook?.authors?.join(", ") || "Chưa rõ tác giả"}
                        </p>
                        <p className="text-base text-dark-gray font-bold italic opacity-80">
                          {introductions[1].description}
                        </p>
                      </div>
                    </Link>
                  </div>
                )}

                {/* Box 4: Book Intro 3 */}
                {introductions[2] && (
                  <div className="flex flex-col items-center group transition-all">
                    <Link
                      to={`/book-introductions/${introductions[2].slug}`}
                      className="w-full"
                    >
                      <div className="aspect-[380/640] w-full bg-semi-white rounded-[130px] relative overflow-hidden group/box">
                        {/* Image Layer */}
                        <div className="absolute inset-0 flex items-center justify-center transition-all duration-500 ease-in-out group-hover/box:opacity-0 group-hover/box:-translate-y-4 z-10">
                          {introductions[2].relatedBook?.cover_image ? (
                            <img
                              src={getImageUrl(introductions[2].relatedBook.cover_image)}
                              alt={introductions[2].title}
                              className="w-[73%] h-[59%] object-cover rounded-[2px] border border-light-gray"
                            />
                          ) : (
                            <div className="w-[73%] h-[59%] bg-gray-200 rounded-[2px] flex items-center justify-center text-[12px] text-gray-500 p-4 text-center">
                              {introductions[2].title}
                            </div>
                          )}
                        </div>

                        {/* Hover Content Layer */}
                        <div className="absolute inset-0 px-8 py-16 flex items-center justify-center opacity-0 translate-y-16 group-hover/box:opacity-100 group-hover/box:translate-y-0 transition-all duration-500 ease-in-out z-20">
                          <p className="text-sm text-dark-gray leading-relaxed line-clamp-[15] text-center w-full">
                            {introductions[2].content || introductions[2].description}
                          </p>
                        </div>
                      </div>
                      <div className="mt-8 px-[10%]">
                        <h3 className="text-base font-bold text-oxford uppercase line-clamp-2 leading-tight mb-2">
                          {introductions[2].title}
                        </h3>
                        <p className="text-base text-dark-gray font-semibold mb-10 line-clamp-1">
                          {introductions[2].relatedBook?.authors?.join(", ") || "Chưa rõ tác giả"}
                        </p>
                        <p className="text-base text-dark-gray font-bold italic opacity-80">
                          {introductions[2].description}
                        </p>
                      </div>
                    </Link>
                  </div>
                )}
              </>
            ) : (
              // No introductions found state
              <div className="col-span-4 text-center py-20">
                <div className="flex flex-col items-center">
                  <svg className="w-16 h-16 text-gray-400 mb-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3M19 19H5V5H19V19Z" />
                  </svg>
                  <p className="text-gray-500 text-lg mb-2">Chưa có bài giới thiệu sách nào</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default BookFeatured;
