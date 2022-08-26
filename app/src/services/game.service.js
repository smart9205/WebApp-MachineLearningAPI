import axios from 'axios';
import authHeader from './auth-header';
import * as settings from '../config/settings';

const API_URL = `${settings.APIBASEURL}/`;

const getAllTeamPlayers = (req) => {
    return axios.post(API_URL + 'team_player/findall', req, { headers: authHeader() }).then((response) => {
        return response.data;
    });
};

const getGameTeamPlayers = (req) => {
    return axios.post(API_URL + 'team_player/playersbygameteam', req, { headers: authHeader() }).then((response) => {
        return response.data;
    });
};

const getAllGameTeamPlayers = (gameId) => {
    return axios.get(API_URL + `team_player/allplayersbygameteam/${gameId}`, { headers: authHeader(), data: { gameId } }).then((response) => {
        return response.data;
    });
};

const getGameTeamPlayersByTeam = (teamId, gameId) => {
    return axios.get(API_URL + `team_player/playersbyteam/${teamId}/${gameId}`, { headers: authHeader(), data: { teamId, gameId } }).then((response) => {
        return response.data;
    });
};
const addTeamPlayer = (req) => {
    return axios.post(API_URL + 'team_player/create', req, { headers: authHeader() }).then((response) => {
        return response.data;
    });
};

const addTeam = (req) => {
    return axios.post(API_URL + 'team', req, { headers: authHeader() }).then((response) => {
        return response.data;
    });
};

const getAllTeams = () => {
    return axios.get(API_URL + 'team', { headers: authHeader() }).then((response) => {
        return response.data;
    });
};

const getAllCoachTeam = () => {
    return axios.get(API_URL + 'coach_team', { headers: authHeader() }).then((response) => {
        return response.data;
    });
};

const getAllGamesByCoach = (seasonId, leagueId, teamId, datesBack) => {
    return axios.get(API_URL + `game/getbycoach/${seasonId}/${leagueId}/${teamId}/${datesBack}`, { headers: authHeader(), data: { seasonId, leagueId, teamId, datesBack } }).then((response) => {
        return response.data;
    });
};

const getAllMyCoachTeam = () => {
    return axios.get(API_URL + 'coach_team/mine', { headers: authHeader() }).then((response) => {
        return response.data;
    });
};
const getMyCoachTeamList = () => {
    return axios.get(API_URL + 'coach_team/teams', { headers: authHeader() }).then((response) => {
        return response.data;
    });
};
const getMyCoachPlayerList = () => {
    return axios.get(API_URL + 'coach_team/coach_players', { headers: authHeader() }).then((response) => {
        return response.data;
    });
};
const getAllMyCoachPlayer = () => {
    return axios.get(API_URL + 'coach_team/players', { headers: authHeader() }).then((response) => {
        return response.data;
    });
};
const getCoachPlayerGames = (playerId) => {
    return axios.get(API_URL + `coach_team/player_games/${playerId}`, { headers: authHeader(), data: { id: playerId } }).then((response) => {
        return response.data;
    });
};

const getCoachTeamPlayers = (teamId, seasonId) => {
    return axios.get(API_URL + `coach_team/team_players/${teamId}/${seasonId}`, { headers: authHeader(), data: { teamId, seasonId } }).then((response) => {
        return response.data;
    });
};

const addCoachTeam = (req) => {
    return axios.post(API_URL + 'coach_team', req, { headers: authHeader() }).then((response) => {
        return response.data;
    });
};
const getAllPlayerTagsByCoachPlayer = (req) => {
    return axios.post(API_URL + 'coach_team/get_tags_by_player', req, { headers: authHeader() }).then((response) => {
        return response.data;
    });
};
const updateCoachTeam = (req) => {
    return axios.put(API_URL + `coach_team/${req.id}`, req, { headers: authHeader() }).then((response) => {
        return response.data;
    });
};
const updateUserEdit = (req) => {
    return axios.put(API_URL + `user_edits/${req.id}`, req, { headers: authHeader() }).then((response) => {
        return response.data;
    });
};
const deleteUserEdit = (id) => {
    return axios.delete(API_URL + `user_edits/${id}`, { headers: authHeader(), data: { id } }).then((response) => {
        return response.data;
    });
};
const deleteEditClip = (id) => {
    return axios.delete(API_URL + `user_edits/edit_clip/${id}`, { headers: authHeader(), data: { id } }).then((response) => {
        return response.data;
    });
};
const deleteCoachTeam = (id) => {
    return axios.delete(API_URL + `coach_team/${id}`, { headers: authHeader(), data: { id } }).then((response) => {
        return response.data;
    });
};
const addGame = (req) => {
    return axios.post(API_URL + 'game', req, { headers: authHeader() }).then((response) => {
        return response.data;
    });
};

