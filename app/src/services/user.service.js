import axios from "axios";
import authHeader from "./auth-header";

const API_URL = "http://localhost:8080/api/test/";

const getPublicContent = () => {
  return axios.get(API_URL + "all");
};

const getAnalyzerBoard = () => {
  return axios.get(API_URL + "user", { headers: authHeader() });
};

const getLoggerBoard = () => {
  return axios.get(API_URL + "mod", { headers: authHeader() });
};

const getAdminBoard = () => {
  return axios.get(API_URL + "admin", { headers: authHeader() });
};

const userService = {
  getPublicContent,
  getAnalyzerBoard,
  getLoggerBoard,
  getAdminBoard,
};

export default userService;