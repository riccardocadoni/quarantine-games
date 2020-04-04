import React, { useState, useEffect, useContext } from "react";
import { Button, Dialog, Grid } from "@material-ui/core";
import { GameContext } from "../App";
import firebase from "../firebase";
import Board from "./Board";
//components
import QuestionDialog from "./dialogs/QuestionDialog";
import LoadingDialog from "./dialogs/LoadingDialog";
import ObservQuestionDialog from "./dialogs/ObservQuestionDialog";
import ResultDialog from "./dialogs/ResultDialog";
import WinnerDialog from "./dialogs/WinnerDialog";
//hooks
import { getBoardTopic, getDifficulty } from "../utils";
import InformationDialog from "./dialogs/InformationDialog";

export default function TriviaGame() {
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
  const [isInfoDialogOpen, setIsInfoDialogOpen] = useState(false);

  useEffect(() => {
    const boardRef = firebase.database().ref("board1");
    boardRef.once("value", function (snapshot) {
      if (!snapshot.val()) {
        setIsErrorDialogOpen(true);
      } else {
        setBoardArr(snapshot.val());
      }
    });
  }, []);

  useEffect(() => {
    const gameRef = firebase.database().ref("games/" + gameId);
    gameRef.once("value", function (snapshot) {
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
      }
    });
  }, []);

  useEffect(() => {
    const gameRef = firebase.database().ref("games/" + gameId);
    gameRef.on("value", function (snapshot) {
      if (!snapshot.val()) {
        setIsErrorDialogOpen(true);
      } else {
        setGameState(snapshot.val().state);
        setPlayers(snapshot.val().players);
        setPositions(snapshot.val().positions);
        if (snapshot.val().playersQueque) {
          setPlayersQueque(snapshot.val().playersQueque);
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
      .then((res) => res.json())
      .then((res) => setToken(res.token));
  }, []);

  useEffect(() => {
    if (makeQuestionState) {
      handleQuestion();
    }
  }, [makeQuestionState]);

  const startGame = () => {
    const gameRef = firebase.database().ref("games/" + gameId);
    let shuffled = shuffle(players);
    let positions = {};
    shuffled.map((player) => {
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

  const rollDice = () => {
    let numb = Math.floor(Math.random() * 3) + 1;
    let pos = positions[nickName] + numb;
    if (positions[nickName] + numb >= boardArr.length) {
      pos = boardArr.length - 1;
    }
    updatePos(pos);
  };

  const updatePos = (pos) => {
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
    const gameRef = firebase.database().ref("games/" + gameId);
    let myPos = positions[nickName];
    let difficulty = getDifficulty(myPos);
    let colorNum = boardArr[myPos];
    if (colorNum === 9) {
      setIsInfoDialogOpen(true);
      myPos = myPos - 2;
      colorNum = boardArr[myPos];
      gameRef.child("state").set(nickName);
      setMakeQuestionState(false);
      updatePos(myPos);
      return;
    }
    setLoading(true);
    let topic = getBoardTopic(colorNum);
    fetch(
      "https://opentdb.com/api.php?amount=1&type=multiple&category=" +
        topic +
        "&difficulty=" +
        difficulty +
        "&encode=base64" +
        "&token=" +
        token
    )
      .then((res) => res.json())
      .then((res) => {
        if (res.results[0]) {
          setQuestion(res.results[0]);
          setAnswers(shuffle(answers));
          gameRef.child("question").set(res.results[0]);
          setLoading(false);
        } // else handleQuestion();
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

  switch (gameState) {
    case "tostart":
      return (
        <div>
          {isCreator && gameState === "tostart" ? (
            <Grid justify="center" container>
              <Grid item xs={12}>
                <h1>PREMI IL TASTO START PER INZIARE A GIOCARE</h1>
                <h3>
                  Aspetta che gli altri giocatori siano connessi prima di
                  cominciare,se no rimarranno fuori!
                </h3>
              </Grid>
              <Grid item xs={12}>
                <h1>
                  CODICE PER INVITARE:
                  <span style={{ color: "orange" }}>{gameId}</span>
                </h1>
              </Grid>
              <Grid item xs={12}>
                {token ? (
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={startGame}
                  >
                    START
                  </Button>
                ) : (
                  <Button variant="contained" color="primary">
                    START
                  </Button>
                )}
              </Grid>
              <Grid item xs={12}>
                <div style={{ padding: "40px" }}>
                  Pronti per giocare:
                  {players.map((player, i) => {
                    return (
                      <h3 style={{ color: "blue" }} key={i}>
                        {player}{" "}
                      </h3>
                    );
                  })}
                </div>
              </Grid>
            </Grid>
          ) : (
            <Grid justify="center" container>
              <Grid item xs={12}>
                <h1>ATTENDI L'INIZIO DELLA PARTITA :)</h1>
              </Grid>
              <Grid item xs={12}>
                <div style={{ padding: "40px" }}>
                  Pronti per giocare:
                  {players.map((player, i) => {
                    return (
                      <h3 style={{ color: "blue" }} key={i}>
                        {player}{" "}
                      </h3>
                    );
                  })}
                </div>
              </Grid>
            </Grid>
          )}
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
          <h1 style={{ color: "red" }}>E' IL TUO TURNO!</h1>
          <Board board={boardArr} positions={positions}></Board>
          <QuestionDialog
            question={question}
            positions={positions}
            boardArr={boardArr}
            rightAnswer={rightAnswer}
            wrongAnswer={wrongAnswer}
            isQuestionDialogOpen={isQuestionDialogOpen}
            nickName={nickName}
            answers={answers}
          ></QuestionDialog>
          <ResultDialog
            questionResult={questionResult}
            question={question}
            isResultDialogOpen={isResultDialogOpen}
            setQuestion={setQuestion}
            setIsErrorDialogOpen={setIsErrorDialogOpen}
            setIsResultDialogOpen={setIsResultDialogOpen}
          ></ResultDialog>
          <LoadingDialog loading={loading}></LoadingDialog>
          <InformationDialog
            isInfoDialogOpen={isInfoDialogOpen}
            setIsInfoDialogOpen={setIsInfoDialogOpen}
          ></InformationDialog>
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
              <Button onClick={rollDice} color="secondary" variant="contained">
                LANCIA IL DADO!
              </Button>
            </Grid>
            <Grid item xs={12}>
              <Board board={boardArr} positions={positions}></Board>
            </Grid>
          </Grid>

          <ResultDialog
            questionResult={questionResult}
            question={question}
            isResultDialogOpen={isResultDialogOpen}
            setQuestion={setQuestion}
            setIsErrorDialogOpen={setIsErrorDialogOpen}
            setIsResultDialogOpen={setIsResultDialogOpen}
          ></ResultDialog>
        </div>
      );
      break;

    default:
      return (
        <div>
          {gameState ? <p>E' il turno di {gameState.slice(0, -1)}</p> : null}
          <Board board={boardArr} positions={positions}></Board>
          <ObservQuestionDialog
            obQuestion={obQuestion}
            isObservQuestionDialogOpen={isObservQuestionDialogOpen}
            gameState={gameState}
            answers={answers}
          ></ObservQuestionDialog>
          <ResultDialog
            questionResult={questionResult}
            question={question}
            isResultDialogOpen={isResultDialogOpen}
            setQuestion={setQuestion}
            setIsErrorDialogOpen={setIsErrorDialogOpen}
            setIsResultDialogOpen={setIsResultDialogOpen}
          ></ResultDialog>
          <WinnerDialog
            isWinnerDialogOpen={isWinnerDialogOpen}
            winner={winner}
            handleCloseGame={handleCloseGame}
            setIsErrorDialogOpen={setIsErrorDialogOpen}
          ></WinnerDialog>
          <p>Codice partita: {gameId}</p>
        </div>
      );
      break;
  }
}
