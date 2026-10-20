import { createContext, useContext, useState } from "react";

// 1. Create the context
export const AuthContext = createContext(null);

// 2. Custom hook for easy consumption
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within a AuthProvider");
  }
  return context;
};

// 3. Provider component
const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // { _id, name, email, role, ... }

  const [accessToken, setAccessToken] = useState(null);

  const [loading, setLoading] = useState(true);

  const value = {
    user,
    accessToken,
    loading,
    isAuthenticated: !!user,
    setUser,
    setAccessToken,
    setLoading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
