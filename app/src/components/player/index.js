import React, { useEffect, useState, createContext, useMemo, useReducer } from 'react';
import { useParams } from "react-router-dom";
import { Container, } from 'react-bootstrap'
import {
  IconButton,
  CircularProgress
} from '@mui/material';
import ArrowBackSharpIcon from '@mui/icons-material/ArrowBackSharp';
import moment from 'moment'
import GameService from "../../services/game.service";
import VIDEO_ICON from '../../assets/video_icon.jpg';

import PlayerDetailCard from './PlayerDetailCard';
import GameDetailTab from './GameDetailTab';
import "./Profile.css"

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
    right: "10px",
    color: "white",
    zIndex: 30
  }
};


export const PlayerContext = createContext({
  context: {
    player: null,
    game: null,
    update_cnt: 0,
  },
  setContext: () => { }
});

export default function Players() {

  const { id } = useParams();
  const playerId = Number(atob(id))
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
      console.log("games", res)
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
            <section className='profileSection'>
              <Container>
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
                      <div
                        key={game.id}
                        style={{ display: "flex" }}
                        onClick={() => {
                          setContext({ game })
                        }}
                      >
                        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", width: 60, margin: "0 15px" }} >
                          <img src={game.image?.length > 0 ? game.image : VIDEO_ICON} style={{ width: 60, height: 60, borderRadius: 5 }} alt="video" />
                        </div>
                        <div>
                          <div>{moment(game.date).format('DD MMM, YYYY hh:mm')}</div>
                          <div>{game.home_team_name}</div>
                          <div>{game.away_team_name}</div>
                        </div>
                      </div>
                    )
                  }
                </>
                  :
                  <GameDetailTab />
                }
              </Container>
            </section>
          }
        </>)
    }</PlayerContext.Provider>
  )
}
