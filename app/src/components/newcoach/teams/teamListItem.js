import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography } from '@mui/material';

import PlayersIcon from '@mui/icons-material/PersonOutlineOutlined';
import SortIcon from '@mui/icons-material/SortOutlined';

import { TEAM_ICON_DEFAULT } from '../../../common/staticData';
import TeamEditDialog from './teamEditDialog';

const TeamListItem = ({ row, isHover, t }) => {
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);

    const handleChangePath = (teamId, seasonId, leagueId) => () => {
        navigate(`/new_coach/teams/${btoa(`${teamId}|${seasonId}|${leagueId}`)}`);
    };

    const handleCloseDialog = () => {
        setOpen(false);
    };

    return (
        <Box
            sx={{
                padding: '12px 18px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '8px',
                backgroundColor: 'white',
                borderRadius: '10px',
                cursor: 'pointer',
                transition: 'box-shadow 0.3s ease',
                minWidth: '850px',
                fontWeight: 500,
                height: '70px',
                width: '100%',
                boxShadow: isHover ? '0px 4px 16px rgba(0, 0, 0, 0.1)' : 'none'
            }}
        >
            <Box sx={{ display: 'flex', alignItems: 'center', flex: 22 }} onClick={handleChangePath(row.team_id, row.season_id, row.league_id)}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 1 }}>
                    <img style={{ height: '48px' }} src={row.team_image ? row.team_image : TEAM_ICON_DEFAULT} alt="Team Logo" />
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', flex: 4, padding: '0 8px' }}>
                    <p className="normal-text-strong">{row.team_name}</p>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', flex: 3, padding: '0 8px' }}>
                    <p className="normal-text">{row.league_name}</p>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', flex: 2, padding: '0 8px' }}>
                    <p className="normal-text">{row.season_name}</p>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', textTransform: 'uppercase', flexDirection: 'column', gap: '4px', flex: 2, padding: '0 8px' }}>
                    <p className="normal-text">{t('Games')}</p>
                    <p className="normal-text">{row.total_game_played}</p>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', textTransform: 'uppercase', flexDirection: 'column', gap: '4px', flex: 2, padding: '0 8px' }}>
                    <p className="normal-text">{t('Won')}</p>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#52B030', borderRadius: '12px', width: '24px', height: '24px' }}>
                            <p className="normal-text-white">W</p>
                        </Box>
                        <p className="normal-text-strong">{row.won}</p>
                    </Box>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '4px', flex: 2, padding: '0 8px' }}>
                    <p className="normal-text">{t('DRAW')}</p>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#A4AAB0', borderRadius: '12px', width: '24px', height: '24px' }}>
                            <p className="normal-text-white">D</p>
                        </Box>
                        <p className="normal-text-strong">{row.draw}</p>
                    </Box>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '4px', flex: 2, padding: '0 8px' }}>
                    <p className="normal-text">{t('LOSE')}</p>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#C1272D', borderRadius: '12px', width: '24px', height: '24px' }}>
                            <p className="normal-text-white">L</p>
                        </Box>
                        <p className="normal-text-strong">{row.lost}</p>
                    </Box>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', textTransform: 'uppercase', flexDirection: 'column', gap: '4px', flex: 2, padding: '0 8px' }}>
                    <p className="normal-text">{t('Goals')}</p>
                    <p className="normal-text-strong">{row.goals}</p>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px', 'svg path': { fill: '#FE5E00' }, marginLeft: '8px', flex: 2 }}>
                    <PlayersIcon />
                    <Box sx={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', gap: '4px' }}>
                        <p className="normal-text">{t('Players')}</p>
                        <p className="normal-text">{row.player_count}</p>
                    </Box>
                </Box>
            </Box>
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    flex: 0.5,
                    'svg path': { fill: '#A5A5A8' },
                    '&:hover': { 'svg path': { fill: '#0A7304' } }
                }}
                onClick={() => setOpen(true)}
            >
                <SortIcon />
            </Box>
            <TeamEditDialog open={open} t={t} onClose={handleCloseDialog} team={row} />
        </Box>
    );
};

export default TeamListItem;
