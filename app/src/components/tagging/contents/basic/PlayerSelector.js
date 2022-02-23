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
    posList = [],
    editable = true,
    selected = null,
    onSelect
}) {

    const [loading, setLoading] = React.useState(false)

    const update = (data) => {
        setLoading(true)
        gameService.updatePlayer(data).then(res => {
            setLoading(false)
        }).catch(() => {
            setLoading(false)
        })
    }

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