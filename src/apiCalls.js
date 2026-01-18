import axios from 'axios';

export const register = async (userData) => {
  try {
    const response = await axios.post(`${import.meta.env.VITE_API_URL_BASE}/api/register`, userData);
    return response.data;
  } catch (error) {
    console.error("Error registering:", error);
    throw error;
  }
};

export const login = async (credentials) => {
  try {
    const response = await axios.post(`${import.meta.env.VITE_API_URL_BASE}/api/login`, credentials);
    return response.data;
  } catch (error) {
    console.error("Error logging in:", error);
    throw error;
  }
};





