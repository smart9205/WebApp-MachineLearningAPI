import * as React from 'react';
import {
    Select,
    MenuItem,
    TableCell,
    Input,
} from '@mui/material';

export default function TCellPositionEdit({ value, rows, update }) {

    const [editable, setEditable] = React.useState(false)

    const [temp, setTemp] = React.useState(value?.id)

    const updateValue = (v) => {
        setEditable(false)
        if (v === undefined || v === value?.id) return
        setTemp(v)
        const up = rows.find(r => r.id === v)
        update(up)
    }

    return (
        <TableCell
            align="left"
            onClick={() => setEditable(true)}
            sx={{ width: '120px' }}
        >
            {editable ?
                <Select
                    sx={{ fontSize: 14 }}
                    value={temp}
                    onChange={e => updateValue(e.target.value)}
                    input={<Input autoFocus onBlur={() => updateValue()} />}
                >
                    {rows && rows.map(row =>
                        <MenuItem sx={{ fontSize: 14 }} key={row.id} value={row.id}>
                            {row.name}
                        </MenuItem>
                    )}
                </Select>
                : <>{value?.name}</>
            }
        </TableCell>
    );
}
