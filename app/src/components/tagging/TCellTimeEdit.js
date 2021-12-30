import * as React from 'react';
import {
    TableCell,
    Input,
} from '@mui/material';
import { IMaskInput } from 'react-imask';

const TextMaskCustom = React.forwardRef(function TextMaskCustom(props, ref) {
    const { onChange, ...other } = props;
    return (
      <IMaskInput
        {...other}
        mask="00:00:00"
        definitions={{
          '#': /[1-9]/,
        }}
        inputRef={ref}
        onAccept={(value) => onChange({ target: { name: props.name, value } })}
        overwrite
      />
    );
  });

export default function TCellEdit({ value, update }) {

    const [editable, setEditable] = React.useState(false)

    const [temp, setTemp] = React.useState(value)
      
    
    const handleChange = (event) => {
        setTemp(event.target.value)
    }

    const updateValue = () => {
        setEditable(false)
        console.log("TIME STAMP", temp)
        update(temp)
    }

    return (
        <TableCell
            align="center"
            onClick={() => setEditable(true)}
        >
            {editable ?
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
                            updateValue()
                        }
                    }}
                    onChange={handleChange}
                    inputComponent={TextMaskCustom}
                />
                : <>{value}</>
            }
        </TableCell>
    );
}
