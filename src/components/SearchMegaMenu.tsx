import React, { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Search } from 'lucide-react';
import { motion } from 'framer-motion';
import { publicLibraryService, type PublicLibraryTitle } from '../services/publicLibraryService';
import { getImageUrl } from '../lib/utils';
import { useDragScroll } from '../hooks/useDragScroll';

interface SearchMegaMenuProps {
  isOpen: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onLibraryClick?: () => void;
}

const SearchMegaMenu: React.FC<SearchMegaMenuProps> = ({ onMouseEnter, onMouseLeave }) => {
  const [allBooks, setAllBooks] = useState<PublicLibraryTitle[]>([]);
  const [featuredBooks, setFeaturedBooks] = useState<PublicLibraryTitle[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const {
    ref: scrollRef,
    onMouseDown,
    onMouseLeave: onDragLeave,
    onMouseUp,
    onMouseMove,
    handleLinkClick
  } = useDragScroll();

  useEffect(() => {
    const fetchData = async () => {
      // Fetch featured books independently for immediate display
      const fetchFeatured = async () => {
        try {
          const featuredResponse = await publicLibraryService.getFeaturedTitles(5);
          if (featuredResponse.success) {
            setFeaturedBooks(featuredResponse.data || []);
          }
        } catch (error) {
          console.error("Failed to fetch featured books", error);
        }
      };

      // Fetch all titles for search in background
      const fetchAll = async () => {
        try {
          const allResponse = await publicLibraryService.getAllTitles(0);
          if (allResponse.success) {
            setAllBooks(allResponse.data || []);
          }
        } catch (error) {
          console.error("Failed to fetch all titles", error);
        } finally {
          // fetchAll finished
        }
      };

      // Start both, but let them finish and update state independently
      fetchFeatured();
      fetchAll();
    };
    fetchData();
  }, []);

  const filteredResults = useMemo(() => {
    if (!searchTerm.trim()) return { authors: [], titles: [], books: [] };

    const term = searchTerm.toLowerCase();

    const authorMatches = Array.from(new Set(
      allBooks
        .flatMap(book => book.authors)
        .filter(author => author.toLowerCase().includes(term))
    )).slice(0, 5);

    const titleMatches = allBooks
      .filter(book => book.title.toLowerCase().includes(term))
      .slice(0, 5);

    const bookMatches = allBooks
      .filter(book =>
        book.title.toLowerCase().includes(term) ||
        book.authors.some(a => a.toLowerCase().includes(term))
      )
      .slice(0, 5);

    return {
      authors: authorMatches,
      titles: titleMatches,
      books: bookMatches
    };
  }, [searchTerm, allBooks]);

  const hasResults = filteredResults.authors.length > 0 || filteredResults.titles.length > 0 || filteredResults.books.length > 0;

  return (
    <motion.div
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: 'auto', opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="w-full bg-background/80 backdrop-blur-[16px] border-b border-light-gray z-50 overflow-hidden"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div className="max-w-[1600px] mx-auto px-4 md:px-8 2xl:px-0 py-[20px] md:py-[30px] flex flex-col gap-[20px]">
        {/* Header Row */}
        <div className="flex justify-between items-end">
          <h2 className="text-oxford text-2xl font-semibold">Tìm Kiếm Sách</h2>
          <Link
            to="/library"
            className="text-oxford text-sm font-semibold hover:text-red-orange transition-colors cursor-pointer"
          >
            Mở thư viện sách
          </Link>
        </div>

        {/* Search Bar */}
        <div className="w-full h-[48px] px-3 bg-semi-white rounded-[30px] flex items-center gap-[10px]">
          <Search size={24} className="text-medium-gray" />
          <input
            type="text"
            placeholder="Tìm kiếm tên sách, tác giả..."
            className="flex-1 bg-transparent border-none outline-none text-xl font-semibold text-oxford placeholder:text-medium-gray"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            autoFocus
          />
        </div>

        {/* Content Area - Stacked on mobile, 50/50 on desktop */}
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-0 pt-4">
          {/* Left Half (Gợi ý / Kết quả) */}
          <div className="flex-1 lg:pr-10 flex flex-col gap-[20px] md:gap-[30px] lg:border-r border-light-gray pb-8 lg:pb-0 border-b lg:border-b-0">
            {searchTerm.trim() ? (
              hasResults ? (
                <>
                  <h3 className="text-dark-gray text-sm font-medium">Gợi ý tìm kiếm</h3>
                  {/* Tác giả */}
                  {filteredResults.authors.length > 0 && (
                    <div className="flex flex-col gap-[10px]">
                      <h4 className="text-dark-gray text-sm font-medium">Tác giả</h4>
                      <div className="flex flex-col gap-[10px]">
                        {filteredResults.authors.map((author, index) => (
                          <Link
                            key={index}
                            to={`/library?search=${encodeURIComponent(author)}`}
                            className="text-oxford text-base font-semibold hover:text-red-orange transition-colors"
                          >
                            {author}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Sách */}
                  {filteredResults.titles.length > 0 && (
                    <div className="flex flex-col gap-[10px]">
                      <h4 className="text-dark-gray text-sm font-medium">Sách</h4>
                      <div className="flex flex-col gap-[10px]">
                        {filteredResults.titles.map((book) => (
                          <Link
                            key={book._id}
                            to={`/library/book/${book.libraryTitle || book._id}`}
                            className="group flex items-baseline gap-1"
                          >
                            <span className="text-oxford text-base font-semibold group-hover:text-red-orange transition-colors">
                              {searchTerm}
                            </span>
                            <span className="text-dark-gray text-base font-semibold">
                              {book.title.toLowerCase().startsWith(searchTerm.toLowerCase())
                                ? book.title.substring(searchTerm.length)
                                : book.title}
                            </span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="py-10 text-center">
                  <p className="text-dark-gray italic">Không tìm thấy kết quả phù hợp cho "{searchTerm}"</p>
                </div>
              )
            ) : (
              <div className="flex flex-col gap-4">
                <h3 className="text-dark-gray text-sm font-medium">Từ khóa phổ biến</h3>
                <div className="flex flex-wrap gap-2">
                  {['Harry Potter', 'Lịch sử', 'Kinh tế', 'Văn học'].map(tag => (
                    <span
                      key={tag}
                      onClick={() => setSearchTerm(tag)}
                      className="px-4 py-2 bg-semi-white rounded-full text-sm text-oxford cursor-pointer hover:bg-red-orange hover:text-white transition-colors"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Half (Sách nổi bật / liên quan) */}
          <div className="flex-1 lg:pl-10 flex flex-col gap-[15px]">
            <h3 className="text-dark-gray text-sm font-medium">
              {searchTerm.trim() ? "Sách liên quan" : "Sách nổi bật"}
            </h3>
            <div
              ref={scrollRef}
              onMouseDown={onMouseDown}
              onMouseLeave={onDragLeave}
              onMouseUp={onMouseUp}
              onMouseMove={onMouseMove}
              className="flex gap-[15px] overflow-x-auto pb-2 hide-scrollbar cursor-grab active:cursor-grabbing select-none"
            >
              {(searchTerm.trim() ? filteredResults.books : featuredBooks).map((book) => (
                <Link
                  key={book._id}
                  to={`/library/book/${book.libraryTitle || book._id}`}
                  className="w-[144px] flex flex-col gap-[10px] group flex-shrink-0"
                  onClick={handleLinkClick}
                >
                  <div className="w-[144px] h-[192px] overflow-hidden bg-light-gray">
                    <img
                      src={getImageUrl(book.coverImage) || 'https://placehold.co/144x192'}
                      alt={book.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 pointer-events-none"
                    />
                  </div>
                  <h4 className="text-oxford text-sm font-semibold line-clamp-2 group-hover:text-red-orange transition-colors">
                    {book.title}
                  </h4>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default SearchMegaMenu;
