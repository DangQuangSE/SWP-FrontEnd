import React from "react";
import { Button } from "antd";
import "./GradientButton.css";

const GradientButton = ({ children, ...props }) => {
  return (
    <Button {...props} className="gradient-button">
      {children}
    </Button>
  );
};

export default GradientButton;
