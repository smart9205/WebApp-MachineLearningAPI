import React from 'react'
import {
    Autocomplete,
    TextField
} from '@mui/material'
export default function ObjectAutocomplete({ label, list, onResult, value, ...rest }) {
    return (
        <Autocomplete
            {...rest}
            options={list}
            value={value}
            isOptionEqualToValue={(option, value) => option && option.name}
            getOptionLabel={
                (option) => !option.name ? "" : option.name
            }
            renderOption={(props, option) => {
                return (
                    <li {...props} key={option.id}>
                        {option.name}
                    </li>
                );
            }}
            renderInput={(params) => <TextField {...params} label={label} sx={{ my: 1 }} />}
            onChange={(event, newValue) => {
                onResult(newValue);
            }}
        />
    )
}