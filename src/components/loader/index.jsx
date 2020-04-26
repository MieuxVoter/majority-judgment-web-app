import React from "react";
import logo from "./loader-pulse-2.gif";
import "./style.css";

const Loader = () => {
  return (
    <div className="loader bg-primary">
      <img src={logo} alt="Loading..." />
    </div>
  );
};

export default Loader;
