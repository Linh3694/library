import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../../components/Header';
import { getImageUrl, createSlug } from '../../lib/utils';
import { libraryAPI } from '../../lib/api';
import Footer from '../../components/Footer';
import { Button } from '../../components/ui/button';
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from '../../components/ui/breadcrumb';
import { Pagination } from '../../components/ui/pagination';

// Interface cho book detail từ API
interface BookDetail {
  _id: string;
  libraryId?: string;
  libraryCode?: string;
  title: string;
  authors?: string[];
  author?: string; // Fallback field
  // Cấu trúc mới cho 3 tab từ admin
  description?: {
    linkEmbed?: string;
    content?: string;
  };
  introduction?: {
    linkEmbed?: string;
    content?: string;
  };
  audioBook?: {
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
  authors?: string[];
  author?: string;
  category?: string;
  coverImage?: string;
  borrowCount?: number;
  totalBorrowCount?: number;
  isAudioBook?: boolean;
}

const BookDetailPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [bookDetail, setBookDetail] = useState<BookDetail | null>(null);
  const [relatedBooks, setRelatedBooks] = useState<RelatedBook[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'description' | 'introduction' | 'audiobook'>('description');
  const booksPerPage = 5;

  // Handle click on related book
  const handleRelatedBookClick = (book: RelatedBook) => {
    const bookSlug = createSlug(book.title);
    navigate(`/library/book/${bookSlug}`);
  };

  // Helper function to convert URLs to embeddable format
  const getEmbedUrl = (url: string): string => {
    if (!url) return '';
    
    // YouTube URL conversion
    const youtubeRegex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]+)/;
    const youtubeMatch = url.match(youtubeRegex);
    if (youtubeMatch) {
      return `https://www.youtube.com/embed/${youtubeMatch[1]}`;
    }
    
    // Spotify URL conversion
    const spotifyRegex = /https?:\/\/open\.spotify\.com\/(track|album|playlist)\/([a-zA-Z0-9]+)/;
    const spotifyMatch = url.match(spotifyRegex);
    if (spotifyMatch) {
      return `https://open.spotify.com/embed/${spotifyMatch[1]}/${spotifyMatch[2]}`;
    }
    
    // SoundCloud - keep as is (usually works with embed)
    if (url.includes('soundcloud.com')) {
      return url;
    }
    
    // Voiz FM - keep as is
    if (url.includes('voiz.vn')) {
      return url;
    }
    
