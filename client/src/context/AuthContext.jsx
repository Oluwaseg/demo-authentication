import PropTypes from "prop-types";
import { createContext, useState, useEffect } from "react";
import axiosInstance from "../service/axiosInstance";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axiosInstance.get("/home");
        setUser(response.data.user);
        localStorage.setItem("user", JSON.stringify(response.data.user));
      } catch (error) {
        if (error.response && error.response.status === 401) {
          setUser(null);
          localStorage.removeItem("user");
        } else {
          console.error("Error fetching user:", error);
        }
      } finally {
        setLoading(false);
      }
    };

    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      fetchUser(); // Validate and fetch user data from the server
    } else {
      setLoading(false);
    }
  }, []);

  const handleLogout = async () => {
    try {
      await axiosInstance.post("/logout");
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setUser(null);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, setUser, loading, handleLogout }}>
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
