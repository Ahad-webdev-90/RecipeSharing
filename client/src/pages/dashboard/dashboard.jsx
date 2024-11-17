import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import axios from "axios";
import logo from "../../assets/appLogo.png";
import Loading from "../../components/loading";
import { ToastContainer, toast } from "react-toastify";
import { FaBasketShopping } from "react-icons/fa6";
import "react-toastify/dist/ReactToastify.css";

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [recipeloading, setRecipeLoading] = useState(false);
  const [recipes, setRecipes] = useState([]);
  const deleteRecipe = async (recipeId) => {
    try {
      setLoading(true);
      await axios.delete(`http://localhost:8000/v1/deleteRecipe/${recipeId}`);
      navigate("/");
    } catch (error) {
      if (error?.response?.data?.error) {
        toast.error(error.response.data.error);
      } else {
        toast.error("Failed to load recipes.");
        console.log(error);
      }
      setLoading(false);
    }
  };
  useEffect(() => {
    const fetchUserData = async () => {
      const userId = localStorage.getItem("id");
      if (!userId) {
        navigate("/login"); // Redirect if not logged in
        return;
      }
      try {
        const res = await axios.get(`http://localhost:8000/v1/user/${userId}`);
        setUser(res.data.user);
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      } finally {
        setLoading(false);
      }
    };
    const fetchUserRecipes = async () => {
      setRecipeLoading(true);
      const userId = localStorage.getItem("id");
      try {
        setRecipeLoading(true);
        const response = await axios.get(
          `http://localhost:8000/v1/getUserRecipes/${userId}`
        );
        setRecipes([...response.data.recipes]);
        console.log("Response data:", response.data.recipes);
        setRecipeLoading(false);
      } catch (error) {
        if (error?.response?.data?.error) {
          toast.error(error.response.data.error);
        } else {
          toast.error("Failed to load recipes.");
          console.log(error);
        }
        setLoading(false);
      }
    };

    fetchUserData();
    fetchUserRecipes();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("id");
    navigate("/login");
  };

  return (
    <div>
      {loading ? (
        <div className="flex justify-center items-center h-[100vh] bg-[#7fd6b6]">
          <Loading />
        </div>
      ) : (
        <div className="h-auto bg-[#7fd6b6] flex flex-col items-center px-[200px] w-full">
          <ToastContainer position="bottom-right" />
          <header className="w-[98.7vw] bg-[#27a27c] flex justify-evenly items-center mb-8">
            <div>
              <img src={logo} className="w-[150px]" alt="App Logo" />
            </div>
            <div className="flex items-center">
              <button
                onClick={() => navigate("/addRecipe")}
                className="bg-[#146852] text-[#b1e9d0] px-4 py-2 mx-1 rounded-lg"
              >
                Add Recipe
              </button>
              <button
                onClick={() => navigate("/addShoppingList")}
                className="bg-[#146852] text-[#b1e9d0] px-4 py-2 mx-1 rounded-lg"
              >
                Shopping list
              </button>
              <button
                onClick={handleLogout}
                className="bg-[#146852] text-[#b1e9d0] px-4 py-2 rounded-lg"
              >
                Logout
              </button>
              <button
                onClick={() => navigate("/shoppingList")}
                className="relative px-4 py-2 ms-2 bg-[#146852] text-[#b1e9d0] rounded-lg transition-all duration-300 focus:ring-4 focus:ring-[#125343] group"
              >
                <FaBasketShopping size={25} />
                <span className="opacity-0 invisible group-hover:visible group-hover:opacity-100 absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-[#000] text-white text-sm rounded-md transition-opacity duration-300">
                  ShoppingList
                </span>
              </button>
            </div>
          </header>
          <div className="w-full max-w-[1000px] bg-[#27a27c] shadow-md rounded-lg p-8">
            <h1 className="text-2xl font-bold text-[#caf1de] mb-4">
              Welcome, {user?.username}!
            </h1>
            <p className="text-lg text-[#555] mb-6">Here your dashboard</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Profile Section */}
              <div className="bg-[#7fd6b6] p-6 rounded-lg text-[#146852]">
                <h2 className="text-xl font-semibold mb-2">Profile</h2>
                <p className="text-sm">Username: {user?.username}</p>
                <p className="text-sm">Email: {user?.email}</p>
              </div>

              {/* Settings Section */}
              {recipeloading}

              {recipes.length > 0 && (
                <div className="bg-[#146852] p-6 rounded-lg text-[#7fd6b6]">
                  <h2 className="text-xl font-semibold mb-2">Home</h2>
                  <p className="text-sm">
                    See all recipes which may can help you to cook healthy food
                    !
                  </p>
                  <Link to="/home" className="mt-4 inline-block text-[#b1e9d0]">
                    Go to Home
                  </Link>
                </div>
              )}
              {recipes.length === 0 && !recipeloading && ""}

              {/* Other Links or Actions */}
            </div>
          </div>
          <div className="my-6 rounded-lg shadow-lg h-[60vh] w-full overflow-auto bg-[#27a27c]">
            {recipeloading ? (
              <div className="flex h-full justify-center items-center">
                <Loading />
              </div>
            ) : (
              <div>
                {recipes.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
                    {recipes.map((recipe) => (
                      <div
                        key={recipe.id}
                        className="bg-[#b1e9d0] p-4 rounded-lg shadow-md my-4 mx-5"
                      >
                        <img
                          src={`data:image/jpeg;base64,${recipe.recipeImage}`}
                          className="w-20 rounded-full"
                          alt=""
                        />
                        <h2 className="text-2xl text-[#125343] font-bold">
                          {recipe.recipeName}
                        </h2>
                        <p className="text-[#125343] mt-2">
                          {recipe.description}
                        </p>
                        <button
                          className="mt-3 px-4 py-2 bg-[#125343] text-[#7fd6b6] rounded-lg transition-all duration-300 focus:ring-4 focus:ring-[#082620]"
                          onClick={() => navigate(`/singleRecipe/${recipe.id}`)}
                        >
                          View Recipe
                        </button>
                        <button
                          className="mt-3 px-4 py-2 bg-[#125343] text-[#7fd6b6] rounded-lg transition-all duration-300 focus:ring-4 focus:ring-[#082620]"
                          onClick={() => deleteRecipe(recipe.id)}
                        >
                          Delete Recipe
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex justify-center items-center h-[50vh]">
                    <h1 className="text-[#125343] text-2xl font-bold">
                      No Recipes Added
                    </h1>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
