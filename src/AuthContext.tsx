import React, { createContext, useState, useEffect, ReactNode } from 'react';

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

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [loading, setLoading] = useState(true);
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
    const verifyUser = async () => {
      const storedUser = localStorage.getItem('user');
      if (!storedUser) {
        setLoading(false);
        return;
      }

      try {
        // Assume you have a '/profile' or similar endpoint that requires authentication
        const response = await fetch(new URL("profile", import.meta.env.VITE_API_BASE), {
          credentials: 'include',
        });

        if (response.ok) {
          // Cookie is valid, user is authenticated.
          // Use fresh data from the API response.
          const userData = await response.json();
          setUser(userData);
        } else {
          // Cookie is invalid or missing, log the user out.
          logout();
        }
      } catch (error) {
        console.error('Failed to verify authentication:', error);
        logout(); // Log out on network error as well
      } finally {
        setLoading(false);
      }
    };

    verifyUser();
  }, []);


  const login = (user: User) => {
    setUser(user);
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('loginTime', Date.now().toString()); // Store login time
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  // While verifying, you can show a loader to prevent UI flicker
  if (loading) {
    return null; // Or a loading spinner component
  }

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