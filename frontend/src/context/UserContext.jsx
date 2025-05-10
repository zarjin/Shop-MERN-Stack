import { createContext, useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const USER_API = import.meta.env.VITE_USER_API;

  const [loggedIn, setLoggedIn] = useState(false);

  const [user, setUser] = useState();

  const registerUser = async (userData) => {
    try {
      const { data } = await axios.post(`${USER_API}/register`, userData, {
        withCredentials: true,
      });
      setLoggedIn(true);
      isLoggedIn();
      getUser();
      toast.success(data.message);
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  const loginUser = async (userData) => {
    try {
      const { data } = await axios.post(`${USER_API}/login`, userData, {
        withCredentials: true,
      });
      setLoggedIn(true);
      isLoggedIn();
      getUser();
      toast.success(data.message);
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  const logoutUser = async () => {
    try {
      const { data } = await axios.get(`${USER_API}/logout`, {
        withCredentials: true,
      });
      // First set the state directly for immediate UI update
      setLoggedIn(false);
      setUser(null);
      // Then check the server state
      isLoggedIn();
      toast.success(data.message);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Logout failed');
    }
  };

  const isLoggedIn = async () => {
    try {
      const { data } = await axios.get(`${USER_API}/checkAuthentication`, {
        withCredentials: true,
      });
      setLoggedIn(data.Authentication);
      if (data.Authentication) {
        getUser();
      } else {
        setUser(null);
      }
    } catch (error) {
      setLoggedIn(false);
      setUser(null);
      // Only show error toast if it's not a 401 unauthorized error
      if (error.response && error.response.status !== 401) {
        toast.error(
          error.response?.data?.message || 'Authentication check failed'
        );
      }
    }
  };

  const getUser = async () => {
    try {
      const { data } = await axios.get(`${USER_API}/me`, {
        withCredentials: true,
      });
      setUser(data);
    } catch (error) {
      setUser(null);
      // Only show error toast if it's not a 401 unauthorized error
      if (error.response && error.response.status !== 401) {
        toast.error(
          error.response?.data?.message || 'Failed to fetch user data'
        );
      }
    }
  };

  const Admin = async (userEmail) => {
    try {
      const { data } = await axios.post(
        `${USER_API}/admin`,
        { email: userEmail },
        {
          withCredentials: true,
        }
      );

      toast.success(data.message);
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  useEffect(() => {
    isLoggedIn();
    getUser();
  }, []);
  return (
    <UserContext.Provider
      value={{
        registerUser,
        loginUser,
        logoutUser,
        loggedIn,
        user,
        Admin,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
