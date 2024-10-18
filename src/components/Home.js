import React from "react";
import { auth } from "../firebase";
import { useNavigate } from "react-router";
import Main from "./Main";

const Home = ({ user, setUser }) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await auth.signOut();
      setUser("");
      navigate("/");
    } catch (error) {
      console.log(error);
      alert("Logout failed. Please try again.");
    }
  };

  return (
    <div>
      <nav className="navbar">
        <span className="nav-user">Welcome, {user}</span>
        <button className="nav-logout" onClick={handleLogout}>
          Logout
        </button>
      </nav>

      <h1>Task Manager App</h1>

      <p>
        <Main />
      </p>
    </div>
  );
};

export default Home;
