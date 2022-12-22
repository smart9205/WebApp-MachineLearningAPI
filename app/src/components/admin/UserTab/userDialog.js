import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';
import React, { useEffect, useState } from 'react';

import UploadButton from '../../newcoach/components/uploadButton';
import { USER_IMAGE_DEFAULT } from '../../../common/staticData';
import GameService from '../../../services/game.service';

const UserDialog = ({ open, onClose, mode, user, refresh }) => {
    const [userLogo, setUserLogo] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [country, setCountry] = useState('');

    const saveChanges = () => {
        if (mode === 'Add') {
            GameService.addNewUser({ first_name: firstName, last_name: lastName, email: email, phone: phone, country: country, logo: userLogo }).then((res) => {
                onClose();
                refresh((r) => !r);
            });
        } else {
            GameService.updateUser({ first_name: firstName, last_name: lastName, email: email, phone: phone, country: country, logo: userLogo, userId: user.id }).then((res) => {
                onClose();
                refresh((r) => !r);
            });
        }
    };

    useEffect(() => {
        if (mode === 'Add') {
            setUserLogo('');
            setFirstName('');
            setLastName('');
            setEmail('');
            setPhone('');
            setCountry('');
        } else {
            setUserLogo(user.user_image ?? '');
            setFirstName(user.first_name ?? '');
            setLastName(user.last_name ?? '');
            setEmail(user.email ?? '');
            setPhone(user.phone_number ?? '');
            setCountry(user.country ?? '');
        }
    }, [open, mode, user]);

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>{`${mode} User`}</DialogTitle>
            <DialogContent dividers style={{ display: 'flex', gap: '16px' }}>
                <UploadButton
                    class_name="admin-user-view"
                    id_name="admin-user-logo"
                    dirName={process.env.REACT_APP_DIR_USER}
                    img={userLogo}
                    onURL={(url) => setUserLogo(url)}
                    defaultImage={USER_IMAGE_DEFAULT}
                />
                <div style={{ display: 'flex', flexDirection: 'column', gap: '48px' }}>
                    <TextField
                        value={firstName}
                        label="First Name"
                        variant="outlined"
                        autoFocus
                        onChange={(e) => setFirstName(e.target.value)}
                        sx={{ borderRadius: '10px', height: '48px', width: '100%', '& .MuiOutlinedInput-root': { borderRadius: '10px' } }}
                    />
                    <TextField
                        value={email}
                        label="Email Address"
                        variant="outlined"
                        onChange={(e) => setEmail(e.target.value)}
                        sx={{ borderRadius: '10px', height: '48px', width: '100%', '& .MuiOutlinedInput-root': { borderRadius: '10px' } }}
                    />
                    <TextField
                        value={country}
                        label="Country"
                        variant="outlined"
                        onChange={(e) => setCountry(e.target.value)}
                        sx={{ borderRadius: '10px', height: '48px', width: '100%', '& .MuiOutlinedInput-root': { borderRadius: '10px' } }}
                    />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '48px' }}>
                    <TextField
                        value={lastName}
                        label="Last Name"
                        variant="outlined"
                        onChange={(e) => setLastName(e.target.value)}
                        sx={{ borderRadius: '10px', height: '48px', width: '100%', '& .MuiOutlinedInput-root': { borderRadius: '10px' } }}
                    />
                    <TextField
                        value={phone}
                        label="Phone Number"
                        variant="outlined"
                        onChange={(e) => setPhone(e.target.value)}
                        sx={{ borderRadius: '10px', height: '48px', width: '100%', '& .MuiOutlinedInput-root': { borderRadius: '10px' } }}
                    />
                </div>
            </DialogContent>
            <DialogActions>
                <Button variant="outlined" onClick={onClose}>
                    Cancel
                </Button>
                <Button variant="outlined" disabled={firstName === '' || lastName === '' || email === '' || phone === '' || country === ''} onClick={() => saveChanges()}>
                    {mode === 'Add' ? 'Add' : 'Update'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default UserDialog;
