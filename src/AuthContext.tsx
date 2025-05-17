import React, { createContext, useState, ReactNode } from 'react';
import { useSessionTimeout } from "./SessionTimeout.tsx";

interface User {
  username: string;
  firstName: string;
  lastName: string;
  avatarUrl: string;
}

interface AuthContextProps {
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    // Check if running on localhost
    const isLocalhost = window.location.hostname === 'localhost';

    if (isLocalhost) {
      console.log('Running on localhost, skipping localStorage retrieval');
      return null; // Skip retrieving user from localStorage
    }

    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });

  // Track when the user logged in
  const [loginTime, setLoginTime] = useState<number | null>(null);

  const login = (user: User) => {
    setUser(user);
    localStorage.setItem('user', JSON.stringify(user));
    setLoginTime(Date.now()); // Set login time
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    setLoginTime(null); // Reset login time
  };

  // Use the session timeout hook at the component level
  useSessionTimeout({
    isLoggedIn: !!user,            // Convert user to boolean - true if user exists, false otherwise
    logoutFunction: logout,        // Pass the logout function
    timeoutMs: 59 * 60 * 1000,      // 59 minutes in milliseconds (cookie expires at 60 minutes)
    loginTime: loginTime           // Pass the login timestamp
  });

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};