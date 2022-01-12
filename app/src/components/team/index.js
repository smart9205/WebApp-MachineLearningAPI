import React, { useEffect, useState } from 'react';
import { useLocation, useHistory } from "react-router-dom";
import {
  Grid,
  Paper,
  Box,
} from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import GameService from "../../services/game.service";

import COURT from "../../assets/court.png";
import PlayerCard from './PlayerCard';


const styles = {
  paperContainer: {
    backgroundImage: `url(${COURT})`,
    backgroundSize: "contain",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center top",
    minHeight: 300
  },
  loader: {
    position: 'fixed',
    left: '0px',
    top: '0px',
    width: '100%',
    height: '100%',
    zIndex: 9999,
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
  }
};

export default function Team() {
  const search = useLocation().search;
  const params = new URLSearchParams(search)
  const history = useHistory();
  const teamId = params.get('teamid');
  const seasonId = params.get('seasonid');
  const leagueId = params.get('leagueid');

  const [loading, setLoading] = useState(true)
  const [team, setTeam] = useState(null)
  const [players, setPlayers] = useState([])

  useEffect(() => {
    setLoading(true)
    console.log("render", teamId, seasonId, leagueId)
    GameService.getAllTeamPlayers({
      season_id: seasonId,
      league_id: leagueId,
      team_id: teamId
    }).then((res) => {
      console.log("result", res)
      setPlayers(res)
      setLoading(false)
    }).catch(() => {
      setLoading(false)
    })
    GameService.getTeamById(teamId).then((res) => {
      setTeam(res)
    }).catch(() => { })
  }, [teamId, seasonId, leagueId])

  return (
    <>
      {
        loading ?
          <div style={styles.loader}>
            <CircularProgress />
          </div>
          :
          <Box>
            <Paper sx={{ padding: 1, marginBottom: 1, textAlign: 'center' }}>
              {!!team ? team.name : ""}
            </Paper>
            <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }} style={styles.paperContainer}>
              {
                players.map((player) =>
                  <Grid item xs={4} key={player.id}
                    onClick={() => {
                      console.log("player clicked")
                      history.push(`/player/${player.id}`);
                    }}
                  >
                    <PlayerCard player={player} />
                  </Grid>
                )
              }
            </Grid>
          </Box>
      }
    </>
  )
}
