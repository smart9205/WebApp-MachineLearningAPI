import React, { useEffect, useState, useContext } from 'react';
import { Table, } from 'react-bootstrap'
import {
    CircularProgress
} from '@mui/material';
import gameService from '../../../services/game.service';
import { PlayerContext } from '../index';

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

export default function HighlightTab() {
    const { context } = useContext(PlayerContext)
    const playerId = context.player.id
    const [rows, setRows] = useState([])
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        setLoading(true)
        gameService.getAllHighlightByPlayerId(playerId).then((res) => {
            console.log("highlight res", res)
            setRows(res)
            setLoading(false)
        }).catch((e) => setLoading(false))
    }, [playerId])

    return (
        <Table responsive="sm" striped borderless hover size="sm" className='shots text-uppercase' >
            {loading &&
                <div style={styles.loader}>
                    <CircularProgress />
                </div>
            }
            <thead>
                <th colSpan={3} className='shots-title text-center'>
                    {''}
                </th>
            </thead>
            <tbody className='text-center statistic-table-body'>
                {rows.map((row, i) => (
                    <tr key={i}>
                        <td><p>{row.title}</p></td>
                    </tr>
                ))}
            </tbody>
        </Table>
    )
}