import React, { useEffect, useState, createContext, useContext, useReducer } from 'react';
import { ProgressBar } from "react-step-progress-bar";
import "react-step-progress-bar/styles.css";
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import {
    IconButton,
    CircularProgress
} from '@mui/material';
import { filterAllTags, manualFilterForTags, getPercent } from '../../../common/utilities';
import GameService from '../../../services/game.service';
import { PlayerContext } from '../index';

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
}
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

            {loading ?
                <div style={styles.loader}>
                    <CircularProgress />
                </div> : (
                    <>
                        {
                            skills
                                .map((skill, i) => {
                                    const percent = skill.total / 2 < skill.success.length ? getPercent(skill.success.length, skill.total) :
                                        skill.total / 4 < skill.success.length ? 50 :
                                            skill.success.length > 0 ? 25 : 0
                                    return (
                                        <div key={i} className='action-row'>
                                            <div className="skilltab-action-title">
                                                <p>{skill.title}</p>
                                            </div>
                                            <IconButton
                                                disabled={skill.success.length === 0}
                                                className="skilltab-play-button"
                                                onClick={() => { !!skill.success.length && playTags(skill.success) }}>
                                                <PlayArrowIcon />
                                            </IconButton>
                                            <div style={{ width: "100%", marginRight: 10 }}>
                                                <div>
                                                    <ProgressBar
                                                        height={20}
                                                        filledBackground={`linear-gradient(to right, 
                                                                ${skill.total / 4 > skill.success.length ?
                                                                "#fefb72, #f0bb31" : "#98ffae, #00851e"})`}
                                                        percent={percent}
                                                        text={skill.success.length}
                                                    />
                                                </div>
                                            </div>
                                            <div className='skilltab-total'><p>{skill.total}</p></div>
                                        </div>
                                    )
                                })
                        }
                    </>
                )

            }</>
    )
}