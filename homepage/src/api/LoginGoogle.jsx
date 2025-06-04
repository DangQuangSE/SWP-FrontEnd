// LoginGoogle.jsx
import React from "react";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";

const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

const LoginGoogle = ({ onSuccess, onError }) => {
  return (
    <GoogleOAuthProvider clientId={clientId}>
      <GoogleLogin
        onSuccess={(credentialResponse) => {
          if (onSuccess) onSuccess(credentialResponse);
          console.log("Google response:", credentialResponse);
        }}
        onError={() => {
          if (onError) onError();
          console.log("Google login failed");
        }}
        useOneTap // hoặc bỏ nếu không dùng
      />
    </GoogleOAuthProvider>
  );
};

export default LoginGoogle;
