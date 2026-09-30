
import React, { createContext, useState, useEffect } from 'react';
export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  
  const [token, setToken] = useState(localStorage.getItem('token'));
  // --- MODIFIED LINE ---
  // Initialize user state from localStorage if it exists.
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [isAuthenticated, setIsAuthenticated] = useState(!!token);
  
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');

    if (storedToken) {
      setToken(storedToken);
      setIsAuthenticated(true);
      
    }

    setIsLoading(false);
  }, []); 

   const login = (newToken, userData) => {
    localStorage.setItem('token', newToken);
    // We stringify the user object to store it in localStorage.
    // This helps re-populate the UI instantly on a page refresh.
    localStorage.setItem('user', JSON.stringify(userData)); 
    setToken(newToken);
    setUser(userData);
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
  };

  const contextValue = {
    token,
    user,
    isAuthenticated,
    isLoading,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {!isLoading && children}
    </AuthContext.Provider>
  );
};