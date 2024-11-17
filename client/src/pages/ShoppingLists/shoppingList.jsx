import React, { useState, useEffect } from "react";
import { FaTrash, FaEdit } from "react-icons/fa";
import Loading from "../../components/loading";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import logo from "../../assets/appLogo.png";
import ClearIcon from "@mui/icons-material/Clear";

const ShoppingList = () => {
  const userId = localStorage.getItem("id");
  const navigate = useNavigate();
  const [shoppingLists, setShoppingLists] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchShoppingLists = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          `http://localhost:8000/v1/getShoppingList/${userId}`
        );
        const data = await res.json();
        setShoppingLists(data.shoppingLists);
      } catch (error) {
        console.error("Error fetching shopping lists:", error);
        toast.error("Failed to load shopping lists.");
      } finally {
        setLoading(false);
      }
    };
    fetchShoppingLists();
  }, [userId]);

  const deleteList = async (shoppingListId) => {
    try {
      setLoading(true);
      await axios.delete(
        `http://localhost:8000/v1/deleteShoppingList/${shoppingListId}`
      );
      toast.success("Shopping list deleted successfully.");
      navigate("/");
    } catch (error) {
      if (error?.response?.data?.error) {
        toast.error(error.response.data.error);
      } else {
        toast.error("Failed to delete shopping list.");
      }
      console.error("Error deleting shopping list:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[100vh] bg-[#7fd6b6]">
        <Loading />
      </div>
    );
  }

  return (
    <div
      className={`${
        Array.isArray(shoppingLists) && shoppingLists.length <= 4
          ? "h-[100vh]"
          : "h-auto"
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
        {shoppingLists?.length > 0 ? (
          <div className="gap-5">
            {shoppingLists.map((list) => (
              <div
                key={list._id}
                className="bg-[#27a27c] p-4 my-10 rounded-lg shadow-md"
              >
                <h3 className="text-2xl text-[#b1e9d0] font-bold">
                  {list.listname}
                </h3>
                <ul className="text-[#b1e9d0] mt-2">
                  {list.items.map((item, index) => (
                    <li key={index}>
                      <span className="text-[#125343] font-bold">Ingredent : </span>
                      {item.name}
                    </li>
                  ))}
                </ul>
                <div className="flex justify-between">
                  <button
                    className="mt-3 px-4 py-2 bg-[#125343] text-[#7fd6b6] rounded-lg transition-all duration-300 focus:ring-4 focus:ring-[#b1e9d0]"
                    onClick={() => deleteList(list._id)}
                  >
                    <FaTrash size={20} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="h-full flex justify-center items-center my-[40px]">
            <h2 className="text-[#125343] text-2xl font-bold">
              No Shopping List is Added Yet
            </h2>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShoppingList;
