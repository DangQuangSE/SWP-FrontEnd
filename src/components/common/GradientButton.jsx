import React from "react";
import { Button } from "antd";
import "./GradientButton.css";

const GradientButton = ({ children, className = "", ...props }) => {
  return (
    <Button {...props} className={`gradient-button ${className}`}>
      {children}
    </Button>
  );
};

export default GradientButton;
