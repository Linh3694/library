import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './pages/home/home';
import LibraryHomePage from './pages/library/home';
import BookDetailPage from './pages/library/bookDetail';
import ActivitiesHomePage from './pages/activities/home';

function App() {
  return (
    <Router>
      <Routes>
        {/* Trang chủ mặc định */}
        <Route path="/" element={<HomePage />} />
        
        {/* Trang thư viện */}
        <Route path="/library" element={<LibraryHomePage />} />
        
        {/* Trang chi tiết sách */}
        <Route path="/library/book/:slug" element={<BookDetailPage />} />

        {/* Trang hoạt động */}
        <Route path="/activities" element={<ActivitiesHomePage />} />
        
        {/* Redirect các route không tồn tại về trang chủ */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
