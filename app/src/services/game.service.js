import axios from "axios";
import authHeader from "./auth-header";
import * as settings from "../config/settings"

const API_URL = `${settings.APIBASEURL}/`;

const getAllTeamPlayers = (req) => {
  return axios.post(API_URL+"team_player/findall", req, {headers: authHeader()}).then((response) => {
    return response.data;
  });
}
const addTeamPlayer = (req) => {
  return axios.post(API_URL+"team_player/create", req, {headers: authHeader()}).then((response) => {
    return response.data;
  });
};

const addTeam = (req) => {
  return axios.post(API_URL+"team", req, {headers: authHeader()}).then((response) => {
    return response.data;
  });
};

const getAllTeams = () => {
  return axios.get(API_URL+"team", {headers: authHeader()}).then((response) => {
    return response.data;
  });
}


const addGame = (req) => {
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

const addLeague = (req) => {
  return axios.post(API_URL+"league", req, {headers: authHeader()}).then((response) => {
    return response.data;
  });
}

const addPlayer = (req) => {
  return axios.post(API_URL+"player", req, {headers: authHeader()}).then((response) => {
    return response.data;
  });
}


const deletePlayersInTeam = (id) => {
  return axios.delete(API_URL+`team_player/${id}`,{headers: authHeader(), data:{id}}).then((response) => {
    return response.data;
  });
}

const getAllGames = () => {
  return axios.get(API_URL+"game", {headers: authHeader()}).then((response) => {
    return response.data;
  });
}

const getAllPlayers = () => {
  return axios.get(API_URL+"player", {headers: authHeader()}).then((response) => {
    return response.data;
  });
}

const deleteGames = (req) => {
  return axios.post(API_URL+"game/deletegames", req, {headers: authHeader()}).then((response) => {
    return response.data;
  });
}

const updateJersey = (req) => {
  return axios.post(API_URL+"team_player/updatejersey", req, {headers: authHeader()}).then((response) => {
    return response.data;
  });
}

const gameService = {
  addTeamPlayer,
  addTeam,
  addLeague,
  addGame,
  addPlayer,

  getAllTeamPlayers,
  getAllTeams,
  getAllLeagues,
  getAllGames,
  getAllSeasons,
  getAllPlayers,

  updateJersey,

  deletePlayersInTeam,

  deleteGames,
};

export default gameService;