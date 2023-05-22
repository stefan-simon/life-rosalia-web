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

export const isAdmin = () => {
  const token = localStorage.getItem("rosalia-web-token");
  if (!token) {
    return false;
  }

  const decodedToken = jwt_decode(token);
  return decodedToken.role === "admin";
}

export const isTokenExpired = () => {
  const token = localStorage.getItem("rosalia-web-token");
  if (!token) {
    return true;
  }

  const decodedToken = jwt_decode(token);
  const currentTime = Date.now() / 1000;
  return decodedToken.exp < currentTime;
}

export const isValidator = () => {
  const token = localStorage.getItem("rosalia-web-token");
  if (!token) {
    return false;
  }

  const decodedToken = jwt_decode(token);
  return decodedToken.role === "admin" || decodedToken.role === "validator";
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

export const speciesIds = [
  { label: "Rosalia alpina", value: "rosalia-alpina" },
  { label: "Osmoderma eremita", value: "osmoderma-eremita" },
  { label: "Morimus funereus", value: "morimus-funereus" },
  { label: "Lucanus cervus", value: "lucanus-cervus" },
  { label: "Cerambyx cerdo", value: "cerambyx-cerdo" },
];

export const speciesNames = {
  "rosalia-alpina": "Rosalia alpina",
  "osmoderma-eremita": "Osmoderma eremita",
  "morimus-funereus": "Morimus funereus",
  "lucanus-cervus": "Lucanus cervus",
  "cerambyx-cerdo": "Cerambyx cerdo"
};

const speciesColors = {
  'rosalia-alpina': '#40E0D0',
  'osmoderma-eremita': '#480000',
  'morimus-funereus': '#5a436a',
  'lucanus-cervus': '#820000',
  'cerambyx-cerdo': '#02606c',
};
export const getSpeciesColor = (species) => speciesColors[species] || '#cccccc';
