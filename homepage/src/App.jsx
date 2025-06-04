import "./App.css";
import Header from "./components/Layout/Header/Header";
import Hero from "./components/Sections/Hero/Hero";
import Services from "./components/Sections/Services/Services";
import Articles from "./components/Sections/Articles/Articles";
import Testimonials from "./components/Sections/Testimonials/Testimonials";
import Footer from "./components/Layout/Footer/Footer";
import { Routes, Route } from "react-router-dom";
import LoginPage from "./pages/Login";

function App() {
  return (
    <div className="app">
      <Header />
      <main className="main-content">
        <Routes>
          <Route
            path="/"
            element={
              <>
                <Hero />
                <Services />
                <Articles />
                <Testimonials />
              </>
            }
          />
          <Route
            path="/homepage"
            element={
              <>
                <Hero />
                <Services />
                <Articles />
                <Testimonials />
              </>
            }
          />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
