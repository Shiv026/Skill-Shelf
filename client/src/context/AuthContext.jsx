import { useState, useEffect, createContext } from 'react';
import { useNavigate } from 'react-router-dom';
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  useEffect(() => {
    const savedAuth = localStorage.getItem("auth");
    if (savedAuth) {
      try {
        setUser(JSON.parse(savedAuth));
      } catch (e) {
        console.error("Failed to parse auth data:", e);
        localStorage.removeItem("auth");
      }
    }
    setLoading(false);
  }, []);

  const login = (data) => {
    const authData = {
      token: data.token,
      userId: data.userData.userId,
      name: data.userData.name,
      email: data.userData.email
    }
    setUser(authData);
    localStorage.setItem("auth", JSON.stringify(authData));
  }

  const logout = () => {
    setUser(null);
    localStorage.removeItem("auth");
    navigate('/');
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
export default AuthContext;