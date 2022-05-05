import * as React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContentText from '@mui/material/DialogContentText';
import Button from '@mui/material/Button';
import { useTranslation } from "react-i18next";

export default function DeleteConfirmDialog({ open, handleDeleteClose }) {
    const { t } = useTranslation();
    return (
        <Dialog open={open} onClose={e => handleDeleteClose(false)}>
            <DialogTitle>{t("confirmMsg")}</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    {t("deleteConformMsg")}
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={e => handleDeleteClose(false)}>{t("Cancel")}</Button>
                <Button onClick={e => handleDeleteClose(true)}>{t("Delete")}</Button>
            </DialogActions>
        </Dialog>
    )
}
