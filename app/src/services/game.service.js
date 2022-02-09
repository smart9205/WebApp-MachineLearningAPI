import axios from "axios";
import authHeader from "./auth-header";
import * as settings from "../config/settings"

const API_URL = `${settings.APIBASEURL}/`;

const getAllTeamPlayers = (req) => {
  return axios.post(API_URL + "team_player/findall", req, { headers: authHeader() }).then((response) => {
    return response.data;
  });
}

const getGameTeamPlayers = (req) => {
  return axios.post(API_URL + "team_player/playersbygameteam", req, { headers: authHeader() }).then((response) => {
    return response.data;
  });
}
const getGameTeamPlayersByTeam = (teamId, gameId) => {
  return axios.get(API_URL + `team_player/playersbyteam/${teamId}/${gameId}`,
    { headers: authHeader(), data: { teamId, gameId } }).then((response) => {
      return response.data;
    });
}
const addTeamPlayer = (req) => {
  return axios.post(API_URL + "team_player/create", req, { headers: authHeader() }).then((response) => {
    return response.data;
  });
};

const addTeam = (req) => {
  return axios.post(API_URL + "team", req, { headers: authHeader() }).then((response) => {
    return response.data;
  });
};


const getAllTeams = () => {
  return axios.get(API_URL + "team", { headers: authHeader() }).then((response) => {
    return response.data;
  });
}

const getAllCoachTeam = () => {
  return axios.get(API_URL + "coach_team", { headers: authHeader() }).then((response) => {
    return response.data;
  });
}

const getAllMyCoachTeam = () => {
  return axios.get(API_URL + "coach_team/mine", { headers: authHeader() }).then((response) => {
    return response.data;
  });
}

const addCoachTeam = (req) => {
  return axios.post(API_URL + "coach_team", req, { headers: authHeader() }).then((response) => {
    return response.data;
  });
};
const updateCoachTeam = (req) => {
  return axios.put(API_URL + `coach_team/${req.id}`, req, { headers: authHeader() }).then((response) => {
    return response.data;
  });
}
const deleteCoachTeam = (id) => {
  return axios.delete(API_URL + `coach_team/${id}`, { headers: authHeader(), data: { id } }).then((response) => {
    return response.data;
  });
}


const addGame = (req) => {
  return axios.post(API_URL + "game", req, { headers: authHeader() }).then((response) => {
    return response.data;
  });
}

const updateGame = (req) => {
  return axios.put(API_URL + `game/${req.id}`, req, { headers: authHeader() }).then((response) => {
    return response.data;
  });
}

const updateTeam = (req) => {
  return axios.put(API_URL + `team/${req.id}`, req, { headers: authHeader() }).then((response) => {
    return response.data;
  });
}
const updateLeague = (req) => {
  return axios.put(API_URL + `league/${req.id}`, req, { headers: authHeader() }).then((response) => {
    return response.data;
  });
}

const getAllSeasons = () => {
  return axios.get(API_URL + "season", { headers: authHeader() }).then((response) => {
    return response.data;
  });
}

const getAllLeagues = () => {
  return axios.get(API_URL + "league", { headers: authHeader() }).then((response) => {
    return response.data;
  });
}
const getAllActions = () => {
  return axios.get(API_URL + "action", { headers: authHeader() }).then((response) => {
    return response.data;
  });
}
const getAllActionTypes = () => {
  return axios.get(API_URL + "action_type", { headers: authHeader() }).then((response) => {
    return response.data;
  });
}
const getAllActionResults = () => {
  return axios.get(API_URL + "action_result", { headers: authHeader() }).then((response) => {
    return response.data;
  });
}
const addLeague = (req) => {
  return axios.post(API_URL + "league", req, { headers: authHeader() }).then((response) => {
    return response.data;
  });
}

const addPlayer = (req) => {
  return axios.post(API_URL + "player", req, { headers: authHeader() }).then((response) => {
    return response.data;
  });
}


const deletePlayersInTeam = (id) => {
  return axios.delete(API_URL + `team_player/${id}`, { headers: authHeader(), data: { id } }).then((response) => {
    return response.data;
  });
}
const deleteTeamTag = (id) => {
  return axios.delete(API_URL + `team_tag/${id}`, { headers: authHeader(), data: { id } }).then((response) => {
    return response.data;
  });
}

const deleteGame = (id) => {
  return axios.delete(API_URL + `game/${id}`, { headers: authHeader(), data: { id } }).then((response) => {
    return response.data;
  });
}

const deleteTeam = (id) => {
  return axios.delete(API_URL + `team/${id}`, { headers: authHeader(), data: { id } }).then((response) => {
    return response.data;
  });
}
const deleteLeague = (id) => {
  return axios.delete(API_URL + `league/${id}`, { headers: authHeader(), data: { id } }).then((response) => {
    return response.data;
  });
}

const deletePlayerTag = (id) => {
  return axios.delete(API_URL + `player_tag/${id}`, { headers: authHeader(), data: { id } }).then((response) => {
    return response.data;
  });
}
const deletePlayer = (id) => {
  return axios.delete(API_URL + `player/${id}`, { headers: authHeader(), data: { id } }).then((response) => {
    return response.data;
  });
}

const getGame = (id) => {
  return axios.get(API_URL + `game/${id}`, { headers: authHeader(), data: { id } }).then((response) => {
    return response.data;
  });
}

const getAllGames = () => {
  return axios.get(API_URL + "game", { headers: authHeader() }).then((response) => {
    return response.data;
  });
}

const getAllPlayers = () => {
  return axios.get(API_URL + "player", { headers: authHeader() }).then((response) => {
    return response.data;
  });
}

