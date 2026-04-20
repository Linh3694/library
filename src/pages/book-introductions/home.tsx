import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import Breadcrumbs from '../../components/Breadcrumbs';
import { Pagination } from '../../components/ui/pagination';
import { publicLibraryService, type PublicBookIntroduction } from '../../services/publicLibraryService';
// import { type StandardApiResponse } from '../../lib/api';
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
  // const formatDate = (dateString: string) => {
  //   try {
  //     const date = new Date(dateString);
  //     return date.toLocaleDateString('vi-VN');
  //   } catch {
  //     return dateString;
  //   }
  // };

  // Intro Card Component
  // const IntroCard = ({ intro, featured = false }: { intro: PublicBookIntroduction; featured?: boolean }) => (
  //   <Link
  //     to={`/book-introductions/${intro.slug}`}
  //     className={`group block bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 ${
  //       featured ? 'h-full' : ''
  //     }`}
  //   >
  //     {/* Book Cover */}
  //     <div className={`relative overflow-hidden ${featured ? 'h-64' : 'h-48'}`}>
  //       {intro.relatedBook?.cover_image ? (
  //         <img
  //           src={getImageUrl(intro.relatedBook.cover_image) || intro.relatedBook.cover_image}
  //           alt={intro.relatedBook.title}
  //           className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
  //         />
  //       ) : (
  //         <div className="w-full h-full flex items-center justify-center">
  //           <svg className="w-16 h-16 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
  //             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
  //           </svg>
  //         </div>
  //       )}
  //       {/* Featured Badge */}
  //       {featured && (
  //         <div className="absolute top-3 right-3 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold">
  //           Nổi bật
  //         </div>
  //       )}
  //     </div>

  //     {/* Content */}
  //     <div className="p-5">
  //       <h3 className={`font-bold text-oxford mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors ${
  //         featured ? 'text-xl' : 'text-lg'
  //       }`}>
  //         {intro.title}
  //       </h3>

  //       {/* Related Book Info */}
  //       {intro.relatedBook && (
  //         <div className="mb-3">
  //           <p className="text-sm text-gray-600 font-medium">{intro.relatedBook.title}</p>
  //           {intro.relatedBook.authors && intro.relatedBook.authors.length > 0 && (
  //             <p className="text-xs text-gray-500">
  //               {intro.relatedBook.authors.join(', ')}
  //             </p>
  //           )}
  //         </div>
  //       )}

  //       <p className={`text-gray-600 mb-3 ${featured ? 'line-clamp-3' : 'line-clamp-2'}`}>
  //         {intro.description}
  //       </p>

  //       <div className="flex items-center justify-between text-xs text-gray-500">
  //         <span>{formatDate(intro.modifiedAt)}</span>
  //         <span className="text-blue-600 font-medium group-hover:underline">Đọc thêm →</span>
  //       </div>
  //     </div>
  //   </Link>
  // );

  return (
    <div className="min-h-screen bg-background">
      <div className="sticky top-0 z-10">
        <Header />
      </div>

      {/* Main Content */}
      <div className="max-w-[1600px] mx-auto px-4 md:px-8 2xl:px-0 py-6">
        {/* Breadcrumb */}
        <Breadcrumbs items={[{ label: 'Giới thiệu sách' }]} className="mb-9" />


        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-oxford mx-auto mb-4"></div>
            <p className="text-gray-500">Đang tải...</p>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-500">{error}</p>
          </div>
        ) : (
          <>

            {/* Normal Section */}
            <div className="mb-12">
              {normalIntros.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-12 justify-items-center">
                  {normalIntros.map((intro) => (
                    <div key={intro.id} className="flex items-start h-full w-full justify-center">
                      <Link
                        to={`/book-introductions/${intro.slug}`}
                        className="group relative bg-background rounded-[64px] md:rounded-[96px] border border-gray-300 w-full max-w-[400px] h-[600px] overflow-hidden flex flex-col transition-all duration-300 hover:shadow-xl"
                      >
                        {/* Content */}
                        <div className="relative flex-1 flex flex-col">
                          {/* Middle Content */}
                          <div className="flex-1 flex flex-col justify-start space-y-4 md:space-y-6 p-6 sm:p-8 lg:py-12 lg:px-10">
                            {/* Tiêu đề */}
                            <h3 className="text-oxford text-xl md:text-2xl font-bold uppercase line-clamp-2">
                              {intro.title}
                            </h3>

                            {/* Tác giả */}
                            {intro.relatedBook && intro.relatedBook.authors && intro.relatedBook.authors.length > 0 && (
                              <p className="text-dark-gray text-base font-semibold">
                                {intro.relatedBook.authors.join(', ')}
                              </p>
                            )}

                            {/* Nội dung */}
                            <p className="text-dark-gray text-base font-semibold leading-[21px] line-clamp-3">
                              {intro.content}
                            </p>

                            {/* Mô tả */}
                            <p className="text-dark-gray text-base font-bold italic">
                              {intro.description}
                            </p>
                          </div>

                          {/* Bottom - Book Cover */}
                          <div className="mt-auto mx-auto w-full">
                            <div className="relative aspect-[16/9] rounded-[64px] md:rounded-[96px] overflow-hidden shadow-lg border-t border-gray-100">
                              <img
                                src={intro.relatedBook?.cover_image ? (getImageUrl(intro.relatedBook.cover_image) || intro.relatedBook.cover_image) : "/book-placeholder.png"}
                                alt={intro.relatedBook?.title || "Book cover"}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  e.currentTarget.src = "/book-placeholder.png";
                                }}
                              />
                            </div>
                          </div>
                        </div>
                      </Link>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-background rounded-xl">
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
        )
        }
      </div >

      <Footer />
    </div >
  );
};

export default BookIntroductionsHomePage;
