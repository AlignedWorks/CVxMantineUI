import { useEffect, useRef } from 'react';

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
  const timeoutRef = useRef<number | null>(null);
  
  useEffect(() => {
    // Only set up timeout if user is logged in and we have a login time
    if (isLoggedIn && loginTime) {
      // Clear any existing timeout
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
      }

      // Logout in the backend
      try {
        fetch(new URL('logout', import.meta.env.VITE_API_BASE), {
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

      // Set new timeout
      timeoutRef.current = window.setTimeout(() => {
        console.log('Session timeout reached. Logging out user.');
        logoutFunction();
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
  }, [isLoggedIn, logoutFunction, timeoutMs, loginTime]);
};