import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Home from "./components/Home";
import Login from "./components/Login";
import Register from "./components/Register";
import "./App.css";

export const App = () => {
  const [user, setUser] = useState("");

  const PrivateRoute = ({ element: Component, user, ...rest }) => {
    return user ? <Component user={user} {...rest} /> : <Navigate to="/" />;
  };

  const AuthRoute = ({ element: Component, user, ...rest }) => {
    return user ? <Navigate to="/home" /> : <Component {...rest} />;
  };

  return (
    <div>
      <Router>
        <Routes>
          <Route
            path="/"
            element={
              <AuthRoute element={Login} user={user} setUser={setUser} />
            }
          />
          <Route
            path="/register"
            element={<AuthRoute element={Register} user={user} />}
          />
          <Route
            path="/home"
            element={
              <PrivateRoute element={Home} user={user} setUser={setUser} />
            }
          />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </div>
  );
};
