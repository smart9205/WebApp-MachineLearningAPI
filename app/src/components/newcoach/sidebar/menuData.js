import React from "react";

import SettingsIcon from "@mui/icons-material/SettingsOutlined";
import GamesIcon from "@mui/icons-material/SportsEsportsOutlined";
import ReporstIcon from "@mui/icons-material/DescriptionOutlined";
import DashboardIcon from "@mui/icons-material/DashboardOutlined";
import TeamsIcon from "@mui/icons-material/GroupsOutlined";
import PlayersIcon from "@mui/icons-material/PersonOutlineOutlined";

export const menuData = [
    {
        path: "/new_coach/dashboard",
        icon: <DashboardIcon />,
        title: "Dashboard",
    },
    {
        path: "/new_coach/games",
        icon: <GamesIcon />,
        title: "Games",
    },
    {
        path: "/new_coach/reports",
        icon: <ReporstIcon />,
        title: "Reports",
    },
    {
        path: "/new_coach/teams",
        icon: <TeamsIcon />,
        title: "Teams",
    },
    {
        path: "/new_coach/players",
        icon: <PlayersIcon />,
        title: "Players",
    },
    {
        path: "/new_coach/",
        icon: <SettingsIcon />,
        title: "Settings",
    },
];
