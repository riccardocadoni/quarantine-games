import React, { useState, useContext } from 'react';
import {
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogTitle,
  DialogContent,
  Grid
} from '@material-ui/core';
import { GameContext } from '../App';
import { useHistory, Redirect } from 'react-router-dom';
import firebase from '../firebase';

export default function Home() {
  const Game = useContext(GameContext);
  const history = useHistory();
  const nickName = Game.nickName;
  const [textId, setTextId] = useState('');
  const [isJoinGameDialogOpen, setIsJoinGameDialogOpen] = useState(false);
  const [isErrorDialogOpen, setIsErrorDialogOpen] = useState(false);

  const createGame = () => {
    const id = makeId(4);
    const gameRef = firebase.database().ref('games/' + id);
    if (nickName != null) {
      let board = [];
      for (let i = 0; i <= 15; i++) {
        let numb = Math.floor(Math.random() * 5);
        board.push(numb);
      }
      try {
        gameRef.set({
          creator: nickName,
          state: 'tostart',
          players: [nickName],
          board: board
        });

        Game.setGameId(id);
        history.push('/game');
      } catch (error) {
        console.log(error);
      }
    } else setIsErrorDialogOpen(true);
  };

  const makeId = length => {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  };

  const joinGame = () => {
    if (nickName != null) {
      setIsJoinGameDialogOpen(true);
    } else setIsErrorDialogOpen(true);
  };

  const handleDialogSave = () => {
    Game.setGameId(textId);
  };

  const handleDialogClose = () => {
    setIsJoinGameDialogOpen(false);
  };
  if (Game.gameId) return <Redirect to="/game"></Redirect>;

  const ErrorDialog = props => {
    return (
      <Dialog
        open={isErrorDialogOpen}
        onClose={() => setIsErrorDialogOpen(false)}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">{props.title}</DialogTitle>
        <DialogActions>
          <Button onClick={handleDialogClose} color="primary">
            Ho capito..non lo faccio più :(
          </Button>
        </DialogActions>
      </Dialog>
    );
  };
  const Dialogg = () => {
    return (
      <Dialog
        open={isJoinGameDialogOpen}
        onClose={handleDialogClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">
          Inserisci il codice della partita a cui vuoi partecipare :)
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Esempio.. KWR3"
            type="codes"
            fullWidth
            onChange={e => setTextId(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogSave} color="primary">
            VAI!
          </Button>
          <Button onClick={handleDialogClose} color="secondary">
            Annulla
          </Button>
        </DialogActions>
      </Dialog>
    );
  };

  return (
    <div>
      <p>Benvenuti al gioco della quarantena! :D</p>
      <Grid justify="center" container>
        <Grid item xs={4}>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            onChange={e => Game.setNickName(e.target.value)}
            name="nickname"
            label="nickname"
            type="nickname"
            id="nickname"
            autoComplete="current-nickname"
          />
        </Grid>
      </Grid>
      <Button onClick={createGame}>CREA</Button>
      <Button onClick={joinGame}>PARTECIPA</Button>
      <Dialogg></Dialogg>
      <ErrorDialog
        title={'Devi inserire un nickName per poter giocare, dai su :)'}
      ></ErrorDialog>
    </div>
  );
}
