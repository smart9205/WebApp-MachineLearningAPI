import React, { useState, useCallback, useEffect } from 'react';
import Button from '@mui/material/Button';
import Input from '@mui/material/Input';
import AddIcon from '@mui/icons-material/Add';
import GameTable from './GameTable'
import GameFormDialog from './GameFormDialog'
import gameService from '../../../services/game.service';

export default function Game() {
  const [open, setOpen] = useState(false);
  const [actionType, setActionType] = useState("Add");
  const [gameList, setGameList] = useState([]);
  const [count, setCount] = useState(0);
  const [editData, setEditData] = useState(null);
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")

  const handleClickOpen = () => () => {
    setOpen(true);
    setEditData(null)
  };

  useEffect(() => {
    gameService.getAllGames().then((response) => {
      setGameList(response);
      setLoading(false)
    },
      (error) => {
      });
  }, [count]);

  const gameListUpdated = useCallback(() => {
    setCount(count + 1);
    setOpen(false);
  }, [count]);

  const editCallBack = useCallback((param) => {
    setEditData(param)
    setActionType("Edit")
    setOpen(true)
  }, []);

  return (
    <div>
      <div style={{ position: "absolute", zIndex: 10, padding: 10, display: "flex" }}>
        <Button onClick={handleClickOpen()} variant="outlined"><AddIcon />Add Game</Button>
        <Input
          sx={{ mx: 10 }}
          placeholder='Search'
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      <GameFormDialog
        open={open}
        setOpen={res => {
          setOpen(res)
          if (!res) setEditData(false)
        }}
        gameListUpdated={gameListUpdated}
        actionType={actionType}
        editData={editData}
      />
      <GameTable
        rows={gameList}
        gameListUpdated={gameListUpdated}
        editCallBack={editCallBack}
        search={search}
        loading={loading}
        setLoading={(v) => setLoading(v)}
      />
    </div>
  );
}