import axios from "axios";
import jwt_decode from "jwt-decode";
import { apiUrl } from "./appConfig";

export const isAuthenticated = () => {
  const token = localStorage.getItem("rosalia-web-token");
  if (!token) {
    return false;
  }

  const decodedToken = jwt_decode(token);
  const currentTime = Date.now() / 1000;
  if (decodedToken.exp < currentTime) {
    localStorage.removeItem("rosalia-web-token");
    return false;
  }

  return true;
}

export const login = async (username, password) => {
  try {
    const response = await axios.post(`${apiUrl}/login`, { username, password });
    const { token } = response.data;
    localStorage.setItem("rosalia-web-token", token);
    return token;
  } catch (error) {
    console.error("Login failed:", error);
    return null;
  }
}