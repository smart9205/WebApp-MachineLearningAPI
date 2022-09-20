import * as React from 'react';
import { TableCell, Input } from '@mui/material';

export default function TCellNameEdit({ value, update, ...other }) {
    const [editable, setEditable] = React.useState(false);

    const [temp, setTemp] = React.useState(value);

    const updateValue = () => {
        update(temp);
        setEditable(false);
    };

    return (
        <TableCell onDoubleClick={() => setEditable(true)} style={{ height: '36px' }} {...other}>
            {editable ? (
                <Input
                    value={temp}
                    autoFocus
                    sx={{ fontSize: 14, width: '100%' }}
                    size="small"
                    onBlur={() => updateValue()}
                    onKeyPress={(ev) => {
                        if (ev.key === 'Enter') {
                            ev.preventDefault();
                            updateValue();
                        }
                    }}
                    onChange={(e) => setTemp(e.target.value)}
                />
            ) : (
                <>{value}</>
            )}
        </TableCell>
    );
}
