import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export function useSessionTimeout(sessionDuration = 120 * 60 * 1000) {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
        // clear session and redirect to login
        console.log("Session expired. Redirecting to login...");
        localStorage.clear();
        navigate('/login');
    }, sessionDuration);

    return () => clearTimeout(timer); // Cleanup on component unmount
  }, [sessionDuration, navigate]);
}