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
        path: '/new_coach/dashboard',
        icon: <DashboardIcon />,
        title: 'Dashboard'
    },
    {
        path: '/new_coach/leaders',
        icon: <LeadersIcon />,
        title: 'Leaders'
    },
    {
        path: '/new_coach/teams',
        icon: <TeamsIcon />,
        title: 'Teams'
    },
    {
        path: '/new_coach/opponents',
        icon: <TeamsIcon />,
        title: 'Opponents'
    },
    {
        path: '/new_coach/games',
        icon: <GamesIcon />,
        title: 'Games'
    },
    {
        path: '/new_coach/edits',
        icon: <EditsIcon />,
        title: 'My Edits'
    },
    {
        path: '/new_coach/video_cutter',
        icon: <TheatersIcon />,
        title: 'Video Cutter'
    },
    {
        path: '/new_coach/reports',
        icon: <ReportsIcon />,
        title: 'Reports'
    },
    {
        path: '/new_coach/players',
        icon: <PlayersIcon />,
        title: 'Players'
    },
    {
        path: '/new_coach/settings',
        icon: <SettingsIcon />,
        title: 'Settings'
    },
    {
        path: '/new_coach/corrections',
        icon: <CheckIcon />,
        title: 'Corrections'
    }
];
