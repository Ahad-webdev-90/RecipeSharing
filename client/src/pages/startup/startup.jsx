import React, { useEffect } from "react";
import image from "../../assets/Startup image.png";
import logo from "../../assets/appLogo.png";
import { Link, useNavigate } from "react-router-dom";

const Startup = () => {
  const navigate = useNavigate();
  const id = localStorage.getItem("id");
  useEffect(() => {
    if (id) {
      navigate("/loading");
    }
  }, []);
  return (
    <div className="flex h-[100vh] bg-[#27a27c]">
      <div className="w-[40%] flex flex-col items-start justify-center">
        <img src={logo} className="w-60 mx-48" />
        <h3 className="text-3xl text-[#082620] ms-36">
          Welcome To Recipe Sharing
        </h3>
        <button
          className="my-5 ms-10 py-3 w-full rounded-full bg-[#082620] text-xl text-[#27a27c] transition-all duration-300 focus:ring-4 focus:ring-[#4d0417]"
          onClick={() => navigate("/login")}
        >
          Login
        </button>
        <button
          className="my-5 ms-10 py-3 w-full rounded-full bg-[#082620] text-xl text-[#27a27c] transition-all duration-300 focus:ring-4 focus:ring-[#4d0417]"
          onClick={() => navigate("/signup")}
        >
          Signup
        </button>
      </div>
      <div className="w-[60%] h-[100%] flex justify-center items-center">
        <img src={image} className="h-[80vh] rounded-lg" />
      </div>
    </div>
  );
};

export default Startup;
