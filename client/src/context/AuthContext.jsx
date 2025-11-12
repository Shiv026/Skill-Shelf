import { useState, useEffect, createContext } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api.js";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const initAuth = async () => {
      const savedAuth = localStorage.getItem("auth");
      if (savedAuth) {
        try {
          const parsed = JSON.parse(savedAuth);
          const res = await api.get(
            "/users/role", {
            headers: { Authorization: `Bearer ${parsed.token}` }
          }
          );

          const updatedUser = { ...parsed, roles: res.data.roles };
          setUser(updatedUser);
          localStorage.setItem("auth", JSON.stringify(updatedUser));
        } catch (e) {
          console.error("Failed to init auth:", e);
          localStorage.removeItem("auth");
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (data) => {
    console.log("Login - Data Received:", data);
    const authData = {
      token: data.token,
      userId: data.userData.userId,
      name: data.userData.name,
      email: data.userData.email,
      roles: []
    };
    setUser(authData);
    try {
      const res = await api.get("/users/role", {
        headers: { Authorization: `Bearer ${data.token}` }
      });

      const updatedUser = { ...authData, roles: res.data.roles };
      setUser(updatedUser);
      localStorage.setItem("auth", JSON.stringify(updatedUser));
      return updatedUser;
    } catch (err) {
      console.error("Failed to fetch roles after login:", err);
    } finally {
      setLoading(false);
    }
  };


  const logout = () => {
    setUser(null);
    localStorage.removeItem("auth");
    navigate("/");
  };


  const becomeInstructor = async () => {
    if (!user) {
      navigate("/signin");
      return;
    }

    if (user.roles?.includes("instructor")) {
      console.log("User already has Instructor role");
      return;
    }

    try {
      const res = await api.post(
        "/users/role",
        {},
        { headers: { Authorization: `Bearer ${user.token}` } }
      );

      const updatedRoles = res.data.roles;

      const updatedUser = { ...user, roles: updatedRoles };
      setUser(updatedUser);
      localStorage.setItem("auth", JSON.stringify(updatedUser));
      window.location.reload();
    } catch (err) {
      console.error("Failed to become instructor:", err);
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, login, logout, loading, becomeInstructor }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