const updateGame = (req) => {
    return axios.put(API_URL + `game/${req.id}`, req, { headers: authHeader() }).then((response) => {
        return response.data;
    });
};

const updateTeam = (req) => {
    return axios.put(API_URL + `team/${req.id}`, req, { headers: authHeader() }).then((response) => {
        return response.data;
    });
};
const updateLeague = (req) => {
    return axios.put(API_URL + `league/${req.id}`, req, { headers: authHeader() }).then((response) => {
        return response.data;
    });
};

const updateEditClipsSort = (req) => {
    return axios.put(API_URL + `user_edit_clips_sort`, req, { headers: authHeader() }).then((response) => {
        return response.data;
    });
};

const updateEditClip = (req) => {
    return axios.put(API_URL + `user_edit_clip/${req.id}`, req, { headers: authHeader() }).then((response) => {
        return response.data;
    });
};

const getAllSeasons = () => {
    return axios.get(API_URL + 'season', { headers: authHeader() }).then((response) => {
        return response.data;
    });
};

const getAllLeagues = () => {
    return axios.get(API_URL + 'league', { headers: authHeader() }).then((response) => {
        return response.data;
    });
};
const getAllActions = () => {
    return axios.get(API_URL + 'action', { headers: authHeader() }).then((response) => {
        return response.data;
    });
};
const getAllActionTypes = () => {
    return axios.get(API_URL + 'action_type', { headers: authHeader() }).then((response) => {
        return response.data;
    });
};
const getAllActionResults = () => {
    return axios.get(API_URL + 'action_result', { headers: authHeader() }).then((response) => {
        return response.data;
    });
};
const addLeague = (req) => {
    return axios.post(API_URL + 'league', req, { headers: authHeader() }).then((response) => {
        return response.data;
    });
};

const addPlayer = (req) => {
    return axios.post(API_URL + 'player', req, { headers: authHeader() }).then((response) => {
        return response.data;
    });
};

const deletePlayersInTeam = (id) => {
    return axios.delete(API_URL + `team_player/${id}`, { headers: authHeader(), data: { id } }).then((response) => {
        return response.data;
    });
};
const deleteTeamTag = (id) => {
    return axios.delete(API_URL + `team_tag/${id}`, { headers: authHeader(), data: { id } }).then((response) => {
        return response.data;
    });
};

const deleteGame = (id) => {
    return axios.delete(API_URL + `game/${id}`, { headers: authHeader(), data: { id } }).then((response) => {
        return response.data;
    });
};

const deleteTeam = (id) => {
    return axios.delete(API_URL + `team/${id}`, { headers: authHeader(), data: { id } }).then((response) => {
        return response.data;
    });
};
const deleteLeague = (id) => {
    return axios.delete(API_URL + `league/${id}`, { headers: authHeader(), data: { id } }).then((response) => {
        return response.data;
    });
};

const deletePlayerTag = (id) => {
    return axios.delete(API_URL + `player_tag/${id}`, { headers: authHeader(), data: { id } }).then((response) => {
        return response.data;
    });
};
const deletePlayer = (id) => {
    return axios.delete(API_URL + `player/${id}`, { headers: authHeader(), data: { id } }).then((response) => {
        return response.data;
    });
};

const getGame = (id) => {
    return axios.get(API_URL + `game/${id}`, { headers: authHeader(), data: { id } }).then((response) => {
        return response.data;
    });
};

