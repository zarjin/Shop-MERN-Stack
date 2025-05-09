import { createContext } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const USER_API = import.meta.env.VITE_USER_API;

  const registerUser = async (userData) => {
    try {
      const { data } = await axios.post(`${USER_API}/register`, userData, {
        withCredentials: true,
      });
      toast.success(data.message);
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  return (
    <UserContext.Provider value={{ registerUser }}>
      {children}
    </UserContext.Provider>
  );
};
