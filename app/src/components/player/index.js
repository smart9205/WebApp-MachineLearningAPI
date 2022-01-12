import React, { useEffect, useState } from 'react';
import { useParams } from "react-router-dom";
import {
  Paper,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  CardMedia,
} from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import moment from 'moment'
import GameService from "../../services/game.service";
import VIDEO_ICON from '../../assets/video_icon.jpg';
import TagVideo from './TagVideo';

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
  const [open, setOpen] = useState(false)
  const [playerData, setPlayerData] = useState(null)

  useEffect(() => {
    console.log("PlayerID", playerId)
    setLoading(true)
    GameService.getAllGamesByPlayer(playerId).then((res) => {
      console.log("games", res)
      setGames(res)
      setLoading(false)
    }).catch(() => { setLoading(false) })

    GameService.getPlayerById(playerId).then((res) => {
      console.log("player", res)
      setPlayerData(res)
    }).catch(() => { })
  }, [playerId])

  return (
    <>
      <Dialog open={open} onClose={e => setOpen(false)}>
        <DialogTitle>Video Tag</DialogTitle>
        <DialogContent>
          <TagVideo />
        </DialogContent>
        <DialogActions>
          <Button onClick={e => setOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
      {
        loading ?
          <div style={styles.loader}>
            <CircularProgress />
          </div>
          :
          <Box>
            {
              playerData &&
              <Paper style={{ display: "flex" }} >
                <CardMedia
                  sx={{ width: 200, marginRight: 2 }}
                  component="img"
                  // height="240"
                  image={VIDEO_ICON}
                  alt="photo"
                />
                <Box style={{ display: "flex", flexDirection: "column", justifyContent: "space-around" }}>
                  <div>
                    Name: <h5>{playerData.f_name} {playerData.l_name}</h5>
                  </div>
                  <div>
                    Jersey: <h5>{playerData.jersey_number}</h5>
                  </div>
                  <div>
                    Birth: <h5>{moment(playerData.date_of_birth).format('DD MMM, YYYY')}</h5>
                  </div>
                </Box>
              </Paper>
            }
            {
              games.map((game) =>
                <Box
                  key={game.id}
                  sx={{ my: 1 }}
                  style={{ display: "flex" }}
                  onClick={() => setOpen(true)}
                >
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