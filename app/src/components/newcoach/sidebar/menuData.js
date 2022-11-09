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
import SportsSoccerIcon from '@mui/icons-material/SportsSoccer';
import PanToolIcon from '@mui/icons-material/PanTool';
import PersonalVideoIcon from '@mui/icons-material/PersonalVideo';
import GroupIcon from '@mui/icons-material/Group';

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
        id: 'games',
        path: '/new_coach/games',
        icon: <SportsSoccerIcon />,
        title: 'Games'
    },
    {
        id: 'players',
        path: '/new_coach/players',
        icon: <GroupIcon />,
        title: 'Players'
    },
    {
        id: 'goalkeepers',
        path: '/new_coach/goalkeepers',
        icon: <PanToolIcon />,
        title: 'Goalkeepers'
    },
    {
        id: 'edits',
        path: '/new_coach/edits',
        icon: <PersonalVideoIcon />,
        title: 'My Edits'
    },
    {
        id: 'video',
        path: '/new_coach/video_cutter',
        icon: <TheatersIcon />,
        title: 'Video Cutter'
    },
    {
        id: 'opponents',
        path: '/new_coach/opponents',
        icon: <SportsSoccerIcon />,
        title: 'Opponents'
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
