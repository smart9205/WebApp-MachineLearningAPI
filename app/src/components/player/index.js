import React, { useEffect, useState, createContext, useMemo, useReducer } from 'react';
import { useParams } from "react-router-dom";
import {
  Box,
  IconButton,
  CircularProgress
} from '@mui/material';
import ArrowBackSharpIcon from '@mui/icons-material/ArrowBackSharp';
import moment from 'moment'
import GameService from "../../services/game.service";
import VIDEO_ICON from '../../assets/video_icon.jpg';

import PlayerDetailCard from './PlayerDetailCard';
import GameDetailTab from './GameDetailTab';

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
  },
  back: {
    position: "absolute",
    right: "10px"
  }
};


export const PlayerContext = createContext({
  context: {
    player: null,
    game: null
  },
  setContext: () => { }
});

export default function Players() {

  const { id } = useParams();
  const playerId = Number(atob(id).slice(3, -3))
  const [loading, setLoading] = useState(true)
  const [games, setGames] = useState([])

  const [context, setContext] = useReducer((old, action) => ({ ...old, ...action }), {})

  const value = useMemo(
    () => ({ context, setContext }),
    [context]
  );

  useEffect(() => {
    setLoading(true)
    GameService.getAllGamesByPlayer(playerId).then((res) => {
      setGames(res)
      setLoading(false)
    }).catch(() => { setLoading(false) })

    GameService.getPlayerById(playerId).then((res) => {
      setContext({ player: res })
    }).catch(() => { })
  }, [playerId])

  const { player: playerData, game: curGame } = context

  return (
    <PlayerContext.Provider value={value}>{
      loading ?
        <div style={styles.loader}>
          <CircularProgress />
        </div> :
        (<>
          {
            <Box>
              {
                !!curGame &&
                <IconButton style={styles.back} onClick={() => setContext({ game: null })}>
                  <ArrowBackSharpIcon />
                </IconButton>
              }
              {playerData && <PlayerDetailCard player={playerData} />}
              {!curGame ? <>
                {
                  games.map((game) =>
                    <Box
                      key={game.id}
                      sx={{ my: 1 }}
                      style={{ display: "flex" }}
                      onClick={() => {
                        setContext({ game })
                      }}
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
              </>
                :
                <GameDetailTab />
              }
            </Box>
          }
        </>)
    }</PlayerContext.Provider>
  )
}
