import React, { useState, useCallback, useEffect } from 'react';
import Button from '@mui/material/Button';
import Input from '@mui/material/Input';
import AddIcon from '@mui/icons-material/Add';
import GameTable from './GameTable';
import GameFormDialog from './GameFormDialog';
import gameService from '../../../services/game.service';
import { FormControlLabel, Switch } from '@mui/material';

export default function Game({ t }) {
    const [open, setOpen] = useState(false);
    const [actionType, setActionType] = useState('Add');
    const [gameList, setGameList] = useState([]);
    const [count, setCount] = useState(0);
    const [editData, setEditData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [showDone, setShowDone] = useState(false);

    const handleClickOpen = () => () => {
        setOpen(true);
        setEditData(null);
    };

    useEffect(() => {
        gameService.getAllGames().then(
            (response) => {
                setGameList(response);
                setLoading(false);
            },
            (error) => {}
        );
    }, [count]);

    const gameListUpdated = useCallback(() => {
        setCount(count + 1);
        setOpen(false);
    }, [count]);

    const editCallBack = useCallback((param) => {
        setEditData(param);
        setActionType('Edit');
        setOpen(true);
    }, []);

    return (
        <div>
            <div style={{ position: 'absolute', zIndex: 10, padding: 10, display: 'flex' }}>
                <Button onClick={handleClickOpen()} variant="outlined">
                    <AddIcon />
                    {t('Add')} {t('Game')}
                </Button>
                <Input sx={{ mx: 10 }} placeholder={t('Search')} value={search} onChange={(e) => setSearch(e.target.value)} />
                <FormControlLabel
                    sx={{ margin: 0 }}
                    control={<Switch checked={showDone} onChange={() => setShowDone(!showDone)} inputProps={{ 'aria-label': 'controlled' }} />}
                    label="Hide Done Tagged Games"
                />
            </div>
            <GameFormDialog
                open={open}
                setOpen={(res) => {
                    setOpen(res);
                    if (!res) {
                        setEditData(null);
                        setActionType('Add');
                    }
                }}
                gameListUpdated={gameListUpdated}
                actionType={actionType}
                editData={editData}
                t={t}
            />
            <GameTable rows={gameList} gameListUpdated={gameListUpdated} editCallBack={editCallBack} search={search} show_done={showDone} loading={loading} setLoading={(v) => setLoading(v)} t={t} />
        </div>
    );
}
