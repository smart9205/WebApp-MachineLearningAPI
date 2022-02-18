import React, { useEffect, useState, createContext, useMemo, useReducer } from 'react';
import { useParams } from "react-router-dom";
import {
  IconButton,
  CircularProgress
} from '@mui/material';
import ArrowBackSharpIcon from '@mui/icons-material/ArrowBackSharp';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import GameService from "../../services/game.service";

import PlayerDetailCard from './PlayerDetailCard';
import GameDetailTab from './GameDetailTab';
import "./Profile.css"
import { Table } from 'react-bootstrap';

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
  },
  play: {
    color: '#07863d'
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
              {
                !!curGame &&
                <IconButton style={styles.back} onClick={() => setContext({ game: null })}>
                  <ArrowBackSharpIcon />
                </IconButton>
              }
              {playerData && <PlayerDetailCard player={playerData} />}
              {!curGame ? <Table borderless size="sm" className='profileSection_gametable'>
                <tbody className='text-center'>
                  <tr className="profileSection_gametable-head">
                    <th></th>
                    <th>G</th>
                    <th>SH</th>
                    <th>P</th>
                    <th>I</th>
                    <th>S</th>
                    <th>C</th>
                  </tr>
                  {games.map((game) =>
                    <tr>
                      <td className='profileSection_opponent-team'>
                        <IconButton style={styles.play} onClick={() => setContext({ game: null })}>
                          <PlayCircleOutlineIcon />
                        </IconButton>
                        <div onClick={() => {
                          setContext({ game })
                        }}>
                          {game.away_team_name}
                          <div>
                            2:0
                          </div>
                        </div>
                      </td>
                      <td>1</td>
                      <td>8</td>
                      <td>10</td>
                      <td>46</td>
                      <td>46</td>
                      <td>20</td>
                    </tr>
                  )}
                </tbody>
                <div className='profileSection_gametable-average'>
                  <div>
                    Average
                    <p className='profileSection_gametable-average-period'>
                      10.10~10.20
                    </p>
                  </div>
                  <div>1</div>
                  <div>8</div>
                  <div>10</div>
                  <div>46</div>
                  <div>46</div>
                  <div>20</div>
                </div>
              </Table> :
                <GameDetailTab />
              }
              {/* {!curGame ? games.map((game) =>
                <div
                  key={game.id}
                  style={{ display: "flex" }}
                  onClick={() => {
                    setContext({ game })
                  }}
                >
                  <div
                    className='gameImage'
                    style={{ backgroundImage: `url(${game?.image?.length > 0 ? game.image : VIDEO_ICON})`, width: 100, height: 70 }}>
                  </div>
                  <div>
                    <div>{moment(game.date).format('DD MMM, YYYY hh:mm')}</div>
                    <div>{game.home_team_name}</div>
                    <div>{game.away_team_name}</div>
                  </div>
                </div>
              ) :
              } */}
            </section>
          }
        </>)
    }</PlayerContext.Provider>
  )
}
