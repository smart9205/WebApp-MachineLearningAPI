import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import GameTable from './GameTable'
import Content from './content'
import gameService from '../../services/game.service';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles(() => ({
  paper: { minWidth: "90%" },
}));

export default function Game() {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const [actionType, setActionType] = React.useState("Add");
  const [gameList, setGameList] = React.useState([]);
  const [count, setCount] = React.useState(0);
  const [editData, setEditData] = React.useState({});

  const handleClickOpen = () => () => {
    setOpen(true);
    setEditData({})
  };

  const handleClose = () => {
    setOpen(false);
  };

  const descriptionElementRef = React.useRef(null);

  React.useEffect(() => {
    if (open) {
      const { current: descriptionElement } = descriptionElementRef;
      if (descriptionElement !== null) {
        descriptionElement.focus();
      }
    }
  }, [open]);

  React.useEffect(() => {
    gameService.getAllGames().then((response) => {
      setGameList(response);
    },
      (error) => {
      });
  }, [count]);

  const gameListUpdated = React.useCallback(() => {
    setCount(count + 1);
    setOpen(false);
  }, [count]);

  const editCallBack = React.useCallback((param) => {
    console.log("edit param", param)
    setEditData(param)
    setActionType("Edit")
    setOpen(true)
  }, []);

  return (
    <div>
      <Button onClick={handleClickOpen()} variant="outlined">Add a new Game</Button>
      <Dialog
        open={open}
        classes={{ paper: classes.paper }}
        onClose={handleClose}
        scroll="paper"
        aria-labelledby="scroll-dialog-title"
        aria-describedby="scroll-dialog-description"
      >
        <DialogTitle id="scroll-dialog-title">{actionType} Game</DialogTitle>
        <DialogContent
          dividers={true}
          style={{ height: '90vh' }}
          ref={descriptionElementRef}
        >
          <Content gameListUpdated={gameListUpdated} actionType={actionType} editData={editData} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Close</Button>
        </DialogActions>
      </Dialog>

      <GameTable rows={gameList} gameListUpdated={gameListUpdated} editCallBack={editCallBack} />
    </div>
  );
}