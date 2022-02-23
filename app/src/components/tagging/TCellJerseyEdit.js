import * as React from 'react';
import {
    TableCell,
    Input,
} from '@mui/material';

export default function TCellJerseyEdit({ value, update }) {

    const [editable, setEditable] = React.useState(false)

    const [temp, setTemp] = React.useState(value)

    const updateValue = () => {
        update(temp)
        setEditable(false)
    }

    return (
        <TableCell
            sx={{ width: 50 }}
            align="center"
            onClick={() => setEditable(true)}
        >
            {editable ?
                <Input
                    value={temp}
                    autoFocus
                    type='number'
                    sx={{ maxWidth: 50, fontSize: 14 }}
                    size="small"
                    onBlur={() => updateValue()}
                    onKeyPress={(ev) => {
                        if (ev.key === 'Enter') {
                            ev.preventDefault();
                            updateValue()
                        }
                    }}
                    onChange={e => setTemp(e.target.value)}
                />
                : <>{value}</>
            }
        </TableCell>
    );
}
