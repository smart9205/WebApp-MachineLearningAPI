import React from 'react';

import SettingsIcon from '@mui/icons-material/SettingsOutlined';
import GamesIcon from '@mui/icons-material/SportsEsportsOutlined';
import ReportsIcon from '@mui/icons-material/DescriptionOutlined';
import DashboardIcon from '@mui/icons-material/DashboardOutlined';
import TeamsIcon from '@mui/icons-material/GroupsOutlined';
import PlayersIcon from '@mui/icons-material/PersonOutlineOutlined';
import EditsIcon from '@mui/icons-material/DriveFileRenameOutlineOutlined';
import LeadersIcon from '@mui/icons-material/PeopleAltOutlined';
import TheatersIcon from '@mui/icons-material/Theaters';
import CheckIcon from '@mui/icons-material/Check';

export const menuData = [
    {
        id: 'dashboard',
        path: '/new_coach/dashboard',
        icon: <DashboardIcon />,
        title: 'Dashboard'
    },
    {
        id: 'leaders',
        path: '/new_coach/leaders',
        icon: <LeadersIcon />,
        title: 'Leaders'
    },
    {
        id: 'teams',
        path: '/new_coach/teams',
        icon: <TeamsIcon />,
        title: 'Teams'
    },
    {
        id: 'opponents',
        path: '/new_coach/opponents',
        icon: <TeamsIcon />,
        title: 'Opponents'
    },
    {
        id: 'games',
        path: '/new_coach/games',
        icon: <GamesIcon />,
        title: 'Games'
    },
    {
        id: 'edits',
        path: '/new_coach/edits',
        icon: <EditsIcon />,
        title: 'My Edits'
    },
    {
        id: 'video',
        path: '/new_coach/video_cutter',
        icon: <TheatersIcon />,
        title: 'Video Cutter'
    },

    {
        id: 'players',
        path: '/new_coach/players',
        icon: <PlayersIcon />,
        title: 'Players'
    },
    {
        id: 'settings',
        path: '/new_coach/settings',
        icon: <SettingsIcon />,
        title: 'Settings'
    },
    {
        id: 'corrections',
        path: '/new_coach/corrections',
        icon: <CheckIcon />,
        title: 'Corrections'
    }
];