const getAllGames = () => {
    return axios.get(API_URL + 'game', { headers: authHeader() }).then((response) => {
        return response.data;
    });
};

const getAllPlayers = () => {
    return axios.get(API_URL + 'player', { headers: authHeader() }).then((response) => {
        return response.data;
    });
};

const getAllCoach = () => {
    return axios.get(API_URL + 'user/coach', { headers: authHeader() }).then((response) => {
        return response.data;
    });
};
const getAllPositions = () => {
    return axios.get(API_URL + 'player/position', { headers: authHeader() }).then((response) => {
        return response.data;
    });
};

const updatePlayerTag = (req) => {
    return axios.put(API_URL + `player_tag/${req.id}`, req, { headers: authHeader(), data: { id: req.id } }).then((response) => {
        return response.data;
    });
};

const updatePlayer = (req) => {
    return axios.put(API_URL + `player/${req.id}`, req, { headers: authHeader(), data: { id: req.id } }).then((response) => {
        return response.data;
    });
};

const updateTeamTag = (req) => {
    return axios.put(API_URL + `team_tag/${req.id}`, req, { headers: authHeader(), data: { id: req.id } }).then((response) => {
        return response.data;
    });
};

const updateJersey = (req) => {
    return axios.post(API_URL + 'team_player/updatejersey', req, { headers: authHeader() }).then((response) => {
        return response.data;
    });
};
const updateTaggerConfig = (req) => {
    return axios.post(API_URL + 'user/updateConfig', req, { headers: authHeader() }).then((response) => {
        return response.data;
    });
};
const addTeamTag = (req) => {
    return axios.post(API_URL + 'team_tag', req, { headers: authHeader() }).then((response) => {
        return response.data;
    });
};
const addPlayerTag = (req) => {
    return axios.post(API_URL + 'player_tag', req, { headers: authHeader() }).then((response) => {
        return response.data;
    });
};

const addHighlight = (req) => {
    return axios.post(API_URL + 'player/highlight', req, { headers: authHeader() }).then((response) => {
        return response.data;
    });
};

const addUserEdits = (req) => {
    return axios.post(API_URL + 'user_edits', req, { headers: authHeader() }).then((response) => {
        return response.data;
    });
};

const getAllUserEdits = () => {
    return axios.get(API_URL + 'user_edits', { headers: authHeader() }).then((response) => {
        return response.data;
    });
};

const getEditClipsByUserEditId = (id) => {
    return axios.get(API_URL + `user_edits/${id}`, { headers: authHeader(), data: { id } }).then((response) => {
        return response.data;
    });
};

const getAllTeamTagsByGame = (id) => {
    return axios.get(API_URL + `team_tag/getbygame/${id}`, { headers: authHeader(), data: { id } }).then((response) => {
        return response.data;
    });
};

const getAllPlayerTagsByTeamTag = (id) => {
    return axios.get(API_URL + `player_tag/getbyteamtag/${id}`, { headers: authHeader(), data: { id } }).then((response) => {
        return response.data;
    });
};

const getTeamById = (id) => {
    return axios.get(API_URL + `team/${id}`, { headers: authHeader(), data: { id } }).then((response) => {
        return response.data;
    });
};

const getSeasonById = (id) => {
    return axios.get(API_URL + `season/${id}`, { headers: authHeader(), data: { id } }).then((response) => {
        return response.data;
    });
};

const getLeagueById = (id) => {
    return axios.get(API_URL + `league/${id}`, { headers: authHeader(), data: { id } }).then((response) => {
        return response.data;
    });
};

const getPlayerById = (id) => {
    return axios.get(API_URL + `player/${id}`, { headers: authHeader(), data: { id } }).then((response) => {
        return response.data;
    });
};

const getAllHighlightByPlayerId = (id) => {
    return axios.get(API_URL + `player/highlight/${id}`, { headers: authHeader(), data: { id } }).then((response) => {
        return response.data;
    });
};
const getAllGamesByPlayer = (id) => {
    return axios.get(API_URL + `player/gameByPlayerId/${id}`, { headers: authHeader(), data: { id } }).then((response) => {
        return response.data;
    });
};

