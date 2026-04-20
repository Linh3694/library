import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  // ArrowUpRight 
} from 'lucide-react';
import { motion } from 'framer-motion';
import { publicLibraryService, type PublicLibraryTitle } from '../services/publicLibraryService';
import { getImageUrl } from '../lib/utils';
import { useDragScroll } from '../hooks/useDragScroll';

interface LibraryMegaMenuProps {
  isOpen: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onSearchClick?: () => void;
}

const LibraryMegaMenu: React.FC<LibraryMegaMenuProps> = ({ onMouseEnter, onMouseLeave /*, onSearchClick */ }) => {
  const [newBooks, setNewBooks] = useState<PublicLibraryTitle[]>([]);
  const [loading, setLoading] = useState(false);
  const {
    ref: scrollRef,
    onMouseDown,
    onMouseLeave: onDragLeave,
    onMouseUp,
    onMouseMove,
    handleLinkClick
  } = useDragScroll();

  useEffect(() => {
    const fetchNewBooks = async () => {
      setLoading(true);
      try {
        const response = await publicLibraryService.getNewTitles(5);
        if (response.success) {
          setNewBooks(response.data || []);
        }
      } catch (error) {
        console.error("Failed to fetch new books for mega menu", error);
      } finally {
        setLoading(false);
      }
    };
    fetchNewBooks();
  }, []);

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
      <div className="max-w-[1600px] mx-auto px-4 md:px-8 2xl:px-0 py-[20px] md:py-[30px] flex flex-col lg:flex-row gap-8 lg:gap-0">
        {/* Left Half (Categories) */}
        <div className="flex-1 lg:pr-10 flex flex-col gap-[30px] md:gap-[40px] lg:border-r border-light-gray pb-8 lg:pb-0 border-b lg:border-b-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-[48px]">
            {/* Column 1: Khám phá sách */}
            <div className="flex flex-col gap-[15px]">
              <h3 className="text-dark-gray text-sm font-medium">Khám phá sách</h3>
              <div className="flex flex-col gap-[10px]">
                <Link to="/library?filter=new" className="text-oxford text-base font-semibold hover:text-red-orange transition-colors">Sách mới</Link>
                <Link to="/library?filter=featured" className="text-oxford text-base font-semibold hover:text-red-orange transition-colors">Sách nổi bật</Link>
                <Link to="/library?filter=audio" className="text-oxford text-base font-semibold hover:text-red-orange transition-colors">Sách nói</Link>
                <Link to="/library" className="text-oxford text-base font-semibold hover:text-red-orange transition-colors">Tất cả</Link>
              </div>
            </div>

            {/* Column 2: Học liệu điện tử */}
            <div className="flex flex-col gap-[15px]">
              <h3 className="text-dark-gray text-sm font-medium">Học liệu điện tử</h3>
              <div className="flex flex-col gap-[10px]">
                <Link to="/library?level=tieuhoc" className="text-oxford text-base font-semibold hover:text-red-orange transition-colors">Tiểu Học</Link>
                <Link to="/library?level=thcs" className="text-oxford text-base font-semibold hover:text-red-orange transition-colors">THCS</Link>
                <Link to="/library?level=thpt" className="text-oxford text-base font-semibold hover:text-red-orange transition-colors">THPT</Link>
              </div>
            </div>

            {/* Column 3: Thảo luận - HIDDEN
            <div className="flex flex-col gap-[15px]">
              <h3 className="text-dark-gray text-sm font-medium">Thảo luận</h3>
              <div className="flex flex-col gap-[10px]">
                <Link to="#" className="text-oxford text-base font-semibold hover:text-red-orange transition-colors">Ý kiến độc giả</Link>
              </div>
            </div>
            */}
          </div>

          {/* 
          <div
            onClick={onSearchClick}
            className="flex items-center gap-[6px] group cursor-pointer"
          >
            <span className="text-oxford text-2xl font-semibold group-hover:text-red-orange transition-colors">Tìm Kiếm Sách</span>
            <div className="text-oxford group-hover:text-red-orange">
              <ArrowUpRight size={24} strokeWidth={2.2} />
            </div>
          </div>
          */}
        </div>

        {/* Right Half (Sách mới cập nhật) */}
        <div className="flex-1 lg:pl-10 flex flex-col gap-[15px]">
          <h3 className="text-dark-gray text-sm font-medium">Mới cập nhật</h3>
          <div
            ref={scrollRef}
            onMouseDown={onMouseDown}
            onMouseLeave={onDragLeave}
            onMouseUp={onMouseUp}
            onMouseMove={onMouseMove}
            className="flex gap-[15px] overflow-x-auto pb-2 hide-scrollbar cursor-grab active:cursor-grabbing select-none"
          >
            {loading ? (
              Array(4).fill(0).map((_, idx) => (
                <div key={idx} className="w-[144px] animate-pulse">
                  <div className="w-full h-[192px] bg-light-gray rounded-lg mb-2"></div>
                  <div className="h-4 bg-light-gray rounded w-3/4"></div>
                </div>
              ))
            ) : (
              newBooks.map((book) => (
                <Link
                  key={book._id}
                  to={`/library/book/${book.libraryTitle || book._id}`}
                  className="w-[144px] flex flex-col gap-[10px] group flex-shrink-0"
                  onClick={handleLinkClick}
                >
                  <div className="w-[144px] h-[192px] overflow-hidden">
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
              ))
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default LibraryMegaMenu;
