import React, { useEffect, useState } from "react";
import { Box, Button, Grid, Typography } from "@mui/material";
import gameService from "../../../../services/game.service";

const PlayersTab = ({ gameIds }) => {
    const [curTab, setCurTab] = useState('G')
    const [players, setPlayers] = useState([])

    useEffect(() => {
        gameService.getPlayerActions(gameIds ?? "0").then(res => {
            setPlayers(res)
            console.log('res', res)
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


            {players.filter((p) => Number(p[curTab]) > 0).sort((a, b) => Number(b[curTab]) - Number(a[curTab])).map((player, i) =>
                <Box sx={{ display: "flex", justifyContent: "space-between", m: 1 }}>
                    {i === 0 ?
                        <>
                            <img src={player.image} width={100} />
                            <Box sx={{ width: "100%", display: "flex", flexDirection: "column", justifyContent: "space-evenly", alignItems: "center" }}>
                                <Typography>{player.f_name}{' '}{player.l_name}</Typography>
                                <Typography sx={{ backgroundColor: "red", color: "white", px: 1 }}>{player[curTab]}</Typography>
                            </Box>
                        </> :
                        <>
                            <Typography>{player.jersey_number}</Typography>
                            <Typography>{player.f_name}{' '}{player.l_name}</Typography>
                            <Typography>{player[curTab]}</Typography>
                        </>}
                </Box>
            )}
        </Box>
    );
}

export default PlayersTab;