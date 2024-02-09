import { useState, useEffect } from 'react';
import Cookies from 'js-cookie'; 

const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState();

  useEffect(() => {
    const token = Cookies.get('token');

    if (token) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
  }, []);

  return isAuthenticated ; 

};

export default useAuth;
