import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
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
import { publicLibraryService, type PublicBookIntroduction, type BookIntroductionsApiResponse } from '../../services/publicLibraryService';
import { type StandardApiResponse } from '../../lib/api';
import { getImageUrl } from '../../lib/utils';

const BookIntroductionsHomePage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [featuredIntros, setFeaturedIntros] = useState<PublicBookIntroduction[]>([]);
  const [normalIntros, setNormalIntros] = useState<PublicBookIntroduction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(1);

  const introsPerPage = 9;

  // Fetch introductions
  useEffect(() => {
    const fetchIntroductions = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch featured và normal cùng lúc
        const [featuredRes, normalRes] = await Promise.all([
          publicLibraryService.getFeaturedIntroductions(3),
          publicLibraryService.getBookIntroductions(currentPage, introsPerPage, false),
        ]);

        // Featured introductions
        if (featuredRes.success && featuredRes.data) {
          setFeaturedIntros(featuredRes.data.introductions || []);
        }

        // Normal introductions
        if (normalRes.success && normalRes.data) {
          const allIntros = normalRes.data.introductions || [];
          // Filter ra các intro không phải featured
          const nonFeatured = allIntros.filter(intro => !intro.isFeatured);
          setNormalIntros(nonFeatured);
          setTotalPages(normalRes.data.totalPages || 1);
        }
      } catch (err) {
        console.error('Error fetching introductions:', err);
        setError(err instanceof Error ? err.message : 'Không thể tải danh sách giới thiệu sách');
        setFeaturedIntros([]);
        setNormalIntros([]);
      } finally {
        setLoading(false);
      }
    };

    fetchIntroductions();
  }, [currentPage]);

  // Format date
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('vi-VN');
    } catch {
      return dateString;
    }
  };

  // Intro Card Component
  const IntroCard = ({ intro, featured = false }: { intro: PublicBookIntroduction; featured?: boolean }) => (
    <Link
      to={`/book-introductions/${intro.slug}`}
      className={`group block bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 ${
        featured ? 'h-full' : ''
      }`}
    >
      {/* Book Cover */}
      <div className={`relative overflow-hidden ${featured ? 'h-64' : 'h-48'}`}>
        {intro.relatedBook?.coverImage ? (
          <img
            src={getImageUrl(intro.relatedBook.coverImage) || intro.relatedBook.coverImage}
            alt={intro.relatedBook.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <svg className="w-16 h-16 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
        )}
        {/* Featured Badge */}
        {featured && (
          <div className="absolute top-3 right-3 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold">
            Nổi bật
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className={`font-bold text-[#002855] mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors ${
          featured ? 'text-xl' : 'text-lg'
        }`}>
          {intro.title}
        </h3>
        
        {/* Related Book Info */}
        {intro.relatedBook && (
          <div className="mb-3">
            <p className="text-sm text-gray-600 font-medium">{intro.relatedBook.title}</p>
            {intro.relatedBook.authors && intro.relatedBook.authors.length > 0 && (
              <p className="text-xs text-gray-500">
                {intro.relatedBook.authors.join(', ')}
              </p>
            )}
          </div>
        )}

        <p className={`text-gray-600 mb-3 ${featured ? 'line-clamp-3' : 'line-clamp-2'}`}>
          {intro.description}
        </p>

        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>{formatDate(intro.modifiedAt)}</span>
          <span className="text-blue-600 font-medium group-hover:underline">Đọc thêm →</span>
        </div>
      </div>
    </Link>
  );

  return (
    <div className="min-h-screen ">
      <div className="sticky top-0 z-10">
        <Header />
      </div>

      {/* Main Content */}
      <div className="mx-[7%] px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Trang chủ</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Giới thiệu sách</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>


        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#002855] mx-auto mb-4"></div>
            <p className="text-gray-500">Đang tải...</p>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-500">{error}</p>
          </div>
        ) : (
          <>
            {/* Featured Section - Carousel Style */}
            {featuredIntros.length > 0 && (
              <div className="mb-16">
                <div className="relative flex items-center justify-center gap-4">
                  {featuredIntros.map((intro, index) => {
                    const isCenter = index === 1 && featuredIntros.length === 3;
                    return (
                      <div key={intro.id} className={`flex items-center ${isCenter ? 'h-[654px]' : 'h-[559px]'}`}>
                        <Link
                          to={`/book-introductions/${intro.slug}`}
                          className={`group relative bg-white rounded-[96px] border border-gray-300 ${
                            isCenter 
                              ? 'w-[780px] h-[574px] scale-100 overflow-visible' 
                              : 'w-[370px] h-[559px] scale-95 opacity-100 overflow-hidden mt-32'
                          }`}
                        >
                        {/* Content */}
                        <div className="relative h-full flex flex-col">

                          {/* Middle Content */}
                          <div className="flex-1 flex flex-col justify-center space-y-6 mb-6 px-10">
                            {/* Tiêu đề */}
                            <h3 className={`font-bold text-[#002855] uppercase ${
                              isCenter ? 'text-2xl' : 'text-xl'
                            }`}>
                              {intro.title}
                            </h3>
                            
                            {/* Tác giả */}
                            {intro.relatedBook && intro.relatedBook.authors && intro.relatedBook.authors.length > 0 && (
                              <p className="text-[#757575] font-medium text-sm">
                                {intro.relatedBook.authors.join(', ')}
                              </p>
                            )}

                        
                            
                            <p className={`text-[#757575] ${
                              isCenter ? 'line-clamp-4 text-base' : 'line-clamp-3 text-sm'
                            }`}>
                              {intro.content}
                            </p>

                                {/* Nội dung mô tả */}
                            <p className="text-[#757575] text-sm font-bold font-italic" style={{ fontStyle: 'italic' }}>
                              {intro.description}
                            </p>

                          </div>

                          {/* Bottom - Book Cover */}
                          {intro.relatedBook?.cover_image && (
                            <div className={`mt-auto mx-auto ${isCenter ? 'mb-[-200px] w-[680px] h-[380px]' : 'w-[370px] h-[221px]'}`}>
                              <div className="relative w-full h-full rounded-[96px] overflow-hidden shadow-lg">
                                <img
                                  src={getImageUrl(intro.relatedBook.cover_image) || intro.relatedBook.cover_image}
                                  alt={intro.relatedBook.title}
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    console.error('Image load error:', intro.relatedBook?.cover_image);
                                    e.currentTarget.style.display = 'none';
                                  }}
                                />
                              </div>
                            </div>
                          )}
                        </div>
                        </Link>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Normal Section */}
            <div className="mb-[5%] mt-[10%]">
              {normalIntros.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center">
                  {normalIntros.map((intro) => (
                    <div key={intro.id} className="flex items-center h-[559px]">
                      <Link
                        to={`/book-introductions/${intro.slug}`}
                        className="group relative bg-white rounded-[96px] border border-gray-300 w-[370px] h-[559px] scale-95 opacity-100 overflow-hidden mt-32"
                      >
                        {/* Content */}
                        <div className="relative h-full flex flex-col">
                          {/* Middle Content */}
                          <div className="flex-1 flex flex-col justify-center space-y-6 mb-6 px-10">
                            {/* Tiêu đề */}
                            <h3 className="font-bold text-[#002855] uppercase text-xl">
                              {intro.title}
                            </h3>
                            
                            {/* Tác giả */}
                            {intro.relatedBook && intro.relatedBook.authors && intro.relatedBook.authors.length > 0 && (
                              <p className="text-[#757575] font-medium text-sm">
                                {intro.relatedBook.authors.join(', ')}
                              </p>
                            )}

                            {/* Nội dung */}
                            <p className="text-[#757575] line-clamp-3 text-sm">
                              {intro.content}
                            </p>

                            {/* Mô tả */}
                            <p className="text-[#757575] text-sm font-bold font-italic" style={{ fontStyle: 'italic' }}>
                              {intro.description}
                            </p>
                          </div>

                          {/* Bottom - Book Cover */}
                          {intro.relatedBook?.cover_image && (
                            <div className="mt-auto mx-auto w-[370px] h-[221px]">
                              <div className="relative w-full h-full rounded-[96px] overflow-hidden shadow-lg">
                                <img
                                  src={getImageUrl(intro.relatedBook.cover_image) || intro.relatedBook.cover_image}
                                  alt={intro.relatedBook.title}
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    console.error('Image load error:', intro.relatedBook?.cover_image);
                                    e.currentTarget.style.display = 'none';
                                  }}
                                />
                              </div>
                            </div>
                          )}
                        </div>
                      </Link>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-white rounded-xl">
                  <p className="text-gray-500">Chưa có bài giới thiệu nào</p>
                </div>
              )}
            </div>

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
          </>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default BookIntroductionsHomePage;
