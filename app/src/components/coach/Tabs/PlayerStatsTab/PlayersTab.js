import React, { useEffect, useState } from "react";
import { Box, Button, Grid, Typography } from "@mui/material";
import gameService from "../../../../services/game.service";

const PlayersTab = ({ gameIds, teamId }) => {
    const [curTab, setCurTab] = useState('G')
    const [players, setPlayers] = useState([])

    useEffect(() => {
        gameService.getPlayerActions(gameIds ?? "0", teamId).then(res => {
            setPlayers(res)
        })
    }, [gameIds])


    return (
        <Box>
            <Grid container>
                {["G", "SH", "P", "I", "S", "C"].map(type =>
                    <Grid sx={4} md={2}>
                        <Button
                            variant={curTab === type ? "contained" : ""}
                            sx={{ m: 0, p: 0, minWidth: 0, width: "100%" }}
                            onClick={() => setCurTab(type)}
                        >
                            {type}
                        </Button>
                    </Grid>
                )}
            </Grid>

            <Box sx={{ height: "35rem", overflowY: "auto" }}>
                {players.filter((p) => Number(p[curTab]) > 0).sort((a, b) => Number(b[curTab]) - Number(a[curTab])).map((player, i) =>
                    <Box sx={{ display: "flex", justifyContent: "space-between", m: 1 }}>
                        {i === 0 ?
                            <>
                                <img src={player.image} width={100} />
                                <Box sx={{ width: "100%", display: "flex", flexDirection: "column", justifyContent: "space-evenly", alignItems: "center", }}>
                                    <Typography sx={{ fontSize: "0.875rem" }}>
                                        {`#${player.jersey_number} ${player.f_name} ${player.l_name}`}
                                    </Typography>
                                    <Typography sx={{ backgroundColor: "red", color: "white", px: 1, fontSize: "0.8rem" }}>{player[curTab]}</Typography>
                                </Box>
                            </> :
                            <>
                                <Typography sx={{ fontSize: "0.8rem" }}>{i + 1}</Typography>
                                <Typography sx={{ fontSize: "0.8rem" }}>
                                    {`#${player.jersey_number} ${player.f_name} ${player.l_name}`}
                                </Typography>
                                <Typography sx={{ fontSize: "0.8rem" }}>{player[curTab]}</Typography>
                            </>}
                    </Box>
                )}
            </Box>
        </Box>
    );
}

export default PlayersTab;