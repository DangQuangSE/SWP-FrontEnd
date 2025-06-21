import { useEffect, useState } from "react";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";

import { store, persistor } from "./redux/store";
import "./App.css";

// Layout & Sections
import Header from "./components/Layout/Header/Header";
import Footer from "./components/Layout/Footer/Footer";
import Hero from "./components/Sections/Hero/Hero";
import Services from "./components/Sections/Services/Services";
import Articles from "./components/Sections/Articles/Articles";
import Testimonials from "./components/Sections/Testimonials/Testimonials";

// Pages & Features
import AppointmentForm from "./components/Sections/Services/AppointmentForm";
import DoctorList from "./components/Sections/Services/DoctorList/DoctorList";
import CycleTracker from "./components/Sections/Services/CycleTracker/CycleTracker";
import StisTest from "./components/Sections/Services/StisTest";
import ForgotPasswordOTP from "./components/authen-form/ForgotPassword";
import AllBlog from "./components/Sections/Articles/pages/allBlog";
import BlogDetail from "./components/Sections/Articles/pages/BlogDetail";
import Medicalnew from "./components/Sections/Articles/pages/Medicalnew";
import Servicevnew from "./components/Sections/Articles/pages/Servicenew";
import Generalnew from "./components/Sections/Articles/pages/Generalnew";
import CycleTracking from "./components/Sections/Services/CycleTracker/CycleTracker";
import Doctor from "./components/Sections/Services/DoctorList/DoctorList";
import Loading from "./components/Loading/Loading";
import Staff from "./Role/Staff";
import Consultant from "./Role/Consultant";
import Admin from "./Role/Admin";
import Settings from "./pages/Settings";
import UserProfile from "./components/userprofile/userprofile";
import BookingForm from "./components/Sections/Services/BookingForm";
import ServiceDetail from "./components/Sections/Services/ServiceDetail/ServiceDetail";

import Noti from "./components/NotificationCenter/Noti";

import BookingConfirmation from "./components/Sections/Services/BookingConfirmation";
import Payment from "./components/Sections/Payment/payment";
function App() {
  const [rehydrated, setRehydrated] = useState(false);
  

  useEffect(() => {
    setTimeout(() => setRehydrated(true), 1000); // delay 1s
  }, []);

  if (!rehydrated) return <Loading />;


 
  

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
              <Route path="/CycleTracker" element={<CycleTracker />} />
              <Route
                path="/services/DoctorList"
                element={
                  <>
                    {console.log("Rendering Doctor route")}
                    <Doctor />
                  </>
                }
              />
              <Route path="/CycleTracking" element={<CycleTracking />} />
              <Route path="/appointment" element={<StisTest />} />
              <Route path="/forgot-password" element={<ForgotPasswordOTP />} />
              <Route path="/blog" element={<AllBlog />} />
              <Route path="/blog/:id" element={<BlogDetail />} />
              <Route path="/tin-y-te" element={<Medicalnew />} />
              <Route path="/tin-dich-vu" element={<Servicevnew />} />
              <Route path="/y-hoc-thuong-thuc" element={<Generalnew />} />
              <Route path="/staff" element={<Staff />} />
              <Route path="/consultant" element={<Consultant />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/user/profile" element={<UserProfile />} />
              <Route path="/staff" element={<Staff />} />{" "}
              <Route path="/booking" element={<BookingForm />} />
              <Route path="/service-detail/:id" element={<ServiceDetail />} />
              <Route
                path="/booking-confirmation"
                element={<BookingConfirmation />}
              />
              <Route path="/payment" element={<Payment />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </PersistGate>
    </Provider>
  );
}

export default App;