const getAllCoach = () => {
  return axios.get(API_URL + "user/coach", { headers: authHeader() }).then((response) => {
    return response.data;
  });
}
const getAllPositions = () => {
  return axios.get(API_URL + "player/position", { headers: authHeader() }).then((response) => {
    return response.data;
  });
}


const updatePlayerTag = (req) => {
  return axios.put(API_URL + `player_tag/${req.id}`, req, { headers: authHeader(), data: { id: req.id } }).then((response) => {
    return response.data;
  });
}

const updatePlayer = (req) => {
  return axios.put(API_URL + `player/${req.id}`, req, { headers: authHeader(), data: { id: req.id } }).then((response) => {
    return response.data;
  });
}

const updateTeamTag = (req) => {
  return axios.put(API_URL + `team_tag/${req.id}`, req, { headers: authHeader(), data: { id: req.id } }).then((response) => {
    return response.data;
  });
}

const updateJersey = (req) => {
  return axios.post(API_URL + "team_player/updatejersey", req, { headers: authHeader() }).then((response) => {
    return response.data;
  });
}
const updateTaggerConfig = (req) => {
  return axios.post(API_URL + "user/updateConfig", req, { headers: authHeader() }).then((response) => {
    return response.data;
  });
}
const addTeamTag = (req) => {
  return axios.post(API_URL + "team_tag", req, { headers: authHeader() }).then((response) => {
    return response.data;
  });
}
const addPlayerTag = (req) => {
  return axios.post(API_URL + "player_tag", req, { headers: authHeader() }).then((response) => {
    return response.data;
  });
}

const addHighlight = (req) => {
  return axios.post(API_URL + "player/highlight", req, { headers: authHeader() }).then((response) => {
    return response.data;
  });
}

const getAllTeamTagsByGame = (id) => {
  return axios.get(API_URL + `team_tag/getbygame/${id}`, { headers: authHeader(), data: { id } }).then((response) => {
    return response.data;
  });
}

const getAllPlayerTagsByTeamTag = (id) => {
  return axios.get(API_URL + `player_tag/getbyteamtag/${id}`, { headers: authHeader(), data: { id } }).then((response) => {
    return response.data;
  });
}

const getTeamById = (id) => {
  return axios.get(API_URL + `team/${id}`, { headers: authHeader(), data: { id } }).then((response) => {
    return response.data;
  });
}

const getSeasonById = (id) => {
  return axios.get(API_URL + `season/${id}`, { headers: authHeader(), data: { id } }).then((response) => {
    return response.data;
  });
}

const getLeagueById = (id) => {
  return axios.get(API_URL + `league/${id}`, { headers: authHeader(), data: { id } }).then((response) => {
    return response.data;
  });
}

const getPlayerById = (id) => {
  return axios.get(API_URL + `player/${id}`, { headers: authHeader(), data: { id } }).then((response) => {
    return response.data;
  });
}
const getAllHighlightByPlayerId = (id) => {
  return axios.get(API_URL + `player/highlight/${id}`, { headers: authHeader(), data: { id } }).then((response) => {
    return response.data;
  });
}
const getAllGamesByPlayer = (id) => {
  return axios.get(API_URL + `player/gameByPlayerId/${id}`, { headers: authHeader(), data: { id } }).then((response) => {
    return response.data;
  });
}

const getAllPlayerTagsByPlayer = (playerId, gameId) => {
  return axios.get(API_URL + `player_tag/getbyplayer/${playerId}/${gameId}`, { headers: authHeader(), data: { playerId, gameId } }).then((response) => {
    return response.data;
  });
}

const getAllPlayerTagsByTeam = (teamId, gameId) => {
  return axios.get(API_URL + `player_tag/getbyteam/${teamId}/${gameId}`, { headers: authHeader(), data: { teamId, gameId } }).then((response) => {
    return response.data;
  });
}

// NEW STREAM URL
const getNewStreamURL = (url) => {
  return axios.post(API_URL + "game/getnewstream", { video_url: url }, { headers: authHeader() }).then((response) => {
    return response.data;
  });
}

const getAllGamesByTeam = (season, league, team) => {
  return axios.get(API_URL + `game/getbyteam/${season}/${league}/${team}`, { headers: authHeader(), data: { season, league, team } }).then((response) => {
    return response.data;
  });
}

const gameService = {
  addTeamPlayer,
  addTeam,
  addLeague,
  addGame,
  addPlayer,
  addTeamTag,
  addPlayerTag,
  addCoachTeam,
  addHighlight,

  getGame,

  getTeamById,
  getSeasonById,
  getLeagueById,
  getPlayerById,

  getGameTeamPlayers,
  getAllTeamPlayers,
  getAllTeams,
  getAllLeagues,
  getAllGames,
  getAllSeasons,
  getAllPlayers,
  getAllTeamTagsByGame,
  getAllPlayerTagsByTeamTag,
  getAllActions,
  getAllActionTypes,
  getAllActionResults,
  getAllPositions,
  getAllGamesByPlayer,
  getAllPlayerTagsByPlayer,
  getAllPlayerTagsByTeam,
  getAllCoach,
  getAllCoachTeam,
  getAllMyCoachTeam,
  getAllHighlightByPlayerId,
  getAllGamesByTeam,
  getGameTeamPlayersByTeam,

  getNewStreamURL,

  updateJersey,
  updateGame,
  updateTeam,
  updateLeague,
  updateTaggerConfig,
  updatePlayerTag,
  updateTeamTag,
  updatePlayer,
  updateCoachTeam,

  deletePlayersInTeam,

  deleteGame,
  deleteTeamTag,
  deletePlayerTag,
  deleteTeam,
  deleteLeague,
  deletePlayer,
  deleteCoachTeam
};

export default gameService;