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
  const [gameList, setGameList] = React.useState([]);
  const [count, setCount] = React.useState(0);

  const handleClickOpen = () => () => {
    setOpen(true);
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
  }, [count]);

  return (
    <div>
      <Button onClick={handleClickOpen()} variant="outlined">Add a new Game</Button>
      <Dialog
        open={open} 
        classes={{ paper: classes.paper}}
        onClose={handleClose}
        scroll="paper"
        aria-labelledby="scroll-dialog-title"
        aria-describedby="scroll-dialog-description"
      >
        <DialogTitle id="scroll-dialog-title">New Game</DialogTitle>
        <DialogContent 
          dividers={true}
          style={{height:'90vh'}}
          ref={descriptionElementRef}
          >
            <Content gameListUpdated={gameListUpdated}/>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>OK</Button>
        </DialogActions>
      </Dialog>

      <GameTable rows={gameList} gameListUpdated={gameListUpdated}/>
    </div>
  );
}