import React, { createContext, useContext, useEffect, useState } from "react";

interface User {
    userId: string;
    username: string;
    email: string;
  }
  
  interface AuthContextType {
    isAuthenticated: boolean;
    user: User | null;
    login: (authData: { token: string; user: User }) => void;
    logout: () => void;
  }
  

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState<User | null>(null);
  
    useEffect(() => {
      const token = localStorage.getItem("authToken");
      const userData = localStorage.getItem("user");
      if (token && userData) {
        setIsAuthenticated(true);
        setUser(JSON.parse(userData));
      }
    }, []);
  
    const login = ({ token, user }: { token: string; user: User }) => {
      localStorage.setItem("authToken", token);
      localStorage.setItem("user", JSON.stringify(user));
      setIsAuthenticated(true);
      setUser(user);
    };
  
    const logout = () => {
      localStorage.removeItem("authToken");
      localStorage.removeItem("user");
      setIsAuthenticated(false);
      setUser(null);
    };
  
    return (
      <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
        {children}
      </AuthContext.Provider>
    );
  };
  

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
