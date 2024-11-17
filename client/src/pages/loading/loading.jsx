import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./loading.css";
import logo from "../../assets/appLogo.png";

const SplashScreen = () => {
  const [showSplash, setShowSplash] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
      navigate("/dashboard"); // Redirect after the animation
    }, 4000); // 4-second splash screen

    return () => clearTimeout(timer); // Cleanup on unmount
  }, [navigate]);

  if (!showSplash) return null;

  return (
    <div className="splash-container">
      <div className="logo">
        <span className="splash-logo">
          <div className="logo flex justify-center items-center text-center">
            <img src={logo} alt="" className="w-[100%]" />
          </div>
        </span>
      </div>
      <div className="loading-bar">
        <div className="progress-bar"></div>
      </div>
    </div>
  );
};

export default SplashScreen;
