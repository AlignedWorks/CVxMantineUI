import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { useSessionTimeout } from "./SessionTimeout.tsx";

interface User {
  userId: string;
  userName: string;
  firstName: string;
  lastName: string;
  avatarUrl: string;
  memberStatus: string;
}

interface AuthContextProps {
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);
const timeOut = 59 * 60 * 1000;   // 59 minutes in milliseconds (cookie expires at 60 minutes)

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

  useEffect(() => {
    if (!user) return;

    const storedLoginTime = localStorage.getItem('loginTime');
    if (!storedLoginTime) return;

    const checkTimeout = async () => {
      const loginTimestamp = parseInt(storedLoginTime, 10);
      const currentTime = Date.now();
      const timeElapsed = currentTime - loginTimestamp;

      if (timeElapsed > timeOut) {
        // Ask server to clear the session cookie (must be server-side for httpOnly cookies)
        try {
          await fetch(new URL('logout', import.meta.env.VITE_API_BASE), {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({})
          });
        } catch (e) {
          // ignore network errors — still clear client state
          console.warn('Server logout failed', e);
        }

        // Clear client state and redirect (replace so back doesn't return)
        logout();
        window.location.replace('/login');
        return;
      }

      // still valid — restore stored login time
      setLoginTime(loginTimestamp);
    };

    checkTimeout();
  }, []);

  // Track when the user logged in
  const [loginTime, setLoginTime] = useState<number | null>(null);

  const login = (user: User) => {
    setUser(user);
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('loginTime', Date.now().toString()); // Store login time
    setLoginTime(Date.now()); // Set login time
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    setLoginTime(null); // Reset login time
  };

  // Use the session timeout hook at the component level
  useSessionTimeout({
    isLoggedIn: !!user,
    logoutFunction: logout,
    timeoutMs: timeOut,
    loginTime: loginTime
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