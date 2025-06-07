import React from "react";
import LoginForm from "../authen-form/LoginForm";
import RegisterForm from "../authen-form/RegisterForm";
import "./index.css";

function AuthenTemplate({ isLogin }) {
  return (
    <div className="authen-template">
      <div className="authen-template__form">
        {isLogin ? <LoginForm /> : <RegisterForm />}
      </div>
      <div className="authen-template__img"></div>
    </div>
  );
}

export default AuthenTemplate;
