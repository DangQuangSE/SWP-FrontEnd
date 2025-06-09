import { persistor, store } from "./redux/store";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";

import "./App.css";
import Header from "./components/Layout/Header/Header";
import Hero from "./components/Sections/Hero/Hero";
import Services from "./components/Sections/Services/Services";
import Articles from "./components/Sections/Articles/Articles";
import Testimonials from "./components/Sections/Testimonials/Testimonials";
import Footer from "./components/Layout/Footer/Footer";
import { Routes, Route } from "react-router-dom";
import ServiceDangKi from "./components/Sections/Services/ServiceDangKi";
import { ToastContainer } from "react-toastify";
import StisTest from "./components/Sections/Services/StisTest";

function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <div className="app">
          <ToastContainer />
          <Header />
          <main className="main-content-app">
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
              <Route path="/services" element={<ServiceDangKi />} />
              <Route path="/appointment" element={<StisTest />} /> 
            </Routes>
          </main>
          <Footer />
        </div>
      </PersistGate>
    </Provider>
  );
}

export default App;
