import { Header, HeroSection, BookNew, BookFeatured } from './components'

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header userName="Nguyễn Hải Linh" />
      <HeroSection />
      <BookNew />
      <BookFeatured />
    </div>
  )
}

export default App
