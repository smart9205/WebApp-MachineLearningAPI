import * as React from 'react';
import { TableCell, Input } from '@mui/material';
import { IMaskInput } from 'react-imask';

const TextMaskCustom = React.forwardRef(function TextMaskCustom(props, ref) {
    const { onChange, ...other } = props;
    return (
        <IMaskInput
            {...other}
            mask="00:00:00"
            definitions={{
                '#': /[1-9]/
            }}
            inputRef={ref}
            onAccept={(value) => onChange({ target: { name: props.name, value } })}
            overwrite
        />
    );
});

export default function TCellTimeEdit({ value, update, start, end, ...other }) {
    const [editable, setEditable] = React.useState(false);

    const [temp, setTemp] = React.useState(value);

    const updateValue = () => {
        if ((end && end.length > 0 && end < temp) || (start && start.length > 0 && start > temp) || temp === value) {
            setTemp(value);
            setEditable(false);
            return;
        }
        update(temp);
        setEditable(false);
    };

    return (
        <TableCell align="center" onDoubleClick={() => setEditable(true)} {...other}>
            {editable ? (
                <Input
                    value={temp}
                    id="formatted-text-mask-input"
                    autoFocus
                    sx={{ maxWidth: 65, fontSize: 14 }}
                    size="small"
                    onBlur={() => updateValue()}
                    onKeyPress={(ev) => {
                        if (ev.key === 'Enter') {
                            ev.preventDefault();
                            updateValue();
                        }
                    }}
                    onChange={(e) => setTemp(e.target.value)}
                    inputComponent={TextMaskCustom}
                />
            ) : (
                <>{value}</>
            )}
        </TableCell>
    );
}
