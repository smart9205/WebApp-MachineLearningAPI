import * as React from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import { Checkbox } from '@mui/material';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import TCellJerseyEdit from '../../TCellJerseyEdit';
import TCellPositionEdit from '../../TCellPositionEdit';
import gameService from '../../../../services/game.service';
import AddMainPlayers from '../AddmainPlayer';
import Modal from '@mui/material/Modal';
import { Button } from '@mui/material';

const style = {
    position: 'absolute',
    top: '45%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    p: 4
};

const SubBox = styled(Box)`
    margin: 6px;
    padding: 6px 2px 2px 2px;
    background-color: #343434;
    border-radius: 6px;
    & .MuiPaper-root {
        padding: 6px;
        border-radius: 6px;
        max-height: 90vh;
        overflow-y: auto;
    }
    & .title {
        text-align: center;
    }
`;

export default function PlayerSelector({ title, playerList, game, posList = [], editable = true, selected = null, onSelect, setGamePlayerRefresh }) {
    const [loading, setLoading] = React.useState(false);
    const [addPlayerModalOpen, setAddPlayerModalOpen] = React.useState(false);
    const [playerOpen, setPlayerOpen] = React.useState(false);

    const update = (data) => {
        setLoading(true);
        gameService
            .updatePlayer(data)
            .then((res) => {
                setLoading(false);
            })
            .catch(() => {
                setLoading(false);
            });
    };

    return (
        <SubBox sx={{ marginTop: '5rem', height: '100%' }}>
            <div className="title">{title}</div>
            <TableContainer component={Paper} sx={{ height: '600px' }}>
                <Table aria-label="a dense table">
                    <TableBody>
                        {playerList.map((player, i) =>
                            !editable && !player.checked ? (
                                <></>
                            ) : (
                                <TableRow key={i} onClick={() => onSelect(player)} sx={{ border: 0, height: 35, background: selected && selected.id === player.id ? 'darkblue' : '' }}>
                                    {editable && (
                                        <TableCell className="player-select-checkbox">
                                            <CustomCheck defaultValue={player.checked} onCheck={(v) => (player.checked = v)} />
                                        </TableCell>
                                    )}
                                    {editable ? (
                                        <TCellJerseyEdit
                                            value={player.jersey_number}
                                            update={(v) => {
                                                player.jersey_number = v;
                                                update(player);
                                            }}
                                        />
                                    ) : (
                                        <TableCell align="left" width="32px">
                                            #{player.jersey_number}
                                        </TableCell>
                                    )}
                                    <TableCell sx={{ width: '120px' }} align="left">
                                        {player.f_name} {player.l_name}
                                    </TableCell>
                                    {editable ? (
                                        <TCellPositionEdit
                                            rows={posList}
                                            value={{ id: player.position, name: player.position_name }}
                                            update={(v) => {
                                                player.position = v.id;
                                                player.position_name = v.name;
                                                update(player);
                                            }}
                                        />
                                    ) : (
                                        <TableCell align="left">{player.position_name}</TableCell>
                                    )}
                                </TableRow>
                            )
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            {title && (title === 'Home Team' || title === 'Away Team') && (
                <>
                    <div style={{ padding: '0.5rem', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <Button
                            variant="outlined"
                            onClick={() => {
                                setAddPlayerModalOpen(true);
                                setPlayerOpen(true);
                            }}
                        >
                            Add Players
                        </Button>
                    </div>

                    <Modal disableAutoFocus open={addPlayerModalOpen} onClose={() => setAddPlayerModalOpen(false)} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
                        <Box style={style}>
                            <AddMainPlayers
                                open={playerOpen}
                                title={title}
                                game={game}
                                setAddPlayerModalOpen={setAddPlayerModalOpen}
                                setGamePlayerRefresh={setGamePlayerRefresh}
                                onResult={(res) => {
                                    setPlayerOpen(res.open);
                                    if (!!res?.msg) {
                                        // OpenAlert(res.msg, res.result)
                                    }
                                    if (res?.result === 'success') {
                                    }
                                }}
                            />
                        </Box>
                    </Modal>
                </>
            )}
        </SubBox>
    );
}

const CustomCheck = ({ defaultValue, onCheck }) => {
    const [value, setValue] = React.useState(defaultValue);

    const handleCheck = (v) => {
        setValue(v);
        onCheck(v);
    };

    return <Checkbox checked={value} onChange={(e) => handleCheck(e.target.checked)} />;
};
