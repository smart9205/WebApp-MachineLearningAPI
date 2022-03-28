import React, { useState } from "react";
import { Box, Button, Grid } from "@mui/material";

const PlayersTab = ({ gameIds }) => {
    const [curTab, setCurTab] = useState('G')

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


        </Box>
    );
}

export default PlayersTab;