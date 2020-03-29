import React, { useState, useContext } from "react";
import {
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogTitle,
  DialogContent,
  Grid,
  FormControl,
  FormControlLabel,
  Radio,
  FormLabel,
  RadioGroup
} from "@material-ui/core";
import { GameContext } from "../App";
import { useHistory, Redirect } from "react-router-dom";
import firebase from "../firebase";
import AccGame from "./AccGame";

export default function Home() {
  const Game = useContext(GameContext);
  const history = useHistory();
  const nickName = Game.nickName;
  const [game, setGame] = useState("Trivia");
  const [isJoinGameDialogOpen, setIsJoinGameDialogOpen] = useState(false);
  const [isErrorDialogOpen, setIsErrorDialogOpen] = useState(false);

  const createGame = () => {
    const id = makeId(4);
    const gameRef = firebase.database().ref("games/" + id);
    if (nickName != null) {
      try {
        gameRef.set({
          game: game,
          creator: nickName,
          state: "tostart",
          players: [nickName]
        });

        Game.setGameId(id);
        history.push("/game");
      } catch (error) {
        console.log(error);
      }
    } else setIsErrorDialogOpen(true);
  };

  const makeId = length => {
    let result = "";
    let characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  };

  const joinGame = () => {
    if (nickName != null) {
      setIsJoinGameDialogOpen(true);
    } else setIsErrorDialogOpen(true);
  };

  const handleDialogSave = textId => {
    Game.setGameId(textId);
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
          <Button onClick={() => setIsErrorDialogOpen(false)} color="primary">
            Ho capito..non lo faccio più :(
          </Button>
        </DialogActions>
      </Dialog>
    );
  };
  const InsertCodeDialog = () => {
    const [textId, setTextId] = useState("");
    return (
      <Dialog
        open={isJoinGameDialogOpen}
        onClose={() => setIsJoinGameDialogOpen(false)}
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
            onChange={e => setTextId(e.target.value.toUpperCase())}
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setIsJoinGameDialogOpen(false)}
            color="secondary"
          >
            Annulla
          </Button>
          <Button onClick={() => handleDialogSave(textId)} color="primary">
            VAI!
          </Button>
        </DialogActions>
      </Dialog>
    );
  };
  const handleGameChange = event => {
    setGame(event.target.value);
  };

  return (
    <div>
      <h1 style={{ color: "red" }}>QUARANTINE'S TRIVIA</h1>
      <Grid justify="center" container>
        <Grid item xs={4}>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            onChange={e => Game.setNickName(e.target.value.toUpperCase())}
            name="nickname"
            label="Inserisci il tuo nickName"
            type="nickname"
            id="nickname"
            autoComplete="current-nickname"
          />
        </Grid>
        <Grid item xs={10}>
          <FormControl component="fieldset">
            <FormLabel component="legend">Scegli il gioco</FormLabel>
            <RadioGroup
              aria-label="gender"
              name="gender1"
              value={game}
              onChange={handleGameChange}
            >
              <FormControlLabel
                value="Trivia"
                control={<Radio />}
                label="trivia"
              />
              <FormControlLabel
                value="Acc"
                control={<Radio />}
                label="Animali,cose.."
              />
            </RadioGroup>
          </FormControl>
        </Grid>
      </Grid>
      <Grid justify="center" container>
        <Grid item xs={4}>
          <Button
            variant="contained"
            color="primary"
            onClick={createGame}
            style={{ margin: "20px" }}
          >
            CREA
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={joinGame}
            style={{ margin: "20px" }}
          >
            PARTECIPA
          </Button>
        </Grid>
      </Grid>
      <InsertCodeDialog></InsertCodeDialog>
      <ErrorDialog
        title={"Devi inserire un nickName per poter giocare, dai su :)"}
      ></ErrorDialog>
    </div>
  );
}

/* const updateBoard = () => {
    const boardRef = firebase.database().ref("board1/");
    const board = [
      0,
      1,
      2,
      3,
      4,
      5,
      6,
      0,
      1,
      2,
      3,
      4,
      5,
      6,
      0,
      1,
      2,
      3,
      4,
      5,
      6,
      0,
      1,
      7
    ];
    boardRef.set(board);
  };

  updateBoard();
 */
