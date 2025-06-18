import React from 'react';
import { Header, Footer, HeroSection, BookNew, BookFeatured, AudioBooks, Activities } from '../../components';

const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
        <div className="sticky top-0 z-1000">
      <Header userName="Nguyễn Hải Linh" />
      </div>
      <HeroSection />
      <BookNew />
      <BookFeatured />
      <AudioBooks />
      <Activities />
      <Footer />
    </div>
  );
};

export default HomePage; 