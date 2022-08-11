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
import TCellJerseyEdit from '../../TCellJerseyEdit'
import TCellPositionEdit from '../../TCellPositionEdit'
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
    // boxShadow: 24,
    justifyContent: 'center',
    p: 4,
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

export default function PlayerSelector({
    title,
    playerList,
    homeTeam,
    awayTeam,
    posList = [],
    editable = true,
    selected = null,
    onSelect
}) {

    const [loading, setLoading] = React.useState(false)
    const [modalOpen, setModalOpen] = React.useState(false)
    const [playerOpen, setPlayerOpen] = React.useState(false);

    const [teamPlayer, setTeamPlayer] = React.useState({
        seasonID: 0,
        leagueID: 0,
        homeTeamID: 0,
        awayTeamID: 0,
    })

    let seasonID = 0
    let leagueID = 0
    let homeTeamID = 0
    let awayTeamID = 0

    const update = (data) => {
        setLoading(true)
        gameService.updatePlayer(data).then(res => {
            setLoading(false)
        }).catch(() => {
            setLoading(false)
        })
    }

    homeTeam.map(data => {
        seasonID = data.season_id
        leagueID = data.league_id
        homeTeamID = data.team_id
    })

    awayTeam.map(data => {
        awayTeamID = data.team_id
    })

    React.useEffect(() => {
        setTeamPlayer({ seasonID: seasonID, leagueID: leagueID, homeTeamID: homeTeamID, awayTeamID: awayTeamID })
    }, [seasonID, leagueID, homeTeamID, awayTeamID])

    if (loading) { }
    return (

        <SubBox>
            <div className='title'>{title}</div>
            <TableContainer component={Paper}>
                <Table aria-label="a dense table">
                    <TableBody>
                        {playerList.map((player, i) => (
                            !editable && !player.checked
                                ? <></>
                                : <TableRow
                                    key={i}
                                    onClick={() => onSelect(player)}
                                    sx={{ border: 0, height: 35, background: selected && selected.id === player.id ? 'darkblue' : '' }}
                                >
                                    {editable && <TableCell className="player-select-checkbox">

                                        <CustomCheck defaultValue={player.checked}
                                            onCheck={v => player.checked = v}
                                        />

                                    </TableCell>
                                    }
                                    {editable ?
                                        <TCellJerseyEdit value={player.jersey_number}
                                            update={v => {
                                                player.jersey_number = v
                                                update(player)
                                            }} />
                                        :
                                        <TableCell align="left">#{player.jersey_number}</TableCell>
                                    }
                                    <TableCell align="left">{player.f_name} {player.l_name}</TableCell>
                                    {editable ? <TCellPositionEdit
                                        rows={posList}
                                        value={{ id: player.position, name: player.position_name }}
                                        update={v => {
                                            player.position = v.id
                                            player.position_name = v.name
                                            update(player)
                                        }}
                                    /> : <TableCell align="left">{player.position_name}</TableCell>}
                                </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <div style={{ marginTop: '20px', marginBottom: '10px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Button
                    variant="outlined"
                    onClick={() => {
                        setModalOpen(true)
                        setPlayerOpen(true)
                    }}
                >Add Players</Button>
            </div>

            <Modal
                disableAutoFocus
                open={modalOpen}
                onClose={() => setModalOpen(false)}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box style={style}>
                    <AddMainPlayers
                        open={playerOpen}
                        title={title}
                        teamPlayer={teamPlayer}
                        setTeamPlayer={setTeamPlayer}
                        onResult={(res) => {
                            setPlayerOpen(res.open);
                            if (!!res?.msg) {
                                // OpenAlert(res.msg, res.result)
                            }
                            if (res?.result === "success") {

                            }
                        }}
                    />
                </Box>
            </Modal>

        </SubBox>
    );
}

const CustomCheck = ({ defaultValue, onCheck }) => {
    const [value, setValue] = React.useState(defaultValue)

    const handleCheck = (v) => {
        setValue(v)
        onCheck(v)
    }

    return < Checkbox
        checked={value}
        onChange={(e) => handleCheck(e.target.checked)}
    />
}