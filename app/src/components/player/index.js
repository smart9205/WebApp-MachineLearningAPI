import React, { useEffect, useState } from 'react';
import { useParams } from "react-router-dom";
import {
  Box,
} from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import moment from 'moment'
import GameService from "../../services/game.service";
import VIDEO_ICON from '../../assets/video_icon.jpg';

const styles = {
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

export default function Players() {
  const { id } = useParams();
  const playerId = Number(atob(id).slice(3, -3))
  const [loading, setLoading] = useState(true)
  const [games, setGames] = useState([])

  useEffect(() => {
    console.log("PlayerID", playerId)
    setLoading(true)
    GameService.getAllGamesByPlayer(playerId).then((res) => {
      console.log("games", res)
      setGames(res)
      setLoading(false)
    }).catch(() => { setLoading(false) })
  }, [playerId])

  return (
    <>
      {
        loading ?
          <div style={styles.loader}>
            <CircularProgress />
          </div>
          :
          <Box>
            My Games
            {
              games.map((game) =>
                <Box key={game.id} sx={{ my: 1 }} style={{ display: "flex" }}>
                  <div style={{ display: "flex", justifyContent: "center", alignItems: "center", width: 60, margin: "0 15px" }} >
                    <img src={VIDEO_ICON} style={{ width: 60, height: 60, borderRadius: 5 }} alt="video" />
                  </div>
                  <Box>
                    <div>{moment(game.date).format('DD MMM, YYYY hh:mm')}</div>
                    <div>{game.home_team_name}</div>
                    <div>{game.away_team_name}</div>
                  </Box>
                </Box>
              )
            }
          </Box>
      }
    </>
  )
}
