import React, { useEffect, useState } from 'react';
import { useParams } from "react-router-dom";
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
      setLoading(false)
    }).catch(() => {
      setLoading(false)
    })
    GameService.getTeamById(teamId).then((res) => {
      setTeam(res)
    }).catch(() => { })
  }, [teamId, seasonId, leagueId])

  if (loading) { }

  return (
    <div className="team-field-container">
      <div className='teamHeading'><h1 className='text-center'>{team?.name}</h1></div>
      <div className="containerr">
        <div className="content">
          <div className="field-container">
            <div className="f-field">
              {
                FIELD_LIST.map((field) => {
                  const fPlayers = players.filter(fp => fp.position_short === field)
                  return (
                    <div className={`${field.toLowerCase()} p${fPlayers.length}`} key={field}>
                      {
                        fPlayers.map(((fp, i) => (
                          <a
                            href={`/player/${btoa(fp.id)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="pl"
                            key={i}
                            style={{ backgroundImage: `url(${fp?.image?.length > 0 ? fp.image : PLAYER_ICON_DEFAULT})` }}
                          >
                            <div className="name" key={fp.id} >
                              {fp.l_name}
                            </div>
                          </a>
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
    </div >
  )
}
