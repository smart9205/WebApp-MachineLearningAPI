import React, { useEffect, useContext, useState } from 'react';
import { Box, Paper, CircularProgress } from '@mui/material';
import { styled } from '@mui/material/styles';
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';
import GameService from '../../../services/game.service';
import { PlayerContext } from '../index';
import { filterAllTags, getPercent } from '../../../common/utilities';

const styles = {
    loader: {
        position: 'absolute',
        left: '0px',
        top: '0px',
        width: '100%',
        height: '100%',
        zIndex: 9999,
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
    },
    action: {
        display: 'flex',
        justifyContent: 'space-around',
    }
};
const BorderLinearProgress = styled(LinearProgress)(({ theme, value }) => ({
    height: 10,
    borderRadius: 5,
    [`&.${linearProgressClasses.colorPrimary}`]: {
        backgroundColor: theme.palette.grey[theme.palette.mode === 'light' ? 200 : 800],
    },
    [`& .${linearProgressClasses.bar}`]: {
        borderRadius: 5,
        backgroundColor: value > 50 ? "green" : value > 30 ? "#1a90ff" : "yellow"
    },
}));

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
            console.log(filterAllTags(res, playerId))
            setLoading(false)
        })
    }, [teamId, gameId, playerId])

    return (
        <>{loading ?
            <div style={styles.loader}>
                <CircularProgress />
            </div> :
            <Box>
                {skills.map((skill, i) => (
                    <Paper
                        key={i}
                        sx={{ my: 1, p: 0.5 }}
                        onClick={() => { !!skill.success.length && playTags(skill.success) }}
                    >
                        <div style={{ textAlign: 'center', fontWeight: 'bold' }}>{skill.action}</div>
                        <div style={styles.action}>
                            <label>{skill.success.length}</label>
                            <label>{skill.total}</label>
                        </div>
                        <BorderLinearProgress variant="determinate" value={getPercent(skill.success.length, skill.total)} />
                    </Paper>
                ))}
            </Box>
        }</>

    )
}