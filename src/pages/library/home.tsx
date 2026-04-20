import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { createSlug, getImageUrl, stripNumericSuffix } from '../../lib/utils';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select';
import Breadcrumbs from '../../components/Breadcrumbs';
import { Input } from '../../components/ui/input';
import { Checkbox } from '../../components/ui/checkbox';

import { Search, ChevronDown, Loader2, SlidersHorizontal, X } from 'lucide-react';
import { Pagination } from '../../components/ui/pagination';
import { libraryAPI, type Library, type LookupItem } from '../../lib/api';



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
  const [isLoading, setIsLoading] = useState(true);
  const [currentSrc, setCurrentSrc] = useState(src || fallback);

  useEffect(() => {
    setCurrentSrc(src || fallback);
    setIsLoading(true);
  }, [src, fallback]);

  const handleLoad = () => {
    setIsLoading(false);
  };

  const handleError = () => {
    console.error('❌ Image failed to load:', src);
    console.error('❌ Processed URL:', getImageUrl(src));
    setIsLoading(false);
    if (currentSrc !== fallback) {
      setCurrentSrc(fallback);
    }
  };

  return (
    <div className="relative w-full h-full">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-semi-white rounded">
          <Loader2 className="w-6 h-6 animate-spin text-dark-gray" />
        </div>
      )}
      <img
        src={currentSrc}
        alt={alt}
        className={`${className} ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
        onLoad={handleLoad}
        onError={handleError}
      />
    </div>
  );
};

const LibraryHomePage = () => {
  const [searchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedSeries, setSelectedSeries] = useState<string[]>([]);
  const [isBookNew, setIsBookNew] = useState(searchParams.get('filter') === 'new');
  const [isFeaturedBook, setIsFeaturedBook] = useState(searchParams.get('filter') === 'featured');
  const [isAudioBook, setIsAudioBook] = useState(searchParams.get('filter') === 'audio');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState('Mới nhất');
  const [isCategoryOpen, setIsCategoryOpen] = useState(true);
  const [isSeriesOpen, setIsSeriesOpen] = useState(true);
  const [isGenreOpen, setIsGenreOpen] = useState(true);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // State cho API data
  const [books, setBooks] = useState<Library[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // State cho lookups từ admin (nguồn chính thống)
  const [documentTypes, setDocumentTypes] = useState<string[]>([]);
  const [seriesList, setSeriesList] = useState<string[]>([]);

  const booksPerPage = 20;
  const sortOptions = ['Mới nhất', 'Cũ nhất', 'A-Z', 'Z-A'];

  // Scroll to top khi component mount
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Load sách và lookups song song
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [booksData, lookupsData] = await Promise.all([
          libraryAPI.getAllLibraries(),
          libraryAPI.getLookups().catch(() => [] as LookupItem[]),
        ]);

        setBooks(booksData);

        // Phân loại lookups theo type
        const docTypes = lookupsData
          .filter((l) => l.type === 'document_type')
          .map((l) => l.name)
          .filter(Boolean);
        const series = lookupsData
          .filter((l) => l.type === 'series')
          .map((l) => l.name)
          .filter(Boolean);

        setDocumentTypes(docTypes);
        setSeriesList(series);
      } catch (err) {
        console.error('Error fetching libraries:', err);
        setError('Không thể tải dữ liệu thư viện. Vui lòng thử lại.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Reset to first page when sortBy, filters or searchTerm change
  useEffect(() => {
    setCurrentPage(1);
  }, [sortBy, isBookNew, isFeaturedBook, isAudioBook, selectedCategories, selectedSeries, searchTerm]);

  // Xử lý filter theo cấp học từ URL
  useEffect(() => {
    const level = searchParams.get('level');
    if (level && seriesList.length > 0) {
      let keywords: string[] = [];
      if (level === 'thpt') keywords = ['lớp 10', 'lớp 11', 'lớp 12'];
      else if (level === 'thcs') keywords = ['lớp 6', 'lớp 7', 'lớp 8', 'lớp 9'];
      else if (level === 'tieuhoc') keywords = [
        'lớp 1', 'lớp 2', 'lớp 3', 'lớp 4', 'lớp 5'
      ];

      if (keywords.length > 0) {
        const matchedSeries = seriesList.filter(s =>
          keywords.some(k => {
            const regex = new RegExp(`${k}(?!\\d)`, 'i');
            return regex.test(s);
          })
        );
        setSelectedSeries(matchedSeries);
      }
    }
  }, [searchParams, seriesList]);

  const filteredBooks = books.filter((library: Library) => {
    const matchesSearch = library.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      library.authors.some(author => author.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesCategory = selectedCategories.length === 0 ||
      selectedCategories.some(cat =>
        library.documentType?.includes(cat)
      );

    const matchesSeries = selectedSeries.length === 0 ||
      (library.seriesName && selectedSeries.includes(library.seriesName));

    const matchesBookType = (!isFeaturedBook || library.isFeaturedBook) &&
      (!isAudioBook || library.isAudioBook) &&
      (!isBookNew || library.isNewBook);

    return matchesSearch && matchesCategory && matchesSeries && matchesBookType;
  });

  // Sắp xếp thư viện
  const sortedBooks = [...filteredBooks].sort((a: Library, b: Library) => {
    switch (sortBy) {
      case 'Cũ nhất': {
        // Sắp xếp theo ngày thêm vào hệ thống (cũ nhất trước)
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return dateA - dateB;
      }
      case 'A-Z':
        return a.title.localeCompare(b.title, 'vi', { sensitivity: 'base' });
      case 'Z-A':
        return b.title.localeCompare(a.title, 'vi', { sensitivity: 'base' });
      case 'Mới nhất':
      default: {
        // Sắp xếp theo ngày thêm vào hệ thống (mới nhất trước)
        const newDateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const newDateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return newDateB - newDateA;
      }
    }
  });

  const totalBooks = sortedBooks.length;
  const totalPages = Math.ceil(totalBooks / booksPerPage);

  const currentBooks = sortedBooks.slice(
    (currentPage - 1) * booksPerPage,
    currentPage * booksPerPage
  );

  const allBooks = currentBooks;

  return (
    <div className="min-h-screen bg-background">
      <div className="sticky top-0 z-10">
        {/* Header */}
        <Header />
      </div>
      {/* Main Content */}
      <div className="max-w-[1600px] mx-auto px-4 md:px-8 2xl:px-0 py-6">
        {/* Breadcrumb */}
        <Breadcrumbs items={[{ label: 'Thư viện sách' }]} className="mb-9" />



        {/* Mobile Filter Toggle */}
        <div className="lg:hidden mb-6 flex justify-between items-center">
          <Button
            variant="outline"
            onClick={() => setShowMobileFilters(!showMobileFilters)}
            className="flex items-center gap-2 rounded-2xl border-none bg-semi-white text-oxford"
          >
            <SlidersHorizontal className="w-4 h-4" />
            Bộ lọc
          </Button>
          <Badge variant="outline" className="p-2 text-sm bg-semi-white text-dark-gray border-none rounded-2xl">
            {filteredBooks.length} kết quả
          </Badge>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className={`
            lg:block lg:w-64 flex-shrink-0 
            ${showMobileFilters ? 'block' : 'hidden'}
            fixed lg:static inset-0 z-50 lg:z-0
            bg-background lg:bg-transparent overflow-y-auto lg:overflow-visible
            p-6 lg:p-0
          `}>
            {/* Mobile Sidebar Header */}
            <div className="flex justify-between items-center mb-6 lg:hidden">
              <h2 className="text-xl font-bold text-oxford">Bộ lọc</h2>
              <Button variant="ghost" size="icon" onClick={() => setShowMobileFilters(false)}>
                <X className="w-6 h-6" />
              </Button>
            </div>
            {/* Unified Filter Sidebar Block */}
            <div className="bg-background px-3 pb-3 space-y-4">
              {/* Phân loại tài liệu (đồng bộ lookup document_type từ admin) */}
              <div>
                <h3
                  className="font-bold text-lg text-oxford mb-4 flex items-center justify-between cursor-pointer"
                  onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                >
                  Phân loại tài liệu
                  <ChevronDown className={`w-5 h-5 transition-transform duration-200 ${isCategoryOpen ? 'rotate-0' : '-rotate-90'}`} />
                </h3>
                {isCategoryOpen && (
                  <div className="relative">
                    <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                      {documentTypes.length > 0 ? (
                        documentTypes.map((docType: string) => (
                          <div key={docType} className="flex items-center space-x-3">
                            <Checkbox
                              id={`category-${docType}`}
                              checked={selectedCategories.includes(docType)}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  setSelectedCategories([...selectedCategories, docType]);
                                } else {
                                  setSelectedCategories(selectedCategories.filter(cat => cat !== docType));
                                }
                              }}
                            />
                            <label
                              htmlFor={`category-${docType}`}
                              className={`text-sm cursor-pointer ${selectedCategories.includes(docType) ? 'font-medium text-oxford' : 'text-dark-gray'
                                }`}
                            >
                              {stripNumericSuffix(docType)}
                            </label>
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-dark-gray">Chưa có phân loại nào</p>
                      )}
                    </div>
                    {/* Gradient Fade Out */}
                    <div className="absolute bottom-0 left-0 right-2 h-12 bg-gradient-to-t from-background via-background/40 to-transparent pointer-events-none z-10" />
                  </div>
                )}
              </div>

              {/* Chủ đề */}
              <div>
                <h3
                  className="font-bold text-lg text-oxford mb-4 flex items-center justify-between cursor-pointer"
                  onClick={() => setIsSeriesOpen(!isSeriesOpen)}
                >
                  Chủ đề
                  <ChevronDown className={`w-5 h-5 transition-transform duration-200 ${isSeriesOpen ? 'rotate-0' : '-rotate-90'}`} />
                </h3>
                {isSeriesOpen && (
                  <div className="relative">
                    <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                      {seriesList.length > 0 ? (
                        seriesList.map((series: string) => (
                          <div key={series} className="flex items-center space-x-3">
                            <Checkbox
                              id={`series-${series}`}
                              checked={selectedSeries.includes(series)}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  setSelectedSeries([...selectedSeries, series]);
                                } else {
                                  setSelectedSeries(selectedSeries.filter(s => s !== series));
                                }
                              }}
                            />
                            <label
                              htmlFor={`series-${series}`}
                              className={`text-sm cursor-pointer ${selectedSeries.includes(series) ? 'font-medium text-oxford' : 'text-dark-gray'
                                }`}
                            >
                              {stripNumericSuffix(series)}
                            </label>
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-dark-gray">Chưa có chủ đề nào</p>
                      )}
                    </div>
                    {/* Gradient Fade Out */}
                    <div className="absolute bottom-0 left-0 right-2 h-12 bg-gradient-to-t from-background via-background/40 to-transparent pointer-events-none z-10" />
                  </div>
                )}
              </div>

              {/* Phân loại */}
              <div>
                <h3
                  className="font-bold text-lg text-oxford mb-4 flex items-center justify-between cursor-pointer"
                  onClick={() => setIsGenreOpen(!isGenreOpen)}
                >
                  Phân loại
                  <ChevronDown className={`w-5 h-5 transition-transform duration-200 ${isGenreOpen ? 'rotate-0' : '-rotate-90'}`} />
                </h3>
                {isGenreOpen && (
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <Checkbox
                        id="book-new"
                        checked={isBookNew}
                        onCheckedChange={(checked) => setIsBookNew(checked === true)}
                      />
                      <label
                        htmlFor="book-new"
                        className={`text-sm cursor-pointer ${isBookNew ? 'font-medium text-oxford' : 'text-dark-gray'
                          }`}
                      >
                        Sách Mới
                      </label>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Checkbox
                        id="featured-book"
                        checked={isFeaturedBook}
                        onCheckedChange={(checked) => setIsFeaturedBook(checked === true)}
                      />
                      <label
                        htmlFor="featured-book"
                        className={`text-sm cursor-pointer ${isFeaturedBook ? 'font-medium text-oxford' : 'text-dark-gray'
                          }`}
                      >
                        Sách Nổi bật
                      </label>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Checkbox
                        id="audio-book"
                        checked={isAudioBook}
                        onCheckedChange={(checked) => setIsAudioBook(checked === true)}
                      />
                      <label
                        htmlFor="audio-book"
                        className={`text-sm cursor-pointer ${isAudioBook ? 'font-medium text-oxford' : 'text-dark-gray'
                          }`}
                      >
                        Sách Nói
                      </label>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 pb-[10%]">
            {/* Search Bar */}
            <div className="mb-6 md:mb-8">
              <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-center">
                <div className="flex-1 max-w-2xl relative">
                  <Input
                    type="text"
                    placeholder="Tìm kiếm tên..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 h-10 rounded-2xl border-none bg-semi-white"
                  />
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-gray" />
                </div>
              </div>
            </div>

            {/* Results and Sort - Hide on mobile if already shown in Filter toggle */}
            <div className="hidden lg:flex items-center gap-4 mb-6">
              <Badge variant="outline" className="p-2 px-4 text-sm bg-semi-white text-dark-gray border-none rounded-2xl">
                {filteredBooks.length} kết quả
              </Badge>
              <div className="flex items-center">
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-[220px] bg-semi-white text-dark-gray border-none rounded-2xl h-10">
                    <SelectValue placeholder="Sắp xếp theo: Mới nhất" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-none">
                    {sortOptions.map((option) => (
                      <SelectItem key={option} value={option} className="hover:bg-semi-white transition-colors">
                        Sắp xếp theo: {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {loading ? (
              <div className="flex justify-center items-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-oxford" />
                <span className="ml-2 text-oxford">Đang tải dữ liệu...</span>
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <p className="text-destructive">{error}</p>
                <Button
                  onClick={() => window.location.reload()}
                  className="mt-4"
                  variant="outline"
                >
                  Thử lại
                </Button>
              </div>
            ) : books.length === 0 && !loading && !error ? (
              <div className="text-center py-12">
                <p className="text-dark-gray">Chưa có thư viện nào</p>
              </div>
            ) : currentBooks.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">

                {/* Book Grid - Uniform Layout */}
                {allBooks.map((book: Library) => (
                  <Link
                    key={book._id}
                    to={`/library/book/${createSlug(book.title)}`}
                    className="bg-semi-white rounded-[70px] p-8 md:p-10 flex flex-col items-center group transition-all duration-400">
                    {/* Image Section */}
                    <div className="mb-[29px]">
                      <BookImage
                        src={getImageUrl(book.coverImage)}
                        alt={book.title}
                        fallback="/book-placeholder.png"
                        className="w-[150px] h-[200px] object-cover drop-shadow-[0_4px_15px_rgba(0,0,0,0.25)] rounded-sm group-hover:scale-105 transition-all duration-300"
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
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-dark-gray">Không tìm thấy thư viện nào phù hợp</p>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-8">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                  showPrevNext={true}
                  showFirstLast={false}
                  maxVisiblePages={window.innerWidth < 768 ? 3 : 5}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div >
  );
};

export default LibraryHomePage;
