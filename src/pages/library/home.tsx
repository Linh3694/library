import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { createSlug, getImageUrl } from '../../lib/utils';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select';
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from '../../components/ui/breadcrumb';
import { Input } from '../../components/ui/input';
import { Checkbox } from '../../components/ui/checkbox';

import { Search, ChevronDown, Loader2 } from 'lucide-react';
import { Pagination } from '../../components/ui/pagination';
import { libraryAPI, type Library } from '../../lib/api';

// Tạo categories và genres từ dữ liệu thực
const getUniqueCategories = (books: Library[]) => {
  const categories = new Set<string>();
  books.forEach(book => {
    if (book.category) categories.add(book.category);
    if (book.documentType) categories.add(book.documentType);
  });
  return ['Tất cả', ...Array.from(categories)];
};

// Lấy danh sách chủ đề duy nhất
const getUniqueSeries = (books: Library[]) => {
  const series = new Set<string>();
  books.forEach(book => {
    if (book.seriesName) series.add(book.seriesName);
  });
  return Array.from(series);
};



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
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded">
          <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
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
  
  // Thêm state cho API data
  const [books, setBooks] = useState<Library[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const booksPerPage = 20;
  const sortOptions = ['Mới nhất', 'Cũ nhất', 'A-Z', 'Z-A'];

  // Scroll to top khi component mount
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Load dữ liệu từ API
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await libraryAPI.getAllLibraries();
        setBooks(data);
      } catch (err) {
        console.error('Error fetching libraries:', err);
        setError('Không thể tải dữ liệu thư viện. Vui lòng thử lại.');
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  const handleSearch = () => {
    // Reset current page when searching
    setCurrentPage(1);
    // The actual filtering happens in filteredBooks
  };

  // Reset to first page when sortBy or filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [sortBy, isBookNew, isFeaturedBook, isAudioBook, selectedCategories, selectedSeries]);

  const filteredBooks = books.filter((library: Library) => {
    const matchesSearch = library.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         library.authors.some(author => author.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = selectedCategories.length === 0 || 
                           selectedCategories.some(cat => 
                             library.category?.includes(cat) || 
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

  const featuredBook = currentBooks.find((library: Library) => library.isFeaturedBook) || currentBooks[0];
  const regularBooks = currentBooks.filter((library: Library) => library._id !== featuredBook?._id);

  // Tạo danh sách categories và series từ dữ liệu
  const categories = getUniqueCategories(books);
  const seriesList = getUniqueSeries(books);

  return (
    <div className="min-h-screen bg-white">
    <div className="sticky top-0 z-10">
      {/* Header */}
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
              <BreadcrumbPage>Thư viện sách</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>



        <div className="flex gap-8">
          {/* Sidebar */}
          <div className="w-64 flex-shrink-0 pt-[7%]">
                          {/* Thể loại */}
              <div className={`bg-white rounded-lg p-6 `}>
                <h3 
                  className="font-bold text-lg text-[#002855] mb-4 flex items-center justify-between cursor-pointer"
                  onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                >
                  Thể loại
                  <ChevronDown className={`w-5 h-5 transition-transform duration-200 ${isCategoryOpen ? 'rotate-0' : '-rotate-90'}`} />
                </h3>
                {isCategoryOpen && (
                  <div className="space-y-3">
                    {categories.filter(cat => cat !== 'Tất cả').map((category: string) => (
                      <div key={category} className="flex items-center space-x-3">
                        <Checkbox
                          id={`category-${category}`}
                          checked={selectedCategories.includes(category)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setSelectedCategories([...selectedCategories, category]);
                            } else {
                              setSelectedCategories(selectedCategories.filter(cat => cat !== category));
                            }
                          }}
                        />
                        <label
                          htmlFor={`category-${category}`}
                          className={`text-sm cursor-pointer ${
                            selectedCategories.includes(category) ? 'font-medium text-[#002855]' : 'text-gray-700'
                          }`}
                        >
                          {category}
                        </label>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            {/* Chủ đề */}
              <div className="bg-white rounded-lg p-6">
                <h3 
                  className="font-bold text-lg text-[#002855] mb-4 flex items-center justify-between cursor-pointer"
                  onClick={() => setIsSeriesOpen(!isSeriesOpen)}
                >
                  Chủ đề
                  <ChevronDown className={`w-5 h-5 transition-transform duration-200 ${isSeriesOpen ? 'rotate-0' : '-rotate-90'}`} />
                </h3>
                {isSeriesOpen && (
                  <div className="space-y-3">
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
                            className={`text-sm cursor-pointer ${
                              selectedSeries.includes(series) ? 'font-medium text-[#002855]' : 'text-gray-700'
                            }`}
                          >
                            {series}
                          </label>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-gray-500">Chưa có chủ đề nào</p>
                    )}
                  </div>
                )}
              </div>

            {/* Phân loại */}
              <div className="bg-white rounded-lg p-6">
                <h3 
                  className="font-bold text-lg text-[#002855] mb-4 flex items-center justify-between cursor-pointer"
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
                        className={`text-sm cursor-pointer ${
                          isBookNew ? 'font-medium text-[#002855]' : 'text-gray-700'
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
                        className={`text-sm cursor-pointer ${
                          isFeaturedBook ? 'font-medium text-[#002855]' : 'text-gray-700'
                        }`}
                      >
                        Nổi bật
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
                        className={`text-sm cursor-pointer ${
                          isAudioBook ? 'font-medium text-[#002855]' : 'text-gray-700'
                        }`}
                      >
                        Sách Nói
                      </label>
                    </div>
                  </div>
                )}
              </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 pb-[10%]">
            {/* Search Bar */}
            <div className="mb-4">
              <div className="flex gap-3 items-center justify-center">
                <div className="flex-1 max-w-2xl">
                  <Input
                    type="text"
                    placeholder="Tìm kiếm tên"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleSearch();
                      }
                    }}
                    className="w-full"
                  />
                </div>
                <Button className="flex-shrink-0" onClick={handleSearch}>
                  <Search className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Results and Sort */}
            <div className="flex items-center gap-4 mb-6">
              <Badge variant="outline" className="p-2 text-sm bg-[#f8f8f8] text-[#757575] border-none rounded-2xl">
                {filteredBooks.length} kết quả
              </Badge>
              <div className="flex items-center">
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-[200px] bg-[#f8f8f8] text-[#757575] border-none rounded-2xl">
                    <SelectValue placeholder="Sắp xếp theo: Mới nhất" />
                  </SelectTrigger>
                  <SelectContent>
                    {sortOptions.map((option) => (
                      <SelectItem key={option} value={option}>
                        Sắp xếp theo: {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {loading ? (
              <div className="flex justify-center items-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-[#002855]" />
                <span className="ml-2 text-[#002855]">Đang tải dữ liệu...</span>
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <p className="text-red-500">{error}</p>
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
                <p className="text-gray-500">Chưa có thư viện nào</p>
              </div>
            ) : currentBooks.length > 0 ? (
              <div className="grid grid-cols-4 gap-8">
                {/* Featured Book - Chiếm 2 hàng */}
                {featuredBook && (
                    <Link 
                      to={`/library/book/${createSlug(featuredBook.title)}`}
                      className="col-span-2 row-span-2 bg-[#f6f6f6] rounded-[70px] overflow-hidden shadow-sm px-[10%] py-[5%] flex flex-col">
                     <div className="aspect-[5/6] pt-[5%] pb-5 relative flex justify-center items-center">
                      <BookImage
                        src={getImageUrl(featuredBook.coverImage)}
                        alt={featuredBook.title}
                        fallback="/hero-01.jpg"
                        className="w-[80%] h-full object-cover mx-auto shadow-lg"
                      />                     
                    </div>
                    <div className="flex-1 flex flex-col justify-between pb-4 px-10">
                      <div className="flex-1">
                        <p className="text-sm text-[#757575] line-clamp-2 min-h-[2.5rem]">{featuredBook.authors.join(', ')}</p>
                        <h3 className="font-bold text-lg line-clamp-2 min-h-[3rem]">{featuredBook.title}</h3>
                        <p className="text-sm text-[#757575] mb-3 line-clamp-1 min-h-[1.25rem]" style={{ fontStyle: 'italic' }}>
                          {featuredBook.isAudioBook ? `${featuredBook.category || featuredBook.documentType}` : (featuredBook.category || featuredBook.documentType)}
                        </p>
                        <p className="text-xs text-[#757575] line-clamp-3 mb-4">
                          {featuredBook.description?.content || 'Chưa có mô tả'}
                        </p>
                      </div>
                      <div className="flex gap-1 items-center justify-between mt-auto">
                        <div>
                        <Button size="sm" variant="ghost" className="font-bold text-[#757575] -ml-3">
                          Xem giới thiệu
                        </Button>
                       </div>
                          {featuredBook.isAudioBook && (
                           <div className="flex items-center gap-1">
                             <img src="/play.svg" alt="Play" className="w-4 h-4" />
                             <img src="/micro.svg" alt="Microphone" className="w-4 h-4" />
                           </div>
                         )}
                      </div>
                    </div>
                  </Link>
                )}

                {/* Regular Books - Grid 4 cột */}
                {regularBooks.map((book: Library) => (
                <Link 
                  key={book._id} 
                  to={`/library/book/${createSlug(book.title)}`}
                  className="bg-[#f6f6f6] rounded-[70px] overflow-hidden shadow-sm px-[20%] py-[10%] flex flex-col">
                     <div className="aspect-[5/6] pt-[8%] pb-[7%] relative flex justify-center items-center">
                      <BookImage
                        src={getImageUrl(book.coverImage)}
                        alt={book.title}
                        fallback="/hero-02.jpg"
                        className="w-[80%] h-full object-cover mx-auto shadow-lg"
                      />
      
                    </div>
                    <div className="flex-1 flex flex-col justify-between">
                      <div className="flex-1">
                        <p className="text-xs text-[#757575] line-clamp-2 min-h-[2.5rem]">{book.authors.join(', ')}</p>
                        <h3 className="font-semibold text-base line-clamp-2 min-h-[3.5rem]">{book.title}</h3>
                      </div>
                      <div className="flex gap-1 items-center justify-between mt-auto">
                        <div>
                        <Button size="sm" variant="ghost" className="font-bold text-[#757575] -ml-3">
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
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500">Không tìm thấy thư viện nào phù hợp</p>
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
                  maxVisiblePages={5}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default LibraryHomePage;
