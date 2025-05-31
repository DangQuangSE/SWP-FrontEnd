import "./App.css"

// Import Components
import Header from "./components/Layout/Header/Header"
import Hero from "./components/Sections/Hero/Hero"
import Services from "./components/Sections/Services/Services"
import Articles from "./components/Sections/Articles/Articles"
import Testimonials from "./components/Sections/Testimonials/Testimonials" // This now contains the doctor team
import Footer from "./components/Layout/Footer/Footer"

function App() {
  return (
    <div className="app">
      <Header />

      <main className="main-content">
        <Hero />
        <Services />
        <Articles />
        <Testimonials />
      </main>

      <Footer />
    </div>
  )
}

export default App
