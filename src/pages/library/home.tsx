import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
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
import { RadioGroup, RadioGroupItem } from '../../components/ui/radio-group';
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

const getUniqueGenres = (books: Library[]) => {
  const genres = new Set<string>();
  books.forEach(book => {
    if (book.category) genres.add(book.category);
    if (book.documentType) genres.add(book.documentType);
    if (book.seriesName) genres.add(book.seriesName);
  });
  return ['Tất cả', ...Array.from(genres)];
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
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Tất cả');
  const [selectedGenre, setSelectedGenre] = useState('Tất cả');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState('Mới nhất');
  const [isCategoryOpen, setIsCategoryOpen] = useState(true);
  const [isGenreOpen, setIsGenreOpen] = useState(true);
  
  // Thêm state cho API data
  const [books, setBooks] = useState<Library[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const booksPerPage = 20;
  const sortOptions = ['Mới nhất', 'Cũ nhất', 'A-Z', 'Z-A'];

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

  const filteredBooks = books.filter((library: Library) => {
    const matchesSearch = library.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         library.authors.some(author => author.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'Tất cả' || 
                           library.category?.includes(selectedCategory) || 
                           library.documentType?.includes(selectedCategory);
    const matchesGenre = selectedGenre === 'Tất cả' || 
                        library.category?.includes(selectedGenre) || 
                        library.documentType?.includes(selectedGenre) ||
                        library.seriesName?.includes(selectedGenre);
    
    return matchesSearch && matchesCategory && matchesGenre;
  });

  // Sắp xếp thư viện
  const sortedBooks = [...filteredBooks].sort((a: Library, b: Library) => {
    switch (sortBy) {
      case 'Cũ nhất':
        return (a.publishYear || 0) - (b.publishYear || 0);
      case 'A-Z':
        return a.title.localeCompare(b.title);
      case 'Z-A':
        return b.title.localeCompare(a.title);
      case 'Mới nhất':
      default:
        return (b.publishYear || 0) - (a.publishYear || 0);
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

  // Tạo danh sách categories và genres từ dữ liệu
  const categories = getUniqueCategories(books);
  const genres = getUniqueGenres(books);

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
                  <RadioGroup
                    value={selectedCategory}
                    onValueChange={setSelectedCategory}
                  >
                    {categories.map((category: string) => (
                      <div key={category} className="flex items-center space-x-2">
                        <RadioGroupItem value={category} id={`category-${category}`} />
                        <label
                          htmlFor={`category-${category}`}
                          className={`text-sm cursor-pointer ${
                            selectedCategory === category ? 'font-medium text-[#002855]' : 'text-gray-700'
                          }`}
                        >
                          {category}
                        </label>
                      </div>
                    ))}
                  </RadioGroup>
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
                    {genres.map((genre: string) => (
                      <div key={genre} className="flex items-center space-x-3">
                        <Checkbox
                          id={`genre-${genre}`}
                          checked={selectedGenre === genre}
                          onCheckedChange={(checked) => setSelectedGenre(checked ? genre : 'Tất cả')}
                        />
                        <label
                          htmlFor={`genre-${genre}`}
                          className={`text-sm cursor-pointer ${
                            selectedGenre === genre ? 'font-medium text-[#002855]' : 'text-gray-700'
                          }`}
                        >
                          {genre}
                        </label>
                      </div>
                    ))}
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