const getGameDetailssByPlayer = (id) => {
    return axios.get(API_URL + `player/gameDetailsByPlayerId/${id}`, { headers: authHeader(), data: { id } }).then((response) => {
        return response.data;
    });
};

const getAllPlayerTagsByPlayer = (playerId, gameId) => {
    return axios.get(API_URL + `player_tag/getbyplayer/${playerId}/${gameId}`, { headers: authHeader(), data: { playerId, gameId } }).then((response) => {
        return response.data;
    });
};

const getPlayerTagsByActionName = (playerId, gameId, actionName) => {
    return axios.get(API_URL + `player_tag/getbyaction/${playerId}/${gameId}/${actionName}`, { headers: authHeader(), data: { playerId, gameId, actionName } }).then((response) => {
        return response.data;
    });
};

const getAllPlayerTagsByTeam = (teamId, gameId) => {
    return axios.post(API_URL + `player_tag/getbyteam`, { teamId, gameId }, { headers: authHeader() }).then((response) => {
        return response.data;
    });
};

const getGameScore = (gameId) => {
    return axios.get(API_URL + `player_tag/getgamescore/${gameId}`, { headers: authHeader(), data: { gameId } }).then((response) => {
        return response.data;
    });
};

const getScoreInGames = (gameIds, teamId) => {
    return axios.post(API_URL + `game/getscoreingames`, { gameIds, teamId }, { headers: authHeader() }).then((response) => {
        return response.data;
    });
};

// NEW STREAM URL
const getAsyncNewStreamURL = async (url) => {
    return (await axios.post(API_URL + 'game/getnewstream', { video_url: url }, { headers: authHeader() })).data;
};
const getNewStreamURL = (url) => {
    return axios.post(API_URL + 'game/getnewstream', { video_url: url }, { headers: authHeader() }).then((response) => {
        return response.data;
    });
};
const getPlayerActions = (gameIds, teamId) => {
    return axios.post(API_URL + 'game/getplayeractions', { gameIds, teamId }, { headers: authHeader() }).then((response) => {
        return response.data;
    });
};

const getAllGamesByTeam = (season, league, team) => {
    return axios.get(API_URL + `game/getbyteam/${season}/${league}/${team}`, { headers: authHeader(), data: { season, league, team } }).then((response) => {
        return response.data;
    });
};

const getTeamByPlayerGame = (playerId, gameId) => {
    return axios.get(API_URL + `team_player/teambyplayergame/${playerId}/${gameId}`, { headers: authHeader(), data: { playerId, gameId } }).then((response) => {
        return response.data;
    });
};

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

    addUserEdits,

    getGame,
    getAllUserEdits,
    getEditClipsByUserEditId,
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
    getAllGamesByCoach,
    getAllMyCoachTeam,
    getMyCoachTeamList,
    getMyCoachPlayerList,
    getAllMyCoachPlayer,
    getAllHighlightByPlayerId,
    getAllGamesByTeam,
    getGameTeamPlayersByTeam,
    getTeamByPlayerGame,
    getGameDetailssByPlayer,
    getPlayerTagsByActionName,
    getGameScore,
    getScoreInGames,
    getAsyncNewStreamURL,
    getNewStreamURL,
    getPlayerActions,
    getCoachPlayerGames,
    getCoachTeamPlayers,
    getAllPlayerTagsByCoachPlayer,
    getAllGameTeamPlayers,

    updateJersey,
    updateGame,
    updateTeam,
    updateLeague,
    updateTaggerConfig,
    updatePlayerTag,
    updateTeamTag,
    updatePlayer,
    updateCoachTeam,
    updateUserEdit,
    updateEditClipsSort,
    updateEditClip,

    deletePlayersInTeam,

    deleteEditClip,
    deleteGame,
    deleteTeamTag,
    deletePlayerTag,
    deleteTeam,
    deleteLeague,
    deletePlayer,
    deleteCoachTeam,
    deleteUserEdit
};

export default gameService;
