import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import GameTable from './GameTable'
import Content from './content'
import gameService from '../../services/game.service';

export default function Game() {
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
      console.log("all games", response);
      setGameList(response);
    },
    (error) => {
    });
  }, [count]);

  const newGameAdded = () => {
    console.log("INDEx New Game Addes")
    setCount(count + 1);
  }

  return (
    <div>
      <Button onClick={handleClickOpen()} variant="outlined">Add a new Game</Button>
      <Dialog
        maxWidth="xl"
        open={open} 
        onClose={handleClose}
        scroll="paper"
        aria-labelledby="scroll-dialog-title"
        aria-describedby="scroll-dialog-description"
      >
        <DialogTitle id="scroll-dialog-title">New Game</DialogTitle>
        <DialogContent 
          dividers={true}
          ref={descriptionElementRef}
          >
            <Content newGameAdded={newGameAdded}/>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>OK</Button>
        </DialogActions>
      </Dialog>

      <GameTable rows={gameList}/>
    </div>
  );
}