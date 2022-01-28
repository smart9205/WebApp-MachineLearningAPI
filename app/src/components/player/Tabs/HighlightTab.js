import React, { useEffect, useState, useContext } from 'react';
import { Table, ProgressBar } from 'react-bootstrap'
import {
    IconButton,
    CircularProgress
} from '@mui/material';
import ShareIcon from '@mui/icons-material/Share';
import gameService from '../../../services/game.service';
import { TEAM_ICON_DEFAULT } from '../../../common/staticData';
import { PlayerContext } from '../index';
import PlayButton from "../../../assets/Play_button.png"
const styles = {
    loader: {
        position: 'fixed',
        left: '0px',
        top: '0px',
        width: '100%',
        height: '100%',
        zIndex: 9999,
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
    },
}

export default function HighlightTab({ playTags }) {
    const { context } = useContext(PlayerContext)
    const playerId = context.player.id
    const update_cnt = context.update_cnt
    const [rows, setRows] = useState([])
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        setLoading(true)
        gameService.getAllHighlightByPlayerId(playerId).then((res) => {
            console.log("highlight res", res)
            setRows(res)
            setLoading(false)
        }).catch((e) => setLoading(false))
    }, [playerId, update_cnt])

    return (<>
        {loading &&
            <div style={styles.loader}>
                <CircularProgress />
            </div>}
        <Table responsive="sm" striped borderless size="sm" className='text-uppercase text-white highlight-table' >
            <thead>
                <th className='text-center'>Game</th>
                <th className='text-center'>Date</th>
                <th className='text-center'>Status</th>
            </thead>
            <tbody className='text-center'>
                {rows.map((row, i) => (
                    <tr key={i}>
                        <td><img width={50} src={row.game_image?.length > 0 ? row.game_image : TEAM_ICON_DEFAULT} alt='Team' /></td>
                        <td><span>{row.date.slice(0, 10)}</span></td>
                        <td>
                            <ProgressBar
                                animated
                                variant={row.status === 3 ? "success" : row.status === 2 ? "warning" : "danger"}
                                now={100 / 3 * row.status}
                            />

                            {/* <ProgressBar
                                height={20}
                                filledBackground={`linear-gradient(to right, 
                                ${row.status === 1 ? "rgb(255 151 151), rgb(255 0 0)" :
                                        row.status === 2 ? "#fefb72, #f0bb31" :
                                            row.status === 3 ? "#98ffae, #00851e" : "#98ffae, #00851e"
                                    })`}
                                percent={100 / 3 * row.status}
                            /> */}
                        </td>
                        <td>
                            <IconButton
                                style={{ padding: 0 }}
                                className="skilltab-play-button"
                                onClick={() => { playTags(row.tags) }}>
                                <img src={PlayButton} alt="icon" width={40} />
                            </IconButton>
                        </td>
                        <td>
                            <IconButton sx={{ color: "white" }}>
                                <ShareIcon />
                            </IconButton>
                        </td>
                    </tr>
                ))}
            </tbody>
        </Table>
    </>)
}