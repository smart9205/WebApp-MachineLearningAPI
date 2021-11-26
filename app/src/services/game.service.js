import axios from "axios";
import authHeader from "./auth-header";
import * as settings from "../config/settings"

const API_URL = `${settings.APIBASEURL}/`;


const saveTemporaryAnalyzeLine = (req) => {
  return axios.post(API_URL+"temporary_analyze_line", req, {headers: authHeader()}).then((response) => {
    return response.data;
  });
};

const deleteTemporaryAnalyzeLine = (id) => {
  return axios.delete(API_URL+`temporary_analyze_line/${id}`, {headers: authHeader(), data:{id}}).then((response) => {
    return response.data;
  });
};

const getWisdomOfCrowd = (req) => {
  return axios.post(API_URL+"temporary_analyze_line/getwisdomofcrowd", req, {headers: authHeader()}).then((response) => {
    return response.data;
  });
}

const getSeasons = () => {
  return axios.get(API_URL+"analyze_line/getseasons", {headers: authHeader()}).then((response) => {
    return response.data;
  });
}

const getLeagues = (req) => {
  return axios.post(API_URL+"analyze_line/getleagues", req, {headers: authHeader()}).then((response) => {
    return response.data;
  });
}

const getAnalyzeLines = (req) => {
  return axios.post(API_URL+"analyze_line/getlines", req, {headers: authHeader()}).then((response) => {
    return response.data;
  });
}

const getAnalyzeLinesBySeason = (req) => {
  return axios.post(API_URL+"analyze_line/getlinesbyseason", req, {headers: authHeader()}).then((response) => {
    return response.data;
  });
}

const deleteAnalyzeLine = (id) => {
  return axios.delete(API_URL+`analyze_line/${id}`, {headers: authHeader(), data:{id}}).then((response) => {
    return response.data;
  });
}

const getLastFiveGame = (req) => {
  return axios.post(API_URL+"game/getlastfive", req, {headers: authHeader()}).then((response) => {
    return response.data;
  });
}

const getGameAverageExcel = (req) => {
  return axios.post(API_URL+"analyzegame/average_excel", req, {headers: authHeader()}).then((response) => {
    return response.data;
  });
}

const getMyTemporaryAnalyzeLine = (req) => {
  return axios.get(API_URL+"temporary_analyze_line/getMine", req, {headers: authHeader()}).then((response) => {
    return response.data;
  });
}

const getLastUpdate = () => {
  return axios.get(API_URL+"last_update", {headers: authHeader()}).then((response) => {
    return response.data;
  });
}

const getAdminDirection = () => {
  return axios.get(API_URL+"admin_direction", {headers: authHeader()}).then((response) => {
    return response.data;
  });
}
const saveAdminDirection = (row) => {
  return axios.put(API_URL+`admin_direction/${row.id}`, row, {headers: authHeader()}).then((response) => {
    return response.data;
  });
}
const deleteAdminDirection = (id) => {
  return axios.delete(API_URL+`admin_direction/${id}`,{headers: authHeader(), data:{id}}).then((response) => {
    return response.data;
  });
}

const getArbitrage = () => {
  return axios.get(API_URL+"arbitrage/getall", {headers: authHeader()}).then((response) => {
    return response.data;
  });
}

const deleteArbitrage = (req) => {
  return axios.post(API_URL+"arbitrage/delete", req, {headers: authHeader()}).then((response) => {
    return response.data;
  });
}

const gameService = {
  saveTemporaryAnalyzeLine,
  deleteTemporaryAnalyzeLine,
  getWisdomOfCrowd,
  getAnalyzeLines,
  getSeasons,
  getLeagues,
  deleteAnalyzeLine,
  getLastFiveGame,
  getGameAverageExcel,
  getMyTemporaryAnalyzeLine,
  getLastUpdate,
  getAdminDirection,
  saveAdminDirection,
  deleteAdminDirection,
  getAnalyzeLinesBySeason,
  getArbitrage,
  deleteArbitrage
};

export default gameService;