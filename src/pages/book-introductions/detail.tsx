import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
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
import { publicLibraryService, type PublicBookIntroduction } from '../../services/publicLibraryService';
import { getImageUrl } from '../../lib/utils';
import ReactMarkdown from 'react-markdown';

const BookIntroductionDetailPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const [intro, setIntro] = useState<PublicBookIntroduction | null>(null);
  const [allRelatedIntros, setAllRelatedIntros] = useState<PublicBookIntroduction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const relatedPerPage = 3;

  // Helper function to detect and render video embeds
  const renderVideoEmbed = (href: string) => {
    // YouTube
    const youtubeMatch = href.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]+)/);
    if (youtubeMatch) {
      const videoId = youtubeMatch[1];
      return (
        <div className="-mx-32 px-8 my-6">
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
        <div className="-mx-32 px-8 my-6">
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

    // Vimeo
    const vimeoMatch = href.match(/vimeo\.com\/(\d+)/);
    if (vimeoMatch) {
      const videoId = vimeoMatch[1];
      return (
        <div className="-mx-32 px-8 my-6">
          <div className="relative w-full aspect-video rounded-lg overflow-hidden shadow-md">
            <iframe
              src={`https://player.vimeo.com/video/${videoId}`}
              title="Vimeo video"
              allow="autoplay; fullscreen; picture-in-picture"
              allowFullScreen
              className="absolute top-0 left-0 w-full h-full"
            />
          </div>
        </div>
      );
    }

    // Not a video link, return regular link
    return null;
  };

  useEffect(() => {
    const fetchIntroduction = async () => {
      if (!slug) {
        setError('Không tìm thấy bài giới thiệu');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const response = await publicLibraryService.getBookIntroductionBySlug(slug);

        if (response.success && response.data) {
          setIntro(response.data);
        } else {
          setError('Không tìm thấy bài giới thiệu');
        }
      } catch (err) {
        console.error('Error fetching introduction:', err);
        setError(err instanceof Error ? err.message : 'Không thể tải bài giới thiệu');
      } finally {
        setLoading(false);
      }
    };

    fetchIntroduction();
  }, [slug]);

  // Fetch ALL related introductions (not paginated from API)
  useEffect(() => {
    const fetchRelatedIntros = async () => {
      try {
        // Fetch a large number to get all intros
        const response = await publicLibraryService.getBookIntroductions(1, 100, false);
        if (response.success && response.data) {
          const allIntros = response.data.introductions || [];
          // Filter out current intro
          const filtered = allIntros.filter(item => item.slug !== slug);
          setAllRelatedIntros(filtered);
        }
      } catch (err) {
        console.error('Error fetching related introductions:', err);
      }
    };

    if (intro) {
      fetchRelatedIntros();
    }
  }, [intro, slug]);

  // Calculate pagination on frontend
  const totalPages = Math.ceil(allRelatedIntros.length / relatedPerPage);
  const startIndex = (currentPage - 1) * relatedPerPage;
  const endIndex = startIndex + relatedPerPage;
  const relatedIntros = allRelatedIntros.slice(startIndex, endIndex);

  // Format date
  // const formatDate = (dateString: string) => {
  //   try {
  //     const date = new Date(dateString);
  //     return date.toLocaleDateString('vi-VN', {
  //       year: 'numeric',
  //       month: 'long',
  //       day: 'numeric',
  //     });
  //   } catch {
  //     return dateString;
  //   }
  // };

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="sticky top-0 z-10">
          <Header />
        </div>
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#002855] mx-auto mb-4"></div>
            <p className="text-gray-500">Đang tải...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !intro) {
    return (
      <div className="min-h-screen bg-white">
        <div className="sticky top-0 z-10">
          <Header />
        </div>
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <p className="text-red-500 mb-4">{error || 'Không tìm thấy bài giới thiệu'}</p>
            <Link to="/book-introductions" className="text-blue-600 hover:underline">
              ← Quay lại danh sách
            </Link>
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
      <div className="mx-[7%] px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <Breadcrumb className="mb-8">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Trang chủ</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/book-introductions">Giới thiệu sách</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{intro.title}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Main Card Container */}
        <div className="w-6xl mx-auto mb-16">
          <div className="bg-white rounded-[96px] border border-gray-300 overflow-visible p-12">
            {/* Content Section */}
            <div className="space-y-8">
              {/* Title */}
              <h1 className="text-4xl font-bold text-[#002855] uppercase text-center">{intro.title}</h1>

              {/* Author */}
              {intro.relatedBook && intro.relatedBook.authors && intro.relatedBook.authors.length > 0 && (
                <p className="text-[#757575] font-medium text-lg text-center">
                  {intro.relatedBook.authors.join(', ')}
                </p>
              )}    

              
              {/* Description */}
              <p className="text-[#757575] text-base font-bold font-italic italic text-center px-8">
                {intro.description}
              </p>



              {/* Main Content - Markdown */}
              {intro.content && (
                <div className="prose prose-lg max-w-none markdown-content px-32 text-justify py-2">
                  <ReactMarkdown
                    components={{
                      h1: ({ node, ...props }) => <h1 className="text-3xl font-bold text-[#002855] mb-4 mt-8" {...props} />,
                      h2: ({ node, ...props }) => <h2 className="text-2xl font-bold text-[#002855] mb-3 mt-6" {...props} />,
                      h3: ({ node, ...props }) => <h3 className="text-xl font-bold text-[#002855] mb-2 mt-4" {...props} />,
                      p: ({ node, ...props }) => {
                        // Check if paragraph contains only a link (potential video embed)
                        const children = props.children;
                        
                        // Case 1: Single link element as child
                        if (Array.isArray(children) && children.length === 1 && typeof children[0] === 'object') {
                          const child = children[0] as any;
                          if (child?.props?.href) {
                            const videoEmbed = renderVideoEmbed(child.props.href);
                            if (videoEmbed) return videoEmbed;
                          }
                        }
                        
                        // Case 2: Plain text URL
                        if (typeof children === 'string') {
                          const urlRegex = /(https?:\/\/[^\s]+)/g;
                          const match = children.match(urlRegex);
                          if (match && match.length === 1 && children.trim() === match[0]) {
                            const videoEmbed = renderVideoEmbed(children.trim());
                            if (videoEmbed) return videoEmbed;
                          }
                        }
                        
                        return <p className="text-[#757575] leading-relaxed mb-4" {...props} />;
                      },
                      ul: ({ node, ...props }) => <ul className="list-disc list-inside mb-4 space-y-2" {...props} />,
                      ol: ({ node, ...props }) => <ol className="list-decimal list-inside mb-4 space-y-2" {...props} />,
                      li: ({ node, ...props }) => <li className="text-[#757575]" {...props} />,
                      blockquote: ({ node, ...props }) => (
                        <blockquote className="border-l-4 border-gray-300 pl-4 italic text-gray-600 my-4" {...props} />
                      ),
                      a: ({ node, ...props }) => {
                        const href = props.href || '';
                        const videoEmbed = renderVideoEmbed(href);
                        if (videoEmbed) return videoEmbed;
                        return <a className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer" {...props} />;
                      },
                      img: ({ node, src, alt, ...props }) => (
                        <img 
                          className="rounded-lg shadow-md my-6 max-w-full h-auto mx-auto" 
                          src={getImageUrl(src)} 
                          alt={alt}
                          {...props} 
                        />
                      ),
                    }}
                  >
                    {intro.content}
                  </ReactMarkdown>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-300 my-12"></div>

        {/* Related Introductions Section */}
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-[#002855] mb-8 text-center">Có thể bạn cũng thích</h2>
          
          {relatedIntros.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center mb-[10%]">
                {relatedIntros.map((relatedIntro) => (
                  <div key={relatedIntro.id} className="flex items-center h-[559px]">
                    <Link
                      to={`/book-introductions/${relatedIntro.slug}`}
                      className="group relative bg-white rounded-[96px] border border-gray-300 w-[370px] h-[559px] scale-95 opacity-100 overflow-hidden mt-32 hover:shadow-xl transition-shadow"
                    >
                      {/* Content */}
                      <div className="relative h-full flex flex-col">
                        {/* Middle Content */}
                        <div className="flex-1 flex flex-col justify-center space-y-6 mb-6 px-10">
                          {/* Tiêu đề */}
                          <h3 className="font-bold text-[#002855] uppercase text-xl">
                            {relatedIntro.title}
                          </h3>
                          
                          {/* Tác giả */}
                          {relatedIntro.relatedBook && relatedIntro.relatedBook.authors && relatedIntro.relatedBook.authors.length > 0 && (
                            <p className="text-[#757575] font-medium text-sm">
                              {relatedIntro.relatedBook.authors.join(', ')}
                            </p>
                          )}

                          {/* Nội dung */}
                          <p className="text-[#757575] line-clamp-3 text-sm">
                            {relatedIntro.content}
                          </p>

                          {/* Mô tả */}
                          <p className="text-[#757575] text-sm font-bold font-italic" style={{ fontStyle: 'italic' }}>
                            {relatedIntro.description}
                          </p>
                        </div>

                        {/* Bottom - Book Cover */}
                        {relatedIntro.relatedBook?.cover_image && (
                          <div className="mt-auto mx-auto w-[370px] h-[221px]">
                            <div className="relative w-full h-full rounded-[96px] overflow-hidden shadow-lg">
                              <img
                                src={getImageUrl(relatedIntro.relatedBook.cover_image) || relatedIntro.relatedBook.cover_image}
                                alt={relatedIntro.relatedBook.title}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  console.error('Image load error:', relatedIntro.relatedBook?.cover_image);
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

              {/* Pagination for Related Posts */}
              {totalPages > 1 && (
                <div className="mt-[10%]">
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
          ) : (
            <div className="text-center py-12 bg-white rounded-xl">
              <p className="text-gray-500">Không có bài viết liên quan</p>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default BookIntroductionDetailPage;
