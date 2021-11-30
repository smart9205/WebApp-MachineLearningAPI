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

const gameService = {
  addNewPlayer,
  addNewTeam,
  getWisdomOfCrowd,
  getSeasons,
};

export default gameService;