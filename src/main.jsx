import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import * as Sentry from "@sentry/react";

// Khởi tạo Sentry mà không cần tracing
Sentry.init({
  dsn: "https://d0b6ccc89694cede57ac553475d6501e@o4509571355901952.ingest.us.sentry.io/4509694091198464",
  tracesSampleRate: 0.0, // hoặc bỏ luôn nếu không dùng tracing
  sendDefaultPii: true,
});

// Khởi tạo React App
const container = document.getElementById("app");
const root = ReactDOM.createRoot(container);
root.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
