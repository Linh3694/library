import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../../components/Header';
import { getImageUrl, createSlug, stripNumericSuffix } from '../../lib/utils';
import { libraryAPI, type BookCopy } from '../../lib/api';
import Footer from '../../components/Footer';
import Breadcrumbs from '../../components/Breadcrumbs';
import { Pagination } from '../../components/ui/pagination';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

// Interface cho book detail từ API
interface BookDetail {
  _id: string;
  libraryId?: string;
  libraryCode?: string;
  title: string;
  authors?: string[];
  author?: string; // Fallback field
  // Cấu trúc mới cho mô tả từ admin
  description?: {
    linkEmbed?: string;
    content?: string;
  };
  publishYear?: number | string;
  genre?: string;
  category?: string;
  borrowCount?: number;
  language?: string;
  coverImage?: string;
  isOnline?: boolean;
  onlineLink?: string;
  isAudioBook?: boolean;
  isNewBook?: boolean;
  isFeaturedBook?: boolean;
  rating?: number;
  totalBorrowCount?: number;
  documentType?: string;
  seriesName?: string;
}

// Interface cho related books
interface RelatedBook {
  _id: string;
  title: string;
  authors: string[];
  author?: string;
  category?: string;
  coverImage?: string;
  borrowCount?: number;
  totalBorrowCount?: number;
  isAudioBook?: boolean;
  seriesName?: string;
  documentType?: string;
  publishYear?: number;
}

// Component Image wrapper để handle loading state
const BookImage = ({
  src,
  alt,
  fallback,
  className
}: {
  src: string | undefined,
  alt: string,
  fallback: string,
  className: string
}) => {
  const [currentSrc, setCurrentSrc] = useState(src || fallback);

  useEffect(() => {
    setCurrentSrc(src || fallback);
  }, [src, fallback]);

  const handleError = () => {
    if (currentSrc !== fallback) {
      setCurrentSrc(fallback);
    }
  };

  return (
    <img
      src={currentSrc}
      alt={alt}
      className={className}
      onError={handleError}
    />
  );
};

const BookDetailPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [bookDetail, setBookDetail] = useState<BookDetail | null>(null);
  const [bookCopies, setBookCopies] = useState<BookCopy[]>([]);
  const [relatedBooks, setRelatedBooks] = useState<RelatedBook[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const booksPerPage = 5;

  // Handle click on related book
  const handleRelatedBookClick = (book: RelatedBook) => {
    const bookSlug = createSlug(book.title);
    navigate(`/library/book/${bookSlug}`);
  };

  // Scroll to top when page loads
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [slug]);

  // Helper function to check if has description content
  const hasDescriptionContent = (book: BookDetail) => {
    return book?.description?.content || book?.description?.linkEmbed;
  };

  // Helper function to convert URLs to embeddable format for video
  const renderVideoEmbed = (href: string) => {
    // YouTube
    const youtubeMatch = href.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]+)/);
    if (youtubeMatch) {
      const videoId = youtubeMatch[1];
      return (
        <div className="my-6">
          <div className="relative w-full aspect-video rounded-lg overflow-hidden shadow-md">
            <iframe
              src={`https://www.youtube.com/embed/${videoId}`}
              title="YouTube video"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="absolute top-0 left-0 w-full h-full"
            />
          </div>
        </div>
      );
    }

    // Spotify
    const spotifyMatch = href.match(/spotify\.com\/(track|album|playlist|episode)\/([a-zA-Z0-9]+)/);
    if (spotifyMatch) {
      const [, type, id] = spotifyMatch;
      return (
        <div className="my-6">
          <div className="relative w-full rounded-lg overflow-hidden shadow-md" style={{ height: type === 'track' || type === 'episode' ? '152px' : '380px' }}>
            <iframe
              src={`https://open.spotify.com/embed/${type}/${id}`}
              title="Spotify embed"
              allow="encrypted-media"
              className="absolute top-0 left-0 w-full h-full"
            />
          </div>
        </div>
      );
    }

    return null;
  };

  // Fetch book detail by slug
  useEffect(() => {
    const fetchBookDetail = async () => {
      if (!slug) return;

      try {
        setLoading(true);
        setError(null);

        // Try to fetch book by slug first
        const book = await libraryAPI.getBookDetailBySlug(slug);
        setBookDetail(book);

        // Fetch book copies to get all publication years
        if (book._id) {
          try {
            const copies = await libraryAPI.getBookCopies(book._id);
            setBookCopies(copies);
          } catch (copyError) {
            console.warn('Could not fetch book copies:', copyError);
          }
        }

        // Fetch related books với nhiều tiêu chí
        try {
          const related = await libraryAPI.getRelatedBooks(
            book._id || book.libraryId || '',
            book.category || '',
            book.seriesName || '',
            book.documentType || '',
            book.authors || [],
            10
          );
          setRelatedBooks(related);
        } catch (relatedError) {
          console.warn('Could not fetch related books:', relatedError);
          setRelatedBooks([]);
        }

      } catch (error) {
        console.error('Error fetching book detail:', error);
        setError('Không thể tải thông tin sách. Vui lòng thử lại sau.');
      } finally {
        setLoading(false);
      }
    };

    fetchBookDetail();
  }, [slug]);

  // Get unique publication years from copies
  const getFormattedPublishYears = () => {
    if (bookCopies.length > 0) {
      const years = bookCopies
        .map(copy => copy.publish_year)
        .filter((year): year is number => !!year)
        .sort((a, b) => a - b);

      const uniqueYears = Array.from(new Set(years));
      if (uniqueYears.length > 0) {
        return uniqueYears.join(', ');
      }
    }
    return bookDetail?.publishYear || "Chưa cập nhật";
  };

  const totalPages = Math.ceil(relatedBooks.length / booksPerPage);

  const currentRelatedBooks = relatedBooks.slice(
    (currentPage - 1) * booksPerPage,
    currentPage * booksPerPage
  );

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="sticky top-0 z-10">
          <Header />
        </div>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-oxford mx-auto mb-4"></div>
            <p className="text-dark-gray">Đang tải thông tin sách...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <div className="sticky top-0 z-10">
          <Header />
        </div>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <svg className="w-16 h-16 text-destructive/60 mx-auto mb-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
            </svg>
            <p className="text-destructive text-lg mb-2">Lỗi</p>
            <p className="text-dark-gray mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-oxford text-white px-4 py-2 rounded-lg hover:bg-oxford/90"
            >
              Thử lại
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Show not found state
  if (!bookDetail) {
    return (
      <div className="min-h-screen bg-background">
        <div className="sticky top-0 z-10">
          <Header />
        </div>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C13.1 2 14 2.9 14 4V10C14 11.1 13.1 12 12 12C10.9 12 10 11.1 10 10V4C10 2.9 10.9 2 12 2M19 10V12C19 15.3 16.3 18 13 18V20H11V18C7.7 18 5 15.3 5 12V10H7V12C7 14.2 8.8 16 11 16H13C15.2 16 17 14.2 17 12V10H19Z" />
            </svg>
            <p className="text-dark-gray text-lg mb-2">Không tìm thấy sách</p>
            <p className="text-dark-gray/60 text-sm">Sách bạn đang tìm kiếm không tồn tại hoặc đã bị xóa</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="sticky top-0 z-10">
        <Header />
      </div>

      {/* Main Content */}
      <div className="max-w-[1600px] mx-auto px-4 md:px-8 2xl:px-0 py-6">
        <Breadcrumbs
          items={[
            { label: 'Thư viện sách', href: '/library' },
            { label: bookDetail?.title || 'Chi tiết sách', current: true },
          ]}
          className="mb-9"
        />

        {/* Book Detail Section */}
        <div className="w-full lg:w-[110%] grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12 border-t border-b lg:border-r border-light-gray lg:rounded-r-full lg:-ml-[10%] px-6 lg:pl-[15%] py-10 lg:py-16 bg-background">
          {/* Book Image */}
          <div className="col-span-12 lg:col-span-3">
            <div className="flex justify-center items-center">
              {bookDetail.coverImage ? (
                <img
                  src={getImageUrl(bookDetail.coverImage)}
                  alt={bookDetail.title}
                  className="w-full max-w-[280px] lg:max-w-[310px] h-auto object-cover lg:shadow-none rounded-lg"
                />
              ) : (
                <img
                  src="/book-placeholder.png"
                  alt={bookDetail.title}
                  className="w-full max-w-[280px] lg:max-w-[310px] h-auto object-cover lg:shadow-none rounded-lg"
                />
              )}
            </div>
          </div>

          {/* Book Information */}
          <div className="col-span-12 lg:col-span-8 space-y-10 lg:space-y-20">
            <div className="text-center lg:text-left">
              <h1 className="text-2xl lg:text-3xl font-bold text-oxford mb-2">
                {bookDetail.title}
              </h1>
            </div>

            {/* Book Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 lg:gap-4 text-sm">
              <div>
                <span className="text-oxford font-semibold">Tác giả</span>
                <p className="font-medium text-dark-gray mt-3">
                  {bookDetail.authors?.join(", ") || "Chưa có thông tin"}
                </p>
              </div>
              <div>
                <span className="text-oxford font-semibold">Phân loại tài liệu</span>
                <p className="font-medium text-dark-gray mt-3">{stripNumericSuffix(bookDetail.documentType) || "Chưa phân loại"}</p>
              </div>
              <div>
                <span className="text-oxford font-semibold">Chủ đề</span>
                <p className="font-medium text-dark-gray mt-3">{bookDetail.seriesName || "Chưa có"}</p>
              </div>
              <div>
                <span className="text-oxford font-semibold">Thể loại</span>
                <p className="font-medium text-dark-gray mt-3">{stripNumericSuffix(bookDetail.category) || "Chưa có"}</p>
              </div>
              <div>
                <span className="text-oxford font-semibold">Ngôn ngữ</span>
                <p className="font-medium text-dark-gray mt-3">{bookDetail.language || "Tiếng Việt"}</p>
              </div>
              <div>
                <span className="text-oxford font-semibold">Năm xuất bản</span>
                <p className="font-medium text-dark-gray mt-3">{getFormattedPublishYears()}</p>
              </div>
              {/* <div>
                <span className="text-oxford font-semibold">Số lượt mượn</span>
                <p className="font-medium text-dark-gray mt-3">{bookDetail.totalBorrowCount || bookDetail.borrowCount || 0} lượt</p>
              </div> */}
            </div>
          </div>

          {/* Action Buttons - Hidden as per user request */}
          {/* <div className="col-span-3 flex flex-col gap-8 items-center justify-center">
            <div className="relative">
              <Button 
                className="w-32 h-32 rounded-full border-2 border-red-orange bg-background text-red-orange hover:bg-red-orange/10 hover:text-red-orange font-black text-sm flex flex-col items-center justify-center p-4 shadow-lg">
                <span className="text-center leading-tight">MƯỢN SÁCH</span>
              </Button>
            </div>
            <div className="relative">
              <Button 
                className="w-32 h-32 rounded-full border-2 border-red-orange bg-white text-red-orange hover:bg-red-orange/10 hover:text-red-orange font-black text-sm flex flex-col items-center justify-center p-4 shadow-lg"
              >
                <span className="text-center leading-tight">THÊM VÀO<br/>GIỎ SÁCH</span>
              </Button>
            </div>
          </div> */}
        </div>

        {/* Book Description Section - Chỉ hiển thị Mô tả */}
        {hasDescriptionContent(bookDetail) && (
          <div className="mb-12">
            {/* Title */}
            <div className="flex justify-center mb-6">
              <div className="bg-pastel-blue text-oxford font-bold px-6 py-2 rounded-full text-sm">
                Mô tả
              </div>
            </div>

            {/* Content - Markdown */}
            <div className="w-full lg:w-[60%] mx-auto px-4 lg:px-0">
              {bookDetail?.description?.content && (
                <div className="prose prose-base lg:prose-lg max-w-none text-justify border-b border-light-gray pb-10">
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                      h1: (props) => <h1 className="text-2xl font-bold text-oxford mb-4 mt-6" {...props} />,
                      h2: (props) => <h2 className="text-xl font-bold text-oxford mb-3 mt-5" {...props} />,
                      h3: (props) => <h3 className="text-lg font-bold text-oxford mb-2 mt-4" {...props} />,
                      p: ({ children, ...props }) => {
                        // Check if paragraph contains a video link
                        if (typeof children === 'string') {
                          const videoEmbed = renderVideoEmbed(children.trim());
                          if (videoEmbed) return videoEmbed;
                        }
                        return <p className="text-dark-gray leading-relaxed mb-4 text-base font-semibold whitespace-pre-line" {...props}>{children}</p>;
                      },
                      br: () => <br />,
                      ul: (props) => <ul className="list-disc list-inside mb-4 space-y-2" {...props} />,
                      ol: (props) => <ol className="list-decimal list-inside mb-4 space-y-2" {...props} />,
                      li: (props) => <li className="text-dark-gray text-base" {...props} />,
                      blockquote: (props) => (
                        <blockquote className="border-l-4 border-light-gray pl-4 italic text-dark-gray/80 my-4" {...props} />
                      ),
                      a: ({ href, ...props }) => {
                        const videoEmbed = renderVideoEmbed(href || '');
                        if (videoEmbed) return videoEmbed;
                        return <a className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer" href={href} {...props} />;
                      },
                      img: ({ src, alt, ...props }) => (
                        <img
                          className="rounded-lg shadow-md my-6 max-w-full h-auto mx-auto"
                          src={getImageUrl(src)}
                          alt={alt}
                          {...props}
                        />
                      ),
                      strong: (props) => <strong className="font-bold text-oxford" {...props} />,
                      em: (props) => <em className="italic" {...props} />,
                      code: (props) => <code className="bg-semi-white px-2 py-1 rounded text-sm font-mono" {...props} />,
                    }}
                  >
                    {bookDetail.description.content}
                  </ReactMarkdown>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Related Books Section */}
        <div>
          <h2 className="text-2xl font-bold text-oxford text-center mb-8">
            Có thể bạn cũng thích
          </h2>

          {currentRelatedBooks.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-dark-gray">Chưa có sách liên quan</p>
            </div>
          ) : (
            <>
              <div className="flex flex-wrap justify-center gap-6 mb-8">
                {currentRelatedBooks.map((book) => (
                  <div
                    key={book._id}
                    className="w-full sm:w-[calc(50%-1.5rem)] md:w-[calc(33.333%-1.5rem)] lg:w-[calc(20%-1.5rem)] bg-semi-white rounded-[70px] p-8 md:p-10 flex flex-col items-center group transition-all duration-300 hover:shadow-md cursor-pointer"
                    onClick={() => handleRelatedBookClick(book)}
                  >
                    {/* Image Section */}
                    <div className="mb-[29px]">
                      <BookImage
                        src={getImageUrl(book.coverImage)}
                        alt={book.title}
                        fallback="/book-placeholder.png"
                        className="w-[150px] h-[200px] object-cover drop-shadow-[0_4px_15px_rgba(0,0,0,0.25)] rounded-sm"
                      />
                    </div>

                    {/* Content Section */}
                    <div className="w-full flex flex-col gap-[30px]">
                      {/* Author & Title */}
                      <div className="flex flex-col gap-[9px]">
                        <p className="text-dark-gray text-[14px] font-semibold line-clamp-1">
                          {book.authors?.join(', ') || 'Đang cập nhật'}
                        </p>
                        <h3 className="text-oxford text-[16px] font-bold uppercase line-clamp-2 h-[50px] leading-tight group-hover:text-red-orange transition-colors">
                          {book.title}
                        </h3>
                        <p className="text-dark-gray text-[13px] font-medium italic line-clamp-1">
                          {[
                            book.seriesName,
                            stripNumericSuffix(book.category || book.documentType),
                            book.publishYear
                          ].filter(Boolean).join(' • ') || 'Chưa có thông tin'}
                        </p>
                      </div>

                      {/* Footer Actions */}
                      <div className="flex justify-between items-center w-full min-h-[32px]">
                        <span className="text-dark-gray text-[14px] font-bold group-hover:text-red-orange transition-colors">
                          Xem thêm
                        </span>

                        {/* Status Indicators/Icons */}
                        {book.isAudioBook && (
                          <div className="flex items-center gap-[5px]">
                            <div className="flex items-center gap-1">
                              <div className="w-[32px] h-[32px] bg-wellspring-green rounded-full flex items-center justify-center">
                                <img src="/micro.svg" alt="Micro" className="w-[24px] h-[24px]" />
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center">
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
      </div>

      <Footer />
    </div>
  );
};

export default BookDetailPage;
