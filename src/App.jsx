import { persistor, store } from "./redux/store";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import DoctorList from "./components/Sections/Services/DoctorList/DoctorList";
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
import CycleTracker from "./components/Sections/Services/CycleTracker/CycleTracker";
import DoctorList from "./components/Sections/Services/DoctorList/DoctorList";
import Loading from "./components/Loading/Loading";
import { useEffect, useState } from "react

function App() {
  const [rehydrated, setRehydrated] = useState(false);

  useEffect(() => {
    setTimeout(() => setRehydrated(true), 5000); // 2 giây
  }, []);

  if (!rehydrated) return <Loading />;
  console.log("App component rendered");
  return (
    <Provider store={store}>
      <PersistGate loading={<Loading />} persistor={persistor}>
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
              <Route path="/services" element={<AppointmentForm />} />
              <Route path="/CycleTracker" element={<CycleTracker/>}/>
              <Route
                path="/services/DoctorList"
                element={
                  <>
                    {console.log("Rendering DoctorList route")}
                    <DoctorList />
                  </>
                }
              />
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
