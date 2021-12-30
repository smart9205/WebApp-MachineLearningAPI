import * as React from 'react';
import {
    TableCell,
    Input,
} from '@mui/material';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import TimePicker from '@mui/lab/TimePicker';

export default function TCellEdit({ value }) {

    const [editable, setEditable] = React.useState(false)

    const [temp, setTemp] = React.useState("")

    const cellClicked = () => {
        setEditable(true)
    }

    const updateValue = () => {
        setEditable(false)
        // getValue(temp)
    }

    return (
        <TableCell
            align="center"
            onClick={() => cellClicked()}
        >
            {editable ?
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <TimePicker
                        ampm={false}
                        openTo="hours"
                        views={['hours', 'minutes', 'seconds']}
                        inputFormat="HH:mm:ss"
                        mask="__:__:__"
                        label="With seconds"
                        value={temp}
                        onChange={(newValue) => {
                            setTemp(newValue);
                        }}

                        renderInput={(params) =>
                            <Input
                                {...params}
                                autoFocus
                                sx={{ maxWidth: 65, fontSize: 14 }}
                                size="small"
                                onBlur={() => updateValue()}
                                onKeyPress={(ev) => {
                                    if (ev.key === 'Enter') {
                                        ev.preventDefault();
                                        updateValue()
                                    }
                                }}
                            />
                        }
                    />
                </LocalizationProvider>
                : <>{value}</>
            }
        </TableCell>
    );
}
