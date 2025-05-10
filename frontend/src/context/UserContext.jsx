import { createContext, useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const USER_API = import.meta.env.VITE_USER_API;

  const [loggedIn, setLoggedIn] = useState(false);

  const [user, setUser] = useState();

  const [isAdmin, setIsAdmin] = useState(false);

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
      getUser();
      isLoggedIn();
      setLoggedIn(false);
      toast.success(data.message);
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  const isLoggedIn = async () => {
    try {
      const { data } = await axios.get(`${USER_API}/checkAuthentication`, {
        withCredentials: true,
      });
      setLoggedIn(data.Authentication);
      getUser();
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  const getUser = async () => {
    try {
      const { data } = await axios.get(`${USER_API}/me`, {
        withCredentials: true,
      });
      setUser(data);
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  const Admin = async (userEmail) => {
    try {
      const { data } = await axios.get(`${USER_API}/admin`, userEmail, {
        withCredentials: true,
      });
      setIsAdmin(data.isAdmin);
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
        isAdmin,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
