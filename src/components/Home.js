import React, { useState, useContext } from "react";
import {
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogTitle,
  DialogContent,
  Grid
} from "@material-ui/core";
import { GameContext } from "../App";
import { useHistory, Redirect } from "react-router-dom";
import firebase from "../firebase";
const [props1, set1] = useSpring(() => ({
  xys: [0, 0, 1],
  config: { mass: 5, tension: 350, friction: 40 }
}));
const [props2, set2] = useSpring(() => ({
  xys: [0, 0, 1],
  config: { mass: 5, tension: 350, friction: 40 }
}));
const [props3, set3] = useSpring(() => ({
  xys: [0, 0, 1],
  config: { mass: 5, tension: 350, friction: 40 }
}));
const [props4, set4] = useSpring(() => ({
  xys: [0, 0, 1],
  config: { mass: 5, tension: 350, friction: 40 }
}));

export default function Home() {
  const Game = useContext(GameContext);
  const history = useHistory();
  const nickName = Game.nickName;
  const [isJoinGameDialogOpen, setIsJoinGameDialogOpen] = useState(false);
  const [isErrorDialogOpen, setIsErrorDialogOpen] = useState(false);

  const createGame = game => {
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

  const CreateTrivia = () => {
    return (
      <div className="create_trivia" onClick={() => createGame("Trivia")}>
        <h2>TRIVIA</h2>
      </div>
    );
  };
  const CreateAcc = () => {
    return (
      <div className="create_trivia" onClick={() => createGame("Acc")}>
        <h2>
          ANIMALI,<br></br>COSE..
        </h2>
      </div>
    );
  };
  const JoinGame = () => {
    return (
      <div className="create_trivia" onClick={joinGame}>
        <h2>PARTECIPA</h2>
      </div>
    );
  };

  return (
    <div className="sfondo">
      <h1 style={{ color: "white" }}>QUARANTINE'S GAMES</h1>
      <Grid justify="center" container>
        <Grid item xs={4} style={{ marginTop: "20px" }}>
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
      </Grid>
      <Grid
        justify="center"
        container
        spacing={1}
        style={{ marginTop: "20px" }}
      >
        <Grid item xs={12} md={3}>
          <CreateTrivia></CreateTrivia>
        </Grid>
        <Grid item xs={12} md={3}>
          <CreateAcc></CreateAcc>
        </Grid>
        <Grid item xs={12} md={3}>
          <JoinGame></JoinGame>
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
