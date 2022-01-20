import React, { useEffect, useState } from 'react';
import { Link, useParams } from "react-router-dom";
import randomString from 'randomstring'
import './Field.css'
import GameService from "../../services/game.service";
import { PLAYER_ICON_DEFAULT } from '../../common/staticData';

const FIELD_LIST = ["LF", "CF", "RF", "LW", "AM", "RW", "LM", "CM", "RM", "LMD", "DM", "RMD", "LD", "CD", "RD", "GK"]

export default function Field() {
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
      console.log("players", res)
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
      <h1 className='text-center'>Barcelona</h1>
      <div className="containerr">
        <div className="content">
          <div className="field-container">
            <div className="f-field">
              {
                FIELD_LIST.map((field) => {
                  const fPlayers = players.filter(fp => fp.position_short === field)
                  return (
                    <div className={`${field.toLowerCase()} p${fPlayers.length}`} key={field}>{field}
                      {
                        fPlayers.map((fp => (
                          <div className="pl" key={fp.id} style={{ backgroundImage: `url(${fp.image ?? PLAYER_ICON_DEFAULT})` }}>
                            <Link
                              to={`/ player / ${btoa(randomString.generate(3) + fp.player_id + randomString.generate(3))}`}
                              className="name"
                            >
                              {fp.f_name}
                            </Link>
                          </div>
                        )))
                      }
                    </div>
                  )
                })
              }
            </div>
          </div>
        </div>
      </div >
    </>
  )
}
