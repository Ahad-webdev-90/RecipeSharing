import React, { useState, useEffect } from "react";
import logo from "../../assets/appLogo.png";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Loading from "../../components/loading";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import StarRateIcon from "@mui/icons-material/StarRate";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import AddCommentIcon from "@mui/icons-material/AddComment";
import ClearIcon from "@mui/icons-material/Clear";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 2,
  p: 4,
  borderRadius: 5,
};

const Home = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [recipes, setRecipes] = useState([]);
  const [openRateModal, setOpenRateModal] = useState(false);
  const [openCommentModal, setOpenCommentModal] = useState(false);
  const [rate, setRate] = useState({
    recipeId: null,
    rate: null,
  });
  const rateData = (key, val) => {
    setRate((prevData) => ({
      ...prevData,
      [key]: val,
    }));
  };
  const addRate = async () => {
    try {
      const res = await axios.post(`http://localhost:8000/v1/addRate/`, rate);
      setOpenRateModal(false);
      toast.success("Rate added successfully");
    } catch (error) {
      toast.error("Failed to Add rate.");
      console.log(error);
    }
  };
  const [comment, setComment] = useState({
    recipeId: null,
    comment: "",
  });
  const commentData = (key, val) => {
    setComment((prevData) => ({
      ...prevData,
      [key]: val,
    }));
  };
  const addComment = async () => {
    if (!comment.recipeId || !comment.comment) {
      toast.error("Both fields are required.");
      return;
    }
    try {
      const res = await axios.post(
        `http://localhost:8000/v1/addComment/`,
        comment
      );
      setOpenCommentModal(false);
      toast.success("Comment added successfully");
    } catch (error) {
      toast.error("Failed to Add Comment.");
      console.log(error);
    }
  };

  useEffect(() => {
    const fetchRecipes = async () => {
      setLoading(true);
      try {
        const res = await axios.get("http://localhost:8000/v1/getAllRecipes/");
        setRecipes(res.data.recipes || []);
      } catch (error) {
        toast.error("Failed to load recipes.");
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchRecipes();
  }, []);

  return (
    <div
      className={`${
        recipes.length <= 1.5 ? "h-[100vh]" : "h-auto"
      } bg-[#7fd6b6]`}
    >
      <ToastContainer position="bottom-right" />
      <div className="flex justify-between bg-transparent">
        <div className="h-[120px] px-5 w-full flex justify-between bg-[#27a27c]">
          <div className="flex justify-center items-center mx-5">
            <img src={logo} className="w-[100px]" alt="App Logo" />
          </div>
          <div className="flex justify-center items-center mx-8">
            <button
              className="px-3 py-2 border-none outline-none bg-[#125343] text-[#7fd6b6] rounded-lg transition-all duration-300 focus:ring-4 focus:ring-[#b1e9d0]"
              onClick={() => navigate("/dashboard")}
            >
              <ClearIcon />
            </button>
          </div>
        </div>
      </div>

      <div className="p-5">
        {loading ? (
          <div className="flex justify-center items-center h-[70vh] bg-[#7fd6b6]">
            <Loading />
          </div>
        ) : (
          <div>
            <div className="gap-5">
              {recipes.map((recipe) => (
                <div
                  key={recipe.id}
                  className="bg-[#27a27c] p-4 mt-8 rounded-lg shadow-md"
                >
                  <img
                    src={`data:image/jpeg;base64,${recipe.recipeImage}`}
                    className="w-20 rounded-full"
                    alt=""
                  />
                  <h2 className="text-2xl text-[#b1e9d0] font-bold">
                    {recipe.recipeName}
                  </h2>
                  <p className="text-[#b1e9d0] mt-2">{recipe.description}</p>
                  <div className="flex gap-2 relative">
                    <div className="relative group inline-block">
                      {/* Button */}
                      <button
                        className="mt-3 px-4 py-2 bg-[#125343] text-[#7fd6b6] rounded-lg transition-all duration-300 focus:ring-4 focus:ring-[#b1e9d0]"
                        onClick={() => navigate(`/singleRecipe/${recipe.id}`)}
                      >
                        <RemoveRedEyeIcon />
                      </button>

                      {/* Tooltip */}
                      <div className="w-auto text-center transition-all 5s ease-in-out absolute hidden group-hover:block bottom-full left-1/2 transform -translate-x-1/2 -translate-y-2 bg-black text-white text-xs px-2 py-1 rounded shadow-lg">
                        View Recipe
                      </div>
                    </div>
                    <div className="relative group inline-block">
                      <button
                        className="mt-3 px-4 py-2 bg-[#125343] text-[#7fd6b6] rounded-lg transition-all duration-300 focus:ring-4 focus:ring-[#b1e9d0]"
                        onClick={() => {
                          setRate({ recipeId: recipe.id, rate: null });
                          setOpenRateModal(true);
                        }}
                      >
                        <StarRateIcon />
                      </button>
                      <div className="w-auto text-center absolute hidden group-hover:block bottom-full left-1/2 transform -translate-x-1/2 -translate-y-2 bg-black text-white text-xs px-2 py-1 rounded shadow-lg">
                        Rate Recipe
                      </div>
                    </div>
                    <div className="relative group inline-block">
                      <button
                        className="mt-3 px-4 py-2 bg-[#125343] text-[#7fd6b6] rounded-lg transition-all duration-300 focus:ring-4 focus:ring-[#b1e9d0]"
                        onClick={() => {
                          setComment({ recipeId: recipe.id, comment: "" });
                          setOpenCommentModal(true);
                        }}
                      >
                        <AddCommentIcon />
                      </button>
                      <div className="w-auto text-center absolute hidden group-hover:block bottom-full left-1/2 transform -translate-x-1/2 -translate-y-2 bg-black text-white text-xs px-2 py-1 rounded shadow-lg">
                        Comment Recipe
                      </div>
                    </div>
                    {/* Rate Modal */}
                    <Modal
                      open={openRateModal}
                      onClose={() => setOpenRateModal(false)}
                      aria-labelledby="rate-modal-title"
                      aria-describedby="rate-modal-description"
                    >
                      <Box sx={style}>
                        <h1>Rate The Recipe out of 5</h1>
                        <input
                          type="number"
                          max={5}
                          onChange={(e) => rateData("rate", e.target.value)}
                          placeholder="Rate"
                          className="w-full bg-[#b1e9d0] text-[#198264] px-1 py-2 rounded-lg outline-none transition-all duration-300 placeholder:text-[#125343] text-xl focus:ring-4 focus:ring-[#b1e9d0]"
                        />
                        <button
                          type="submit"
                          className="bg-[#146852] my-3 text-[#b1e9d0] px-20 py-2 rounded-lg outline-none transition-all duration-300 focus:ring-4 focus:ring-[#104437]"
                          onClick={addRate}
                        >
                          Add Rate
                        </button>
                      </Box>
                    </Modal>
                    <Modal
                      open={openCommentModal}
                      onClose={() => setOpenCommentModal(false)}
                      aria-labelledby="comment-modal-title"
                      aria-describedby="comment-modal-description"
                    >
                      <Box sx={style}>
                        <h1>Comment the recipe</h1>
                        <input
                          onChange={(e) =>
                            commentData("comment", e.target.value)
                          }
                          type="text"
                          maxLength={100}
                          placeholder="Comment"
                          className="w-full bg-[#b1e9d0] text-[#198264] px-1 py-2 rounded-lg outline-none transition-all duration-300 placeholder:text-[#125343] text-xl focus:ring-4 focus:ring-[#b1e9d0]"
                        />
                        <button
                          type="submit"
                          className="bg-[#146852] my-3 text-[#b1e9d0] px-20 py-2 rounded-lg outline-none transition-all duration-300 focus:ring-4 focus:ring-[#104437]"
                          onClick={addComment}
                        >
                          Add comment
                        </button>
                      </Box>
                    </Modal>
                  </div>
                </div>
              ))}
            </div>

            {/* Comment Modal */}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
