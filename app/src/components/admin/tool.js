import { Box, Button, FormControl, TextField } from '@mui/material';
import React, { useState } from 'react';

import '../newcoach/coach_style.css';

var bcrypt = require('bcryptjs');

const AdminTool = () => {
    const [originPass, setOriginPass] = useState('');
    const [encrypted, setEncrypted] = useState('');

    const handleEncrypt = () => {
        setEncrypted(bcrypt.hashSync(originPass, 8));
    };

    return (
        <Box sx={{ width: '100%', padding: '24px', display: 'flex', alignItems: 'center', gap: '24px' }}>
            <FormControl sx={{ gap: '4px' }}>
                <p className="normal-text" style={{ color: 'white' }}>
                    Origin Password
                </p>
                <TextField
                    value={originPass}
                    label=""
                    inputProps={{ 'aria-label': 'Without label' }}
                    variant="outlined"
                    placeholder="Write password to encrypt here"
                    onChange={(e) => setOriginPass(e.target.value)}
                    sx={{ borderRadius: '10px', height: '48px', width: '400px', '& legend': { display: 'none' }, '& fieldset': { top: 0 } }}
                />
            </FormControl>
            <Button variant="outlined" onClick={() => handleEncrypt()}>{`>>`}</Button>
            <FormControl sx={{ gap: '4px' }}>
                <p className="normal-text" style={{ color: 'white' }}>
                    Encrypted Password
                </p>
                <TextField
                    value={encrypted}
                    label=""
                    inputProps={{ 'aria-label': 'Without label' }}
                    variant="outlined"
                    placeholder="Encrypted password"
                    sx={{ borderRadius: '10px', height: '48px', width: '500px', '& legend': { display: 'none' }, '& fieldset': { top: 0 } }}
                />
            </FormControl>
        </Box>
    );
};

export default AdminTool;
