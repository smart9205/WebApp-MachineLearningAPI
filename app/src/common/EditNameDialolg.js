import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { useTranslation } from "react-i18next";

export default function EditNameDialog({ open, name, setName, handleEditClose }) {
    const { t } = useTranslation();
    return (
        <Dialog open={open} onClose={e => handleEditClose("")}>
            <DialogTitle>{t("Edit")}</DialogTitle>
            <DialogContent>
                <TextField
                    label={t("Name")}
                    fullWidth
                    variant="outlined"
                    autoFocus
                    value={name}
                    onChange={e => setName(e.target.value)}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={e => handleEditClose("")}>{t("Cancel")}</Button>
                <Button onClick={e => handleEditClose(name)}>{t("Confirm")}</Button>
            </DialogActions>
        </Dialog>
    )
}
