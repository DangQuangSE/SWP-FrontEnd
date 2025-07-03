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
import Hero from "./pages/Home/Hero/Hero";
import Services from "./pages/Home/Services";
import Articles from "./features/bloglist/Articles";
import Testimonials from "./pages/Home/Testimonials/Testimonials";

// Pages & Features
import AppointmentForm from "./features/Services/BookingService/BookingService";
import DoctorList from "./features/Services/DoctorList/DoctorList";
import CycleTracker from "./features/Services/CycleTracker/CycleTracker";
// import StisTest from "./components/Sections/Services/StisTest";
import ForgotPasswordOTP from "./features/authentication/ForgotPassword";
import AllBlog from "./features/bloglist/allBlog";
import BlogDetail from "./features/bloglist/BlogDetail";
import CycleTracking from "./features/Services/CycleTracker/CycleTracker";
import Doctor from "./features/Services/DoctorList/DoctorList";
import Loading from "./components/Loading/Loading";
import Staff from "./features/Dashboard/StaffDashboard/Staff";
import Consultant from "./features/Dashboard/ConsultantDashboard/ConsultantMain";
import Admin from "./features/Dashboard/AdminDashboard/Admin";
import Settings from "./pages/Settings";
import UserProfile from "./pages/UserProfile/userprofile";
import BookingForm from "./features/Services/Booking/BookingForm";
import ServiceDetail from "./features/Services/ServiceList/ServiceDetail/ServiceDetail";
import Booking from "./pages/UserProfile/Booking/Booking";
import UserProfileLayout from "./pages/UserProfile/userprofile";
import Profile from "./pages/UserProfile/Profile";
import Noti from "./features/NotificationCenter/Noti";
import BookingConfirmation from "./features/Services/Booking/BookingConfirmation";
import Payment from "./features/Services/Payment/Payment";
import ProtectedRoute from "./components/ProtectedRoute";

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
              {/* <Route path="/appointment" element={<StisTest />} /> */}
              <Route path="/forgot-password" element={<ForgotPasswordOTP />} />
              <Route path="/blog" element={<AllBlog />} />
              <Route path="/blog/:id" element={<BlogDetail />} />

              {/* Protected routes */}
              {/* <Route
                path="/consultant"
                element={
                  <ProtectedRoute
                    allowedRoles={["CONSULTANT", "ADMIN", "STAFF"]}
                  >
                    <Consultant />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/staff"
                element={
                  <ProtectedRoute allowedRoles={["STAFF", "ADMIN"]}>
                    <Staff />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin"
                element={
                  <ProtectedRoute allowedRoles={["ADMIN"]}>
                    <Admin />
                  </ProtectedRoute>
                }
              /> */}
              <Route path="/admin" element={<Admin />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/user" element={<UserProfile />}>
                <Route index element={<Profile />} />
                <Route path="profile" element={<Profile />} />
                <Route path="booking" element={<Booking />} />
                {/* <Route path="health" element={<Health />} />
                <Route path="saved" element={<Saved />} />
                <Route path="attended" element={<Attended />} />
                <Route path="settings" element={<Settings />} /> */}
              </Route>
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
