import React, { useEffect, useState } from 'react'
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import gameService from './../../services/game.service';

import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';

const Modalstyle = {
    position: 'absolute',
    top: '40%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    height: '70%',
    maxWidth: '90%',
    maxHeight: '90%'
};

const PlayerSelector = ({ playerList, currPlayerId, tagList, modalOpen, handleClose, setModalOpen, setPlay, curIdx }) => {

    const onSelect = (player) => {

        gameService.addCorrectionRequest(currPlayerId, player.player_id, tagList[curIdx].id)
            .then((res) => {
                setModalOpen(false)
                setPlay(true)
            })
    }

    const sortByJerseyNumber = (x, y) => {
        return x.jersey_number - y.jersey_number;
    };

    let filteredPlayerList = playerList.sort(sortByJerseyNumber)

    return (

        <Modal
            open={modalOpen}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={Modalstyle}>

                <TableContainer component={Paper} sx={{ height: '22rem', backgroundColor: '#343434', p: '5px', borderRadius: '6px' }}>
                    <Table aria-label="a dense table">
                        <TableBody>
                            {filteredPlayerList.map((player, i) => (
                                <TableRow
                                    key={i}
                                    onClick={() => onSelect(player)}
                                    sx={{ border: 0, height: 40, "&:hover": { backgroundColor: '#000' } }}
                                >
                                    <TableCell sx={{ width: '120px', color: 'white', cursor: 'pointer' }} align="left"># {player.jersey_number}     {player.f_name} {player.l_name}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>

            </Box>
        </Modal>

    )
}

export default PlayerSelector