    // Default: return original URL
    return url;
  };

  // Scroll to top when page loads
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [slug]);

  // Helper functions to check if tab has content
  const hasDescriptionContent = (book: BookDetail) => {
    return book?.description?.content || book?.description?.linkEmbed;
  };

  const hasIntroductionContent = (book: BookDetail) => {
    return book?.introduction?.content || book?.introduction?.linkEmbed;
  };

  const hasAudioBookContent = (book: BookDetail) => {
    return book?.isAudioBook && (book?.audioBook?.content || book?.audioBook?.linkEmbed);
  };

  // Get first available tab
  const getFirstAvailableTab = (book: BookDetail) => {
    if (hasDescriptionContent(book)) return 'description';
    if (hasIntroductionContent(book)) return 'introduction';
    if (hasAudioBookContent(book)) return 'audiobook';
    return 'description'; // fallback
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
        
        // Set active tab to first available tab with content
        setActiveTab(getFirstAvailableTab(book));
        
        // Fetch related books
        try {
          const related = await libraryAPI.getRelatedBooks(book.category || book.documentType || '', 10);
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
  const totalPages = Math.ceil(relatedBooks.length / booksPerPage);

  const currentRelatedBooks = relatedBooks.slice(
    (currentPage - 1) * booksPerPage,
    currentPage * booksPerPage
  );

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="sticky top-0 z-10">
          <Header />
        </div>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#002855] mx-auto mb-4"></div>
            <p className="text-[#757575]">Đang tải thông tin sách...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen bg-white">
        <div className="sticky top-0 z-10">
          <Header />
        </div>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <svg className="w-16 h-16 text-red-400 mx-auto mb-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
            <p className="text-red-600 text-lg mb-2">Lỗi</p>
            <p className="text-[#757575] mb-4">{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="bg-[#002855] text-white px-4 py-2 rounded-lg hover:bg-[#002855]/90"
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
      <div className="min-h-screen bg-white">
        <div className="sticky top-0 z-10">
          <Header />
        </div>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C13.1 2 14 2.9 14 4V10C14 11.1 13.1 12 12 12C10.9 12 10 11.1 10 10V4C10 2.9 10.9 2 12 2M19 10V12C19 15.3 16.3 18 13 18V20H11V18C7.7 18 5 15.3 5 12V10H7V12C7 14.2 8.8 16 11 16H13C15.2 16 17 14.2 17 12V10H19Z"/>
            </svg>
            <p className="text-gray-500 text-lg mb-2">Không tìm thấy sách</p>
            <p className="text-gray-400 text-sm">Sách bạn đang tìm kiếm không tồn tại hoặc đã bị xóa</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="sticky top-0 z-10">
        <Header />
      </div>

      {/* Main Content */}
      <div className="mx-[7%] px-4 sm:px-6 lg:px-8 py-6">
        {/* Breadcrumb */}
        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Trang chủ</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/library">Thư viện sách</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Tương lai sau đại dịch Covid</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

         {/* Book Detail Section */}
          <div className="w-[110%] grid grid-cols-12 gap-8 mb-12 border-t border-b border-r border-[#DDDDDD] rounded-r-full -ml-[10%] pl-[15%] py-16">
            {/* Book Image */}
            <div className="col-span-3">
            <div className="flex justify-center items-center">
              {bookDetail.coverImage ? (
                <img
                  src={getImageUrl(bookDetail.coverImage)}
                  alt={bookDetail.title}
                  className="max-w-[310px] h-auto max-h-[410px] object-cover"
                />
              ) : (
                <div className="w-full h-[400px] bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center rounded-lg">
                  <div className="text-center p-8">
                    <div className="w-20 h-28 bg-white rounded shadow-sm mx-auto mb-4"></div>
                    <div className="text-lg text-gray-600 font-medium uppercase tracking-wide">
                      {bookDetail.title}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Book Information */}
          <div className="col-span-5 space-y-20">
            <div>
              <h1 className="text-3xl font-bold text-[#002855] mb-2">
                {bookDetail.title}
              </h1>
              <p className="text-lg text-[#757575] mb-4">
                {bookDetail.authors?.join(", ") || bookDetail.author || "Chưa có thông tin tác giả"}
              </p>
            </div>

            {/* Book Details */}
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-[#002855] font-semibold">Năm xuất bản</span>
                <p className="font-medium text-[#757575] mt-3">{bookDetail.publishYear || "Chưa cập nhật"}</p>
              </div>
              <div>
                <span className="text-[#002855] font-semibold">Thể loại</span>
                <p className="font-medium text-[#757575] mt-3">{bookDetail.genre || bookDetail.category || bookDetail.documentType || "Chưa phân loại"}</p>
              </div>
              <div>
                <span className="text-[#002855] font-semibold">Số lượt mượn</span>
                <p className="font-medium text-[#757575] mt-3">{bookDetail.totalBorrowCount || bookDetail.borrowCount || 0} lượt</p>
              </div>
              <div>
                <span className="text-[#002855] font-semibold">Ngôn ngữ</span>
                <p className="font-medium text-[#757575] mt-3">{bookDetail.language || "Tiếng Việt"}</p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="col-span-3 flex flex-col gap-8 items-center justify-center">
            <div className="relative">
              <Button 
                className="w-32 h-32 rounded-full border-2 border-[#F05023] bg-white text-[#F05023] hover:bg-[#F05023]/10 hover:text-[#F05023]  font-black text-sm flex flex-col items-center justify-center p-4  shadow-lg">
                <span className="text-center leading-tight">MƯỢN SÁCH</span>
              </Button>
            </div>
            <div className="relative">
              <Button 
                className="w-32 h-32 rounded-full border-2 border-[#F05023] bg-white text-[#F05023] hover:bg-[#F05023]/10 hover:text-[#F05023] font-black text-sm flex flex-col items-center justify-center p-4 shadow-lg"
              >
                <span className="text-center leading-tight">THÊM VÀO<br/>GIỎ SÁCH</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Book Description Tabs */}
        <div className="mb-12">
          {/* Tab Navigation - Only show if there are any tabs with content */}
          {(hasDescriptionContent(bookDetail) || hasIntroductionContent(bookDetail) || hasAudioBookContent(bookDetail)) && (
            <div className="flex justify-center mb-6">
              <div className="flex rounded-full p-1 gap-4">
                {hasDescriptionContent(bookDetail) && (
                  <button
                    onClick={() => setActiveTab('description')}
                    className={`w-36 px-6 py-2 rounded-full text-sm transition-all ${
                      activeTab === 'description'
                        ? 'bg-[#E6EEF6] text-[#002855] font-bold'
                        : 'text-[#757575] bg-[#F6F6F6]'
                    }`}
                  >
                    Mô tả
                  </button>
                )}
                {hasIntroductionContent(bookDetail) && (
                  <button
                    onClick={() => setActiveTab('introduction')}
                    className={`w-36 px-2 py-2 rounded-full text-sm transition-all ${
                      activeTab === 'introduction'
                         ? 'bg-[#E6EEF6] text-[#002855] font-bold'
                        : 'text-[#757575] bg-[#F6F6F6]'
                    }`}
                  >
                    Giới thiệu sách
                  </button>
                )}
                {hasAudioBookContent(bookDetail) && (
                  <button
                    onClick={() => setActiveTab('audiobook')}
                    className={`w-36 px-6 py-2 rounded-full text-sm transition-all ${
                      activeTab === 'audiobook'
                        ? 'bg-[#E6EEF6] text-[#002855] font-bold'
                        : 'text-[#757575] bg-[#F6F6F6]'
                    }`}
                  >
                    Sách Nói
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Tab Content - Only show if there are tabs with content */}
          {(hasDescriptionContent(bookDetail) || hasIntroductionContent(bookDetail) || hasAudioBookContent(bookDetail)) && (
            <div>
              {activeTab === 'description' && hasDescriptionContent(bookDetail) && (
                <div className="items-center justify-center text-center">
                  {/* Hiển thị link embed nếu có */}
                  {bookDetail?.description?.linkEmbed && (
                    <div className="mb-10">
                      <div className="relative">
                        <iframe
                          src={getEmbedUrl(bookDetail.description.linkEmbed)}
                          className="w-[60%] h-[480px] border-0 rounded-lg mx-auto"
                          title={`Embed: ${bookDetail.title}`}
                          allow="autoplay; encrypted-media"
                          sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
                          loading="lazy"
                          onError={() => {
                            console.warn('Failed to load embed content');
                          }}
                        />                    
                      </div>
                    </div>
                  )}
                  {/* Hiển thị nội dung mô tả */}
                  {bookDetail?.description?.content && (
                    <div className="w-[50%] mx-auto text-justify font-semibold text-sm text-[#757575] leading-relaxed space-y-2 border-b border-[#DDDDDD] pb-10">
                      <p>{bookDetail.description.content}</p>
                    </div>
                  )}
                </div>
              )}
              
              {activeTab === 'introduction' && hasIntroductionContent(bookDetail) && (
                <div className="items-center justify-center text-center">
                  {/* Hiển thị link embed nếu có */}
                  {bookDetail?.introduction?.linkEmbed && (
                    <div className="mb-10">
                      <div className="relative">
                        <iframe
                          src={getEmbedUrl(bookDetail.introduction.linkEmbed)}
                          className="w-[60%] h-[480px] border-0 rounded-lg mx-auto"
                          title={`Giới thiệu: ${bookDetail.title}`}
                          allow="autoplay; encrypted-media"
                          sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
                          loading="lazy"
                          onError={() => {
                            console.warn('Failed to load embed content');
                          }}
                        />
                      </div>
                    </div>
                  )}
                  {/* Hiển thị nội dung giới thiệu */}
                  {bookDetail?.introduction?.content && (
                    <div className="w-[50%] mx-auto text-justify font-semibold text-sm text-[#757575] leading-relaxed space-y-2 border-b border-[#DDDDDD] pb-10">
                      <p>{bookDetail.introduction.content}</p>
                    </div>
                  )}
                </div>
              )}
              
              {activeTab === 'audiobook' && hasAudioBookContent(bookDetail) && (
                <div className="items-center justify-center text-center">
                  {/* Hiển thị link embed nếu có */}
                  {bookDetail?.audioBook?.linkEmbed && (
                    <div className="mb-10">
                      <div className="relative">
                        <iframe
                          src={getEmbedUrl(bookDetail.audioBook.linkEmbed)}
                          className="w-[60%] h-[480px] border-0 rounded-lg mx-auto"
                          title={`Audiobook: ${bookDetail.title}`}
                          allow="autoplay; encrypted-media"
                          sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
                          loading="lazy"
                          onError={() => {
                            console.warn('Failed to load embed content');
                          }}
                        />
                      </div>
                    </div>
                  )}
                  {/* Hiển thị nội dung mô tả sách nói */}
                  {bookDetail?.audioBook?.content && (
                    <div className="w-[50%] mx-auto text-justify font-semibold text-sm text-[#757575] leading-relaxed space-y-2 border-b border-[#DDDDDD] pb-10">
                      <p>{bookDetail.audioBook.content}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Related Books Section */}
        <div>
          <h2 className="text-2xl font-bold text-[#002855] text-center mb-8">
            Có thể bạn cũng thích
          </h2>
          
          <div className="grid grid-cols-5 gap-6 mb-8">
            {currentRelatedBooks.map((book) => (
              <div 
                key={book._id} 
                className="bg-[#f6f6f6] rounded-[70px] overflow-hidden shadow-sm p-8 cursor-pointer hover:shadow-md transition-all duration-200 hover:bg-[#f0f0f0]"
                onClick={() => handleRelatedBookClick(book)}
              >
                <div className="aspect-[4/5] flex justify-center items-center">
                  {book.coverImage ? (
                    <img
                      src={getImageUrl(book.coverImage)}
                      alt={book.title}
                      className="w-[80%] h-[90%] object-cover shadow-lg"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center rounded-lg">
                      <div className="text-center p-2">
                        <div className="w-8 h-12 bg-white rounded shadow-sm mx-auto mb-2"></div>
                        <div className="text-xs text-gray-600 font-medium">
                          {book.title}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                <div className="space-y-2">
                  <p className="text-xs text-[#757575]">
                    {book.authors?.join(", ") || book.author || "Chưa có tác giả"}
                  </p>
                  <h3 className="font-semibold text-sm line-clamp-2">{book.title}</h3>
                  
                 <div className="flex gap-1 pt-10 items-center justify-between">
                        <div>
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          className="font-bold text-[#757575] -ml-3 hover:text-[#002855]"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRelatedBookClick(book);
                          }}
                        >
                          Mở rộng
                        </Button>
                       </div>
                          {book.isAudioBook && (
                           <div className="flex items-center gap-1">
                             <img src="/play.svg" alt="Play" className="w-4 h-4" />
                             <img src="/micro.svg" alt="Microphone" className="w-4 h-4" />
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
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default BookDetailPage;
