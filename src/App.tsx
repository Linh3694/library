import { Header, HeroSection, BookNew, BookFeatured, AudioBooks } from './components'

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header userName="Nguyễn Hải Linh" />
      <HeroSection />
      <BookNew />
      <BookFeatured />
      <AudioBooks />
    </div>
  )
}

export default App
