import axios from "axios";
import authHeader from "./auth-header";
import * as settings from "../config/settings"

const API_URL = `${settings.APIBASEURL}/`;

const getAllTeamPlayers = (req) => {
  return axios.post(API_URL+"team_player/findall", req, {headers: authHeader()}).then((response) => {
    return response.data;
  });
}
const addNewTeamPlayer = (req) => {
  return axios.post(API_URL+"team_player/create", req, {headers: authHeader()}).then((response) => {
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

const addNewLeague = (req) => {
  return axios.post(API_URL+"league", req, {headers: authHeader()}).then((response) => {
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

const gameService = {
  addNewTeamPlayer,
  addNewTeam,
  getAllTeams,
  getAllTeamPlayers,
  addNewGame,
  getAllSeasons,
  getAllLeagues,
  addNewLeague,
  deletePlayersInTeam,
  getAllGames,
};

export default gameService;