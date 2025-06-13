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
import AppointmentForm from "./components/Sections/Services/AppointmentForm";
import { ToastContainer } from "react-toastify";
import StisTest from "./components/Sections/Services/StisTest";
import ForgotPasswordOTP from "./components/authen-form/ForgotPassword";
import AllBlog from "./components/Sections/Articles/pages/allBlog";
import BlogDetail from "./components/Sections/Articles/pages/BlogDetail";
import Medicalnew from "./components/Sections/Articles/pages/Medicalnew";
import Servicevnew from "./components/Sections/Articles/pages/Servicenew";
import Generalnew from "./components/Sections/Articles/pages/Generalnew";
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
                    <div style={{ height: "2000px", background: "#f0f0f0" }}>
                      <h2 style={{ paddingTop: "100px", textAlign: "center" }}>
                        Cuộn xuống để kiểm tra Header scroll
                      </h2>
                    </div>
                  </>
                }
              />
              <Route path="/services" element={<AppointmentForm />} />
              <Route path="/appointment" element={<StisTest />} />
              <Route path="/forgot-password" element={<ForgotPasswordOTP />} />
              <Route path="/blog" element={<AllBlog />} />
              <Route path="/blog/:id" element={<BlogDetail />} />
              <Route path="/tin-y-te" element={<Medicalnew />} />
              <Route path="/tin-dich-vu" element={<Servicevnew />} />
              <Route path="/y-hoc-thuong-thuc" element={<Generalnew />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </PersistGate>
    </Provider>
  );
}

export default App;
