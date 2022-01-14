import React, { useEffect, useContext } from 'react';
import Box from '@mui/material/Box';
import GameService from '../../../services/game.service';
import { PlayerContext } from '../index';
export default function SkillTab() {

    const { context } = useContext(PlayerContext)
    const teamId = context.game.team_id
    const gameId = context.game.game_id
    useEffect(() => {
        GameService.getAllPlayerTagsByTeam(teamId, gameId).then((res) => {
            console.log("All Player Tag Results", res)
            // setTagList(res)
        })
    }, [teamId, gameId])

    return (
        <Box>
            Skill tab
        </Box>
    )
}