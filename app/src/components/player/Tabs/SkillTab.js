import React, { useEffect, useState, createContext, useContext, useReducer } from 'react';
import { ProgressBar } from "react-step-progress-bar";
import "react-step-progress-bar/styles.css";
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import {
    IconButton,
} from '@mui/material';
import { filterAllTags, manualFilterForTags, getPercent } from '../../../common/utilities';
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
            console.log(res, gameId)
            setSkills(manualFilterForTags(res, playerId))
            setLoading(false)
        })
    }, [teamId, gameId, playerId])

    return (
        <>
            {skills
                .map((skill, i) => {
                    const percent = skill.total / 2 < skill.success.length ? getPercent(skill.success.length, skill.total) :
                        skill.total / 4 < skill.success.length ? 50 :
                            25
                    return (
                        <div key={i} className='action-row'>
                            <div className="skilltab-action-title">
                                <p>{skill.title}</p>
                            </div>
                            <div style={{ width: "100%", marginRight: 10 }}>
                                <div>
                                    <ProgressBar
                                        height={20}
                                        filledBackground={`linear-gradient(to right, 
                                    ${skill.total / 4 > skill.success.length ? "#fefb72, #f0bb31" : "#98ffae, #00851e"})`}
                                        percent={percent}
                                        text={skill.success.length}
                                    />
                                </div>
                            </div>
                            <div ><p>{skill.total}</p></div>
                            <IconButton
                                className="skilltab-play-button"
                                onClick={() => { !!skill.success.length && playTags(skill.success) }}>
                                <PlayArrowIcon />
                            </IconButton>
                        </div>
                    )
                })
            }
        </>
    )
}