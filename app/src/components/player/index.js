import React, { useEffect, useState, createContext, useMemo, useReducer } from 'react';
import { useParams } from "react-router-dom";
import { createTheme, ThemeProvider } from '@mui/material/styles';
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


// G = Goals
// SH = Shots
// P = Pass
// I = Interceptions
// S = Saved
// C = Clearence

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
const defaultPrimaryColor = '#058240';
const defaultSecondColor = '#e7f3e5';

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

  const [primaryColor, setPrimaryColor] = useState(defaultPrimaryColor);
  const [secondColor, setSecondColor] = useState(defaultSecondColor);
  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          primary: { main: primaryColor },
          secondary: { main: secondColor }
        },
      }),
    [primaryColor, secondColor],
  );

  useEffect(() => {
    setLoading(true)
    GameService.getGameDetailssByPlayer(playerId).then((res) => {
      setGames(res)
      setLoading(false)
    }).catch(() => { setLoading(false) })

    GameService.getPlayerById(playerId).then((res) => {
      setContext({ player: res })
      setPrimaryColor(res.team_color || defaultPrimaryColor)
      setSecondColor(res.second_color || defaultSecondColor)
    }).catch(() => { })
  }, [playerId])

  console.log("games", games)

  const numClicked = (gameId, key) => {
    GameService.getPlayerTagsByActionName(playerId, gameId, key).then(res => {
      console.log("player_tags", res)
    })
  }

  const { player: playerData, game: curGame } = context

  return (
    <ThemeProvider theme={theme}>
      <PlayerContext.Provider value={value}>{
        loading ?
          <div style={styles.loader}>
            <CircularProgress />
          </div> :
          (<>
            {
              <section className='profileSection'>
                {playerData && <PlayerDetailCard player={playerData} />}
                {!curGame ? (
                  <>
                    <Table borderless size="sm" className='profileSection_gametable'>
                      <tbody className='text-center'>
                        <tr className="profileSection_gametable-head" style={{ backgroundColor: theme.palette.secondary.main }}>
                          <th></th>
                          <th>G</th>
                          <th>SH</th>
                          <th>P</th>
                          <th>I</th>
                          <th>S</th>
                          <th>C</th>
                        </tr>
                        {games.map((game, i) =>
                          <tr key={i}>
                            <td
                              className='profileSection_opponent-team'
                              onClick={() => {
                                setContext({ game })
                              }}
                            >
                              <IconButton color="primary"
                                onClick={() => setContext({ game: null })}
                              >
                                <PlayCircleOutlineIcon />
                              </IconButton>
                              <div className='profileSection_game-result'>
                                {
                                  !game?.is_home_team ? game?.home_team_name : game?.away_team_name
                                }
                                <div style={{
                                  color: game?.home_team_goal === game?.away_team_goal ? '#ffbf00' :
                                    (game?.is_home_team && game?.home_team_goal > game?.away_team_goal) ? 'green' : 'red'
                                }}
                                  className="profileSection_game-score"
                                >
                                  {game?.home_team_goal} : {game?.away_team_goal}
                                </div>
                              </div>
                            </td>
                            {['goal', 'shot', 'pass', 'interception', 'saved', 'clearance'].map((key, idx) => (
                              <td
                                className={game?.[key] > 0 && "profileSection_clickable"}
                                onClick={() => numClicked(game.id, key)}
                              >
                                {game?.[key]}
                              </td>
                            ))
                            }

                          </tr>
                        )}
                      </tbody>
                    </Table>
                    <div
                      className='profileSection_gametable-average'
                      style={{ borderColor: theme.palette.primary.main, backgroundColor: theme.palette.secondary.main }}
                    >
                      <div>Average</div>
                      <div>1</div>
                      <div>8</div>
                      <div>10</div>
                      <div>46</div>
                      <div>46</div>
                      <div>20</div>
                    </div>
                  </>) :
                  <GameDetailTab />
                }
              </section>
            }
          </>)
      }</PlayerContext.Provider>
    </ThemeProvider>
  )
}
