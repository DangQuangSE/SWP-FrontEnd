import React from "react";
import FacebookLogin from "react-facebook-login";
import "./LoginFace.css"; // Đảm bảo file này đã có CSS custom

const LoginFace = ({ onSuccess }) => {
  const appId = import.meta.env.VITE_FACEBOOK_APP_ID;
  const responseFacebook = (response) => {
    if (onSuccess) onSuccess(response);
    console.log("Facebook response:", response);
  };

  return (
    <FacebookLogin
      appId={appId}
      autoLoad={false}
      fields="name,email,picture"
      callback={responseFacebook}
      icon={
        <img
          src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/facebook/facebook-original.svg"
          alt="facebook"
          style={{ width: 22, marginRight: 8, verticalAlign: "middle" }}
        />
      }
      textButton="Sign in with Facebook"
      cssClass="custom-facebook-btn"
    />
  );
};

export default LoginFace;
