import React, { useEffect, useState, useContext } from 'react';
import { Table, ProgressBar } from 'react-bootstrap'
import {
    Snackbar,
    Alert,
    IconButton,
    CircularProgress
} from '@mui/material';
import ShareIcon from '@mui/icons-material/Share';
import gameService from '../../../services/game.service';
import VIDEO_ICON from '../../../assets/video_icon.jpg';
import { PlayerContext } from '../index';
import PlayButton from "../../../assets/Play_button.png"
import { CopyToClipboard } from 'react-copy-to-clipboard';

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
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        setLoading(true)
        gameService.getAllHighlightByPlayerId(playerId).then((res) => {
            setRows(res)
            setLoading(false)
        }).catch((e) => setLoading(false))
    }, [playerId, update_cnt])

    return (<>
        {loading &&
            <div style={styles.loader}>
                <CircularProgress />
            </div>}
        <Snackbar
            open={open}
            anchorOrigin={{ vertical: "top", horizontal: "center" }}
            autoHideDuration={2000}
            onClose={() => setOpen(false)}
        >
            <Alert onClose={() => setOpen(false)} severity="success" sx={{ width: '100%' }}>
                Video URL copied successfully!
            </Alert>
        </Snackbar>
        <Table responsive="sm" striped borderless size="sm" className='text-uppercase text-white highlight-table' >
            <thead>
                <tr>
                    <th className='text-center'>Game</th>
                    <th className='text-center'>Date</th>
                    <th className='text-center'>Status</th>
                </tr>
            </thead>
            <tbody className='text-center'>
                {rows.map((row, i) => (
                    <tr key={i}>
                        <td>
                            <div
                                className='gameImage'
                                style={{ backgroundImage: `url(${row?.game_image?.length > 0 ? row.game_image : VIDEO_ICON})`, width: 50, height: 35 }}>
                            </div>
                        </td>
                        <td><span>{row.date.slice(0, 10)}</span></td>
                        <td className='highlight-progressbar'>
                            {row.status === 3 ? <ProgressBar animated variant="success" now={100} label="Ready" /> :
                                row.status === 2 ? <ProgressBar animated variant="warning" now={70} label="Processing" /> :
                                    row.status === 1 ? <ProgressBar animated variant="danger" now={50} label="Pending" /> : <></>
                            }
                        </td>
                        <td style={{ padding: 0 }}>
                            <IconButton
                                style={{ padding: 0 }}
                                className="skilltab-play-button"
                                onClick={() => { playTags(row.tags) }}>
                                <img src={PlayButton} alt="icon" width={40} />
                            </IconButton>
                        </td>
                        <td style={{ padding: 0 }}>
                            <CopyToClipboard
                                text={process.env.REACT_APP_S3_URI + "/" + process.env.REACT_APP_DIR_HIGHLIGHT + "/" + row.highlight_video_url}
                                onCopy={() => setOpen(true)}>
                                <IconButton sx={{ color: "white", p: 0 }} disabled={row.status !== 3}>
                                    <ShareIcon />
                                </IconButton>
                            </CopyToClipboard>

                        </td>
                    </tr>
                ))}
            </tbody>
        </Table>
    </>)
}