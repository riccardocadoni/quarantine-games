import React, { useState, useEffect, useContext } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogTitle,
  DialogContent,
  Grid
} from "@material-ui/core";
import { GameContext } from "../App";
import { Redirect } from "react-router-dom";
import firebase from "../firebase";
import Board from "./Board";

export default function Game() {
  const Game = useContext(GameContext);
  const gameId = Game.gameId;
  const nickName = Game.nickName;
  //gameplay
  const [isCreator, setIsCreator] = useState(false);
  const [creator, setCreator] = useState();
  const [players, setPlayers] = useState([]);
  const [playersQueque, setPlayersQueque] = useState([]);
  const [positions, setPositions] = useState([]);
  const [boardArr, setBoardArr] = useState([]);
  const [redirect, setRedirect] = useState(false);
  const [question, setQuestion] = useState({});
  const [questionResult, setQuestionResult] = useState();
  const [winner, setWinner] = useState();
  const [obQuestion, setObQuestion] = useState({});
  const [answers, setAnswers] = useState([0, 0, 0, 1]);
  const [makeQuestionState, setMakeQuestionState] = useState(false);
  //game state
  const [gameState, setGameState] = useState();
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState();
  //dialogs
  const [isQuestionDialogOpen, setIsQuestionDialogOpen] = useState(false);
  const [isErrorDialogOpen, setIsErrorDialogOpen] = useState(false);
  const [isResultDialogOpen, setIsResultDialogOpen] = useState(false);
  const [isWinnerDialogOpen, setIsWinnerDialogOpen] = useState(false);
  const [isObservQuestionDialogOpen, setIsObservQuestionDialogOpen] = useState(
    false
  );

  useEffect(() => {
    const gameRef = firebase.database().ref("games/" + gameId);
    gameRef.once("value", function(snapshot) {
      if (!snapshot.val()) {
        setIsErrorDialogOpen(true);
      } else {
        if (nickName !== snapshot.val().creator) {
          const playerr = snapshot.val().players;
          if (!playerr.includes(nickName)) {
            const players = snapshot.val().players;
            const playersUpdated = [...players, nickName];
            gameRef.child("players").set(playersUpdated);
          }
        } else setIsCreator(true);
        setCreator(snapshot.val().creator);
        setBoardArr(snapshot.val().board);
      }
    });
  }, []);

  useEffect(() => {
    const gameRef = firebase.database().ref("games/" + gameId);
    gameRef.on("value", function(snapshot) {
      if (!snapshot.val()) {
        setIsErrorDialogOpen(true);
      } else {
        setGameState(snapshot.val().state);
        setPlayers(snapshot.val().players);
        if (snapshot.val().playersQueque) {
          setPlayersQueque(snapshot.val().playersQueque);
          setPositions(snapshot.val().positions);
        }
        if (snapshot.val().winner) {
          setWinner(snapshot.val().winner);
        }
        if (snapshot.val().question) {
          setObQuestion(snapshot.val().question);
        } else setObQuestion({});
      }
    });
    return () => gameRef.off();
  }, []);

  useEffect(() => {
    //se non è vuoto question

    if (question && Object.entries(question).length !== 0) {
      setIsQuestionDialogOpen(true);
    }
  }, [question]);

  useEffect(() => {
    //se non è vuoto question
    if (Object.entries(obQuestion).length !== 0) {
      setIsObservQuestionDialogOpen(true);
    }
  }, [obQuestion]);

  useEffect(() => {
    if (winner) {
      setIsWinnerDialogOpen(true);
    }
  }, [winner]);

  useEffect(() => {
    fetch("https://opentdb.com/api_token.php?command=request")
      .then(res => res.json())
      .then(res => setToken(res.token));
  }, []);

  useEffect(() => {
    if (makeQuestionState) {
      handleQuestion();
    }
  }, [makeQuestionState]);

  if (redirect) {
    Game.setGameId(null);
    return <Redirect to="/home"></Redirect>;
  }

  if (!gameId) setRedirect(true);

  const startGame = () => {
    const gameRef = firebase.database().ref("games/" + gameId);
    let shuffled = shuffle(players);
    let positions = {};
    shuffled.map(player => {
      positions[player] = 0;
    });
    gameRef.child("playersQueque").set(shuffled);
    gameRef.child("positions").set(positions);
    gameRef.child("state").set(players[0] + "P");
  };

  function shuffle(array) {
    var currentIndex = array.length,
      temporaryValue,
      randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;

      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }

    return array;
  }

  const nextToP = () => {
    let numb = Math.floor(Math.random() * 3) + 1;
    let pos = positions[nickName] + numb;
    if (positions[nickName] + numb >= boardArr.length) {
      pos = boardArr.length - 1;
    }
    const gameRef = firebase.database().ref("games/" + gameId);
    let update = { [nickName]: pos };
    gameRef.child("positions").update(update);
    gameRef.child("state").set(nickName + "P");
  };

  const nextPlayer = () => {
    const gameRef = firebase.database().ref("games/" + gameId);
    let position = playersQueque.indexOf(nickName);

    if (position === playersQueque.length - 1) {
      position = -1;
    }
    gameRef.child("state").set(playersQueque[position + 1] + "P");
  };

  const handleQuestion = () => {
    setLoading(true);
    let myPos = positions[nickName];
    let colorNum = boardArr[myPos];
    let topic;
    switch (colorNum) {
      case 0:
        topic = 23; //history
        break;
      case 1:
        topic = 22; //geogrphy
        break;
      case 2:
        topic = 25; // art
        break;
      case 3:
        topic = 26; //celebrities
        break;
      case 4:
        topic = 17; //science also 18
        break;
      case 5:
        topic = 9; // general knowledge
        break;
      default:
        break;
    }
    const gameRef = firebase.database().ref("games/" + gameId);
    fetch(
      "https://opentdb.com/api.php?amount=1&type=multiple&category=" +
        topic +
        "&encode=base64" +
        "&token=" +
        token
    )
      .then(res => res.json())
      .then(res => {
        if (res.results[0]) {
          setQuestion(res.results[0]);
          setAnswers(shuffle(answers));
          gameRef.child("question").set(res.results[0]);
          setLoading(false);
        }
        setLoading(false);
      });
  };

  const declareWinner = () => {
    const gameRef = firebase.database().ref("games/" + gameId);
    gameRef.child("state").set("winner");
    gameRef.child("winner").set(nickName);
  };

  const clearOnlineQuestion = () => {
    firebase
      .database()
      .ref("games/" + gameId)
      .child("question")
      .remove();
  };

  const rightAnswer = () => {
    clearOnlineQuestion();
    setQuestionResult("right");
    setIsQuestionDialogOpen(false);
    setIsResultDialogOpen(true);
    if (positions[nickName] === boardArr.length - 1) {
      declareWinner();
    } else {
      const gameRef = firebase.database().ref("games/" + gameId);
      gameRef.child("state").set(nickName + "R");
      setMakeQuestionState(false);
    }
  };

  const wrongAnswer = () => {
    clearOnlineQuestion();
    setQuestionResult("wrong");
    setIsQuestionDialogOpen(false);
    setIsResultDialogOpen(true);
    nextPlayer();
    setMakeQuestionState(false);
  };

  const handleCloseGame = () => {
    if (creator) {
      firebase
        .database()
        .ref("games/" + gameId)
        .remove();
    }
    window.location.reload();
  };

  const QuestionDialog = () => {
    let myPos = positions[nickName];
    let colorNum = boardArr[myPos];
    let color;
    switch (colorNum) {
      case 0:
        color = "yellow";
        break;
      case 1:
        color = "blue";
        break;
      case 2:
        color = "brown";
        break;
      case 3:
        color = "pink";
        break;
      case 4:
        color = "green";
        break;
      case 5:
        color = "orange";
        break;
      default:
        break;
    }
    if (question && question.incorrect_answers) {
      let incorrAnsw = ["daelim", ...question.incorrect_answers];
      return (
        <Dialog open={isQuestionDialogOpen} aria-labelledby="form-dialog-title">
          <DialogTitle style={{ background: [color] }} id="form-dialog-title">
            <p style={{ color: "white" }}>{atob(question.category)}</p>
          </DialogTitle>
          <DialogContent>{atob(question.question)}</DialogContent>
          <DialogActions>
            {answers.map((answ, i) => {
              if (answ === 1) {
                return (
                  <Button onClick={rightAnswer} color="primary" key={i}>
                    {atob(question.correct_answer)}
                  </Button>
                );
              } else {
                incorrAnsw.splice(0, 1);
                return (
                  <Button onClick={wrongAnswer} color="primary" key={i}>
                    {atob(incorrAnsw[0])}
                  </Button>
                );
              }
            })}
          </DialogActions>
        </Dialog>
      );
    } else return null;
  };

  const WinnerDialog = () => {
    return (
      <Dialog
        open={isWinnerDialogOpen}
        onClose={() => setIsErrorDialogOpen(false)}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">
          HA VINTO LA PARTITA {winner}!!!
        </DialogTitle>
        <DialogActions>
          <Button onClick={handleCloseGame} color="primary">
            OK
          </Button>
        </DialogActions>
      </Dialog>
    );
  };

  const ResultDialog = () => {
    let decodeAnsw = "";
    switch (questionResult) {
      case "right":
        if (question.correct_answer) {
          decodeAnsw = atob(question.correct_answer);
        }
        return (
          <Dialog
            open={isResultDialogOpen}
            onClose={() => setIsErrorDialogOpen(false)}
            aria-labelledby="form-dialog-title"
          >
            <DialogTitle id="form-dialog-title">RISPOSTA ESATTA!</DialogTitle>
            <DialogContent>La risposta corretta è: {decodeAnsw}</DialogContent>
            <DialogActions>
              <Button
                onClick={() => {
                  setQuestion({});
                  setIsResultDialogOpen(false);
                }}
                color="primary"
              >
                OK
              </Button>
            </DialogActions>
          </Dialog>
        );
        break;
      case "wrong":
        if (question.correct_answer) {
          decodeAnsw = atob(question.correct_answer);
        }
        return (
          <Dialog
            open={isResultDialogOpen}
            onClose={() => setIsErrorDialogOpen(false)}
            aria-labelledby="form-dialog-title"
          >
            <DialogTitle id="form-dialog-title">RISPOSTA ERRATA :(</DialogTitle>
            <DialogContent>La risposta corretta è: {decodeAnsw}</DialogContent>
            <DialogActions>
              <Button
                onClick={() => {
                  setQuestion({});
                  setIsResultDialogOpen(false);
                }}
                color="primary"
              >
                OK
              </Button>
            </DialogActions>
          </Dialog>
        );
        break;

      default:
        return null;
        break;
    }
  };

  const ObservQuestionDialog = () => {
    if (obQuestion.incorrect_answers) {
      let incorrAnsw = ["daelim", ...obQuestion.incorrect_answers];
      let playerAnswering = gameState.slice(0, -1);
      return (
        <Dialog
          open={isObservQuestionDialogOpen}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">{playerAnswering}</DialogTitle>
          <DialogContent>{atob(obQuestion.category)}</DialogContent>
          <DialogContent>{atob(obQuestion.question)}</DialogContent>
          <DialogActions>
            {answers.map((answ, i) => {
              if (answ === 1) {
                return (
                  <Button color="primary" key={i}>
                    {atob(obQuestion.correct_answer)}
                  </Button>
                );
              } else {
                incorrAnsw.splice(0, 1);
                return (
                  <Button color="primary" key={i}>
                    {atob(incorrAnsw[0])}
                  </Button>
                );
              }
            })}
          </DialogActions>
        </Dialog>
      );
    } else return null;
  };

  const LoadingDialog = () => {
    return (
      <Dialog open={loading} aria-labelledby="form-dialog-title">
        <DialogTitle>
          Attendi..stiamo cercando una domanda per te :)
        </DialogTitle>
      </Dialog>
    );
  };

  switch (gameState) {
    case "tostart":
      return (
        <div>
          <p>Benvenuti al gioco creato da {creator}</p>
          {isCreator && gameState === "tostart" ? (
            <Grid justify="center" container>
              <Grid item xs={12}>
                <Button variant="contained" color="primary" onClick={startGame}>
                  START
                </Button>
              </Grid>
              <Grid item xs={12}>
                <h1>CODICE PER INVITARE: {gameId}</h1>
              </Grid>
              <Grid item xs={12}>
                <div>
                  Pronti per giocare:
                  {players.map((player, i) => {
                    return <div key={i}>{player} </div>;
                  })}
                </div>
              </Grid>
            </Grid>
          ) : (
            <Grid justify="center" container>
              <Grid item xs={12}>
                <p>aspetta che il creatore inizi la partita :D</p>
              </Grid>
              <Grid item xs={12}>
                <div>
                  Pronti per giocare:
                  {players.map((player, i) => {
                    return <div key={i}>{player} </div>;
                  })}
                </div>
              </Grid>
            </Grid>
          )}

          <Dialog open={isErrorDialogOpen}>
            <p>
              Non esite la partita che stai cercando, prova a digitare meglio ;)
            </p>
            <Button onClick={() => setRedirect(true)} color="primary">
              OK
            </Button>
          </Dialog>
        </div>
      );
      break;

    case nickName + "P":
      if (!makeQuestionState) {
        setMakeQuestionState(true);
      }
      if (question == undefined) {
        nextPlayer();
      }
      return (
        <div>
          <p>Rispondi alla domanda!</p>
          <Board board={boardArr} positions={positions}></Board>
          <QuestionDialog></QuestionDialog>
          <ResultDialog></ResultDialog>
          <LoadingDialog></LoadingDialog>
        </div>
      );
      break;

    case nickName + "R":
      return (
        <div>
          <Grid justify="center" container>
            <Grid item xs={12}>
              <p>E' ora di lanciare il dado!</p>
            </Grid>
            <Grid item xs={12}>
              <Button onClick={nextToP} color="secondary" variant="contained">
                LANCIA IL DADO!
              </Button>
            </Grid>
            <Grid item xs={12}>
              <Board board={boardArr} positions={positions}></Board>
            </Grid>
          </Grid>

          <ResultDialog></ResultDialog>
        </div>
      );
      break;

    default:
      return (
        <div>
          {gameState ? <p>E' il turno di {gameState.slice(0, -1)}</p> : null}
          <Board board={boardArr} positions={positions}></Board>
          <Dialog open={isErrorDialogOpen}>
            <p>
              Non esite la partita che stai cercando, prova a digitare meglio ;)
            </p>
            <Button onClick={() => setRedirect(true)} color="primary">
              OK
            </Button>
          </Dialog>
          <ObservQuestionDialog></ObservQuestionDialog>
          <ResultDialog></ResultDialog>
          <WinnerDialog></WinnerDialog>
        </div>
      );
      break;
  }
}
