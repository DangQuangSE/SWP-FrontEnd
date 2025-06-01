import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import LoginPage from "./pages/Login";
import RegisterPage from "./pages/Register";
import HomePage from "./pages/home/home";
function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <HomePage />, // trang mặc định
    },
    {
      path: "/homepage",
      element: <HomePage />,
    },
    {
      path: "/login",
      element: <LoginPage />,
    },
    {
      path: "/register",
      element: <RegisterPage />,
    },
  ]);
  return <RouterProvider router={router} />;
}

export default App;
