import React, { useEffect, useState, createContext, useContext, useReducer } from 'react';
import { Col, Container, ProgressBar, Row, Tab, Table, Tabs } from 'react-bootstrap'
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import {
    IconButton,
} from '@mui/material';
import { filterAllTags, getPercent } from '../../../common/utilities';
import GameService from '../../../services/game.service';
import { PlayerContext } from '../index';

export default function SkillTab({ playTags }) {
    const { context } = useContext(PlayerContext)

    const teamId = context.game.team_id
    const gameId = context.game.game_id
    const playerId = context.player.id

    const [skills, setSkills] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        GameService.getAllPlayerTagsByTeam(teamId, gameId).then((res) => {
            setSkills(filterAllTags(res, playerId))
            setLoading(false)
        })
    }, [teamId, gameId, playerId])

    return (
        <>
            {skills.map((skill, i) => (
                <div key={i} className='action-row'>
                    <div className="skilltab-action-title">
                        <p>{skill.action}</p>
                    </div>
                    <div style={{ width: "100%", marginRight: 10 }}>
                        <ProgressBar variant="success" now={getPercent(skill.success.length, skill.total)} label={`${skill.success.length}`} />
                    </div>
                    <div ><p>{skill.total}</p></div>
                    <IconButton
                        className="skilltab-play-button"
                        onClick={() => { !!skill.success.length && playTags(skill.success) }}>
                        <PlayArrowIcon />
                    </IconButton>
                </div>
            ))
            }
        </>
    )
}