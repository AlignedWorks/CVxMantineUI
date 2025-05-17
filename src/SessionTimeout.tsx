import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

interface SessionTimeoutProps {
  isLoggedIn: boolean;
  logoutFunction: () => void;
  timeoutMs: number;
  loginTime: number | null;
}

export function useSessionTimeout({
  isLoggedIn,
  logoutFunction,
  timeoutMs,
  loginTime
}: SessionTimeoutProps) {
  const navigate = useNavigate();
  const timeoutRef = useRef<number | null>(null);
  
  useEffect(() => {
    // Only set up timeout if user is logged in and we have a login time
    if (isLoggedIn && loginTime) {
      // Clear any existing timeout
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
      }
      
      // Set new timeout
      timeoutRef.current = window.setTimeout(() => {
        console.log('Session timeout reached. Logging out user.');
        logoutFunction();
        // clear session and redirect to login
        console.log("Session expired. Redirecting to login...");
        localStorage.clear();
        navigate('/login');
      }, timeoutMs);
      
      // Log when the session will expire
      const expirationTime = new Date(loginTime + timeoutMs);
      console.log(`Session will expire at: ${expirationTime.toLocaleTimeString()}`);
    }
    
    // Cleanup on unmount or when dependencies change
    return () => {
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
      }
    };
  }, [isLoggedIn, logoutFunction, timeoutMs, loginTime, navigate]);
};