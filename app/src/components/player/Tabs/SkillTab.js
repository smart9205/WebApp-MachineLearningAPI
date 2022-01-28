import React, { useEffect, useState, useContext } from 'react';
import { ProgressBar } from "react-step-progress-bar";
import "react-step-progress-bar/styles.css";
import {
    Snackbar,
    Alert,
    IconButton,
    CircularProgress
} from '@mui/material';
import { manualFilterForTags, getPercent } from '../../../common/utilities';
import GameService from '../../../services/game.service';
import { PlayerContext } from '../index';
import PlayButton from "../../../assets/Play_button.png"
import StarButton from "../../../assets/Stars.png"

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
    const { context, setContext } = useContext(PlayerContext)

    const teamId = context.game.team_id
    const gameId = context.game.game_id
    const playerId = context.player.id

    const [skills, setSkills] = useState([])
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        GameService.getAllPlayerTagsByTeam(teamId, gameId).then((res) => {
            setSkills(manualFilterForTags(res, playerId))
            setLoading(false)
        }).catch(() => setLoading(false))
    }, [teamId, gameId, playerId])

    const saveHighlight = () => {
        setLoading(true)
        GameService.addHighlight({
            player_id: playerId,
            game_id: gameId
        }).then((res) => {
            if (!res[1]) setOpen(true)
            setLoading(false)
            setContext({ update_cnt: context.update_cnt + 1 })
        }).catch(() => setLoading(false))
    }

    return (
        <>
            <Snackbar
                open={open}
                anchorOrigin={{ vertical: "top", horizontal: "center" }}
                autoHideDuration={2000}
                onClose={() => setOpen(false)}
            >
                <Alert onClose={() => setOpen(false)} severity="warning" sx={{ width: '100%' }}>
                    Already have a highlight!
                </Alert>
            </Snackbar>
            {loading ?
                <div style={styles.loader}>
                    <CircularProgress />
                </div> : (
                    <>
                        <div className="skilltab-action-header">
                            <div>
                                <IconButton
                                    style={{ padding: 0 }}
                                    className="skilltab-highlight-button"
                                    onClick={() => saveHighlight()}>
                                    <img src={StarButton} alt="icon" width={70} />CREATE HIGHLIGHT
                                </IconButton>
                            </div>
                            <div className="skilltab-action-header-player"><p>PLAYER</p></div>
                            <p>TEAM</p>
                        </div>
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
                                                <img src={PlayButton} alt="play button" width="40" />
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