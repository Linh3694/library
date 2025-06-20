import { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { createSlug } from '../../lib/utils';
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
import { Search, ChevronDown } from 'lucide-react';
import { Pagination } from '../../components/ui/pagination';

// Mock data cho sách
const mockBooks = [
  {
    id: 1,
    title: "TƯƠNG LAI SAU ĐẠI DÍCH COVID",
    author: "Jason Schenker",
    description: "Những kỳ vọng của một nhà tương lai học về các địa điểm, thách thức và kể cả kịch bản tốt đặc và những cơ hội mới chứa từng có.",
    category: "Thảm hiểm, Trinh suy",
    image: "/hero-01.jpg", // Sử dụng ảnh có sẵn
    isFeatured: true
  },
  // Thêm 19 sách khác để có đủ 20 sách
  ...Array.from({ length: 19 }, (_, i) => ({
    id: i + 2,
    title: `TƯƠNG LAI SAU ĐẠI DÍCH COVID`,
    author: "Jason Schenker",
    description: "Mô tả ngắn gọn về cuốn sách này...",
    category: "Thảm hiểm, Trinh suy",
    image: "/hero-02.jpg",
    isFeatured: false
  }))
];

const categories = [
  "Tất cả",
  "Giáo khoa sách",
  "Sách nội",
  "Văn học",
  "Khoa học",
  "Lịch sử",
  "Nghệ thuật"
];

const genres = [
  "Tất cả",
  "Tiểu thuyết",
  "Truyện tranh",
  "Sách giáo khoa",
  "Tham khảo",
  "Nghiên cứu"
];

const LibraryHomePage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Tất cả');
  const [selectedGenre, setSelectedGenre] = useState('Tất cả');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState('Mới nhất');
  const [isCategoryOpen, setIsCategoryOpen] = useState(true);
  const [isGenreOpen, setIsGenreOpen] = useState(true);

  const booksPerPage = 20;
  const totalBooks = mockBooks.length;
  const totalPages = Math.ceil(totalBooks / booksPerPage);

  const sortOptions = ['Mới nhất', 'Cũ nhất', 'A-Z', 'Z-A'];

  const handleSearch = () => {
    // Reset current page when searching
    setCurrentPage(1);
    // The actual filtering happens in filteredBooks
  };

  const filteredBooks = mockBooks.filter(book => {
    const matchesSearch = book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         book.author.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'Tất cả' || book.category.includes(selectedCategory);
    const matchesGenre = selectedGenre === 'Tất cả' || book.category.includes(selectedGenre);
    
    return matchesSearch && matchesCategory && matchesGenre;
  });

  const currentBooks = filteredBooks.slice(
    (currentPage - 1) * booksPerPage,
    currentPage * booksPerPage
  );

  const featuredBook = currentBooks.find(book => book.isFeatured) || currentBooks[0];
  const regularBooks = currentBooks.filter(book => book.id !== featuredBook?.id);

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
                    {categories.map((category) => (
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
                    {genres.map((genre) => (
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
          <div className="flex-1">
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

            {currentBooks.length > 0 ? (
              <div className="grid grid-cols-4 gap-8">
                {/* Featured Book - Chiếm 2 hàng */}
                {featuredBook && (
                    <Link 
                      to={`/library/book/${createSlug(featuredBook.title)}`}
                      className="col-span-2 row-span-2 bg-[#f6f6f6] rounded-[70px] overflow-hidden shadow-sm px-[15%] py-[5%]">
                     <div className="aspect-[5/6] pt-[5%] pb-[3%] relative flex justify-center items-center">
                      <img
                        src={featuredBook.image}
                        alt={featuredBook.title}
                        className="w-[80%] h-full object-cover"
                      />
                    </div>
                    <div className="pb-4 px-10">
                      <p className="text-sm text-[#757575] mb-1">{featuredBook.author}</p>
                      <h3 className="font-bold text-lg mb-2 line-clamp-2">{featuredBook.title}</h3>
                      <p className="text-sm text-[#757575] mb-3" style={{ fontStyle: 'italic' }}>{featuredBook.category}</p>
                      <p className="text-xs text-[#757575] line-clamp-3 mb-4">
                        {featuredBook.description}
                      </p>
                      <div className="flex gap-2">
                        <Button size="sm" variant="ghost" className="font-bold text-[#757575] -ml-3">
                          Xem giới thiệu
                        </Button>
                      </div>
                    </div>
                  </Link>
                )}

                {/* Regular Books - Grid 4 cột */}
                {regularBooks.map((book) => (
                <Link 
                  key={book.id} 
                  to={`/library/book/${createSlug(book.title)}`}
                  className="bg-[#f6f6f6] rounded-[70px] overflow-hidden shadow-sm px-[20%] py-[5%]">
                     <div className="aspect-[5/6] pt-[8%] pb-[4%] relative flex justify-center items-center">
                      <img
                        src={book.image}
                        alt={book.title}
                        className="w-[80%] h-[90%] object-cover"
                      />
                    </div>
                    <div className="pb-0 space-y-3">
                      <p className="text-xs text-[#757575]">{book.author}</p>
                      <h3 className="font-semibold text-sm  line-clamp-2">{book.title}</h3>
                      <p className="text-xs text-[#757575]" style={{ fontStyle: 'italic' }}>{book.category}</p>
                      <div className="flex gap-1">
                        <Button size="sm" variant="ghost" className="font-bold text-[#757575] -ml-3">
                          Mở rộng
                        </Button>
                       
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500">Không tìm thấy sách nào phù hợp</p>
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
