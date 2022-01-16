import React, { useEffect, useState } from 'react';
import { useParams, useHistory } from "react-router-dom";
import {
  Grid,
  Paper,
  Box,
} from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import GameService from "../../services/game.service";
import randomString from 'randomstring'
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
  const history = useHistory()
  const { data } = useParams()
  const teamId = atob(data).split('|')[0]
  const seasonId = atob(data).split('|')[1]
  const leagueId = atob(data).split('|')[2]

  const [loading, setLoading] = useState(true)
  const [team, setTeam] = useState(null)
  const [players, setPlayers] = useState([])

  useEffect(() => {
    setLoading(true)
    GameService.getAllTeamPlayers({
      season_id: seasonId,
      league_id: leagueId,
      team_id: teamId
    }).then((res) => {
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
                      history.push(`/player/${btoa(randomString.generate(3) + player.player_id + randomString.generate(3))}`);
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
