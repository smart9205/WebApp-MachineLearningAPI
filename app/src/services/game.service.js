import axios from "axios";
import authHeader from "./auth-header";
import * as settings from "../config/settings"

const API_URL = `${settings.APIBASEURL}/`;

const addNewPlayer = (req) => {
  return axios.post(API_URL+"player", req, {headers: authHeader()}).then((response) => {
    return response.data;
  });
};

const addNewTeam = (req) => {
  return axios.post(API_URL+"team", req, {headers: authHeader()}).then((response) => {
    return response.data;
  });
};

const getAllTeams = () => {
  return axios.get(API_URL+"team", {headers: authHeader()}).then((response) => {
    return response.data;
  });
}

const getAllPlayers = () => {
  return axios.get(API_URL+"player", {headers: authHeader()}).then((response) => {
    return response.data;
  });
}

const addNewGame = (req) => {
  return axios.post(API_URL+"game", req, {headers: authHeader()}).then((response) => {
    return response.data;
  });
}


const getAllSeasons = () => {
  return axios.get(API_URL+"season", {headers: authHeader()}).then((response) => {
    return response.data;
  });
}

const getAllLeagues = () => {
  return axios.get(API_URL+"league", {headers: authHeader()}).then((response) => {
    return response.data;
  });
}

const gameService = {
  addNewPlayer,
  addNewTeam,
  getAllTeams,
  getAllPlayers,
  addNewGame,
  getAllSeasons,
  getAllLeagues
};

export default gameService;