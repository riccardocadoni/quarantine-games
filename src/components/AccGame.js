import React, { useState, useEffect, useContext } from "react";
import firebase from "../firebase";
import { GameContext } from "../App";
import { Grid, TextField, Button } from "@material-ui/core";
import ResultTable from "./ResultTable";

export default function AccGame() {
  const Game = useContext(GameContext);
  const gameId = Game.gameId;
  const nickName = Game.nickName;

  const [elements, setElements] = useState([]);
  const [insertEl, setInsertEl] = useState([]);
  const [nuberRound, setNuberRound] = useState(7);
  const [letter, setLetter] = useState();
  const [round, setRound] = useState(1);
  const [isCreator, setIsCreator] = useState(false);
  const [gameState, setGameState] = useState();
  const [score, setScore] = useState({});
  const [players, setPlayers] = useState([]);
  const [characters, setCharacters] = useState("ABCDEFGHIJKLMNOPQRSTUVZ");
  const [result, setResult] = useState({});
  const [generalResult, setGeneralResult] = useState(null);
  const [isTimeOver, setIsTimeOver] = useState(false);
  const [endTurn, setEndTurn] = useState(false);
  const gameRef = firebase.database().ref("games/" + gameId);
  const [finishButton, setFinishButton] = useState(true);

  useEffect(() => {
    gameRef.on("value", function (snapshot) {
      if (!snapshot.val()) {
        console.log("error di qualche genere");
      } else {
        setGameState(snapshot.val().state);
        setPlayers(snapshot.val().players);
        setLetter(snapshot.val().letter);
        setScore(snapshot.val().score);
        setEndTurn(snapshot.val().endTurn);
        if (snapshot.val().finishButton === false) {
          setFinishButton(snapshot.val().finishButton);
        } else setFinishButton(true);
        if (snapshot.val().results) {
          setGeneralResult(snapshot.val().results);
        }
        if (snapshot.val().elements) {
          setElements(snapshot.val().elements);
        }
      }
    });
  }, []);
  useEffect(() => {
    const gameRef = firebase.database().ref("/elements");
    gameRef.once("value", function (snapshot) {
      if (!snapshot.val()) {
        console.log("errroe di qulche genere");
      } else {
        setElements(snapshot.val());
        setInsertEl(snapshot.val());
      }
    });
  }, []);
  useEffect(() => {
    const gameRef = firebase.database().ref("games/" + gameId);
    gameRef.once("value", function (snapshot) {
      if (!snapshot.val()) {
        console.log("general error");
        //setIsErrorDialogOpen(true);
      } else {
        if (nickName !== snapshot.val().creator) {
          const playerr = snapshot.val().players;
          if (!playerr.includes(nickName)) {
            const players = snapshot.val().players;
            const playersUpdated = [...players, nickName];
            gameRef.child("players").set(playersUpdated);
          }
        } else setIsCreator(true);
      }
    });
  }, []);

  useEffect(() => {
    if (endTurn) {
      gameRef.child("results").update({ [nickName]: result });
      gameRef.child("endTurn").set(false);
    }
  }, [endTurn]);

  useEffect(() => {
    if (isTimeOver) {
      gameRef.child("results").update({ [nickName]: result });
      gameRef.child("endTurn").set(true);
      gameRef.child("state").set("correction");
      setIsTimeOver(false);
    }
  }, [isTimeOver]);

  const calculateScoreBoard = () => {
    let scoreBoard = [];
    for (let player in score) {
      scoreBoard.push([player, score[player]]);
    }
    scoreBoard.sort(function (a, b) {
      return a[1] - b[1];
    });
    return scoreBoard.reverse();
  };

  if (round === nuberRound + 1) {
    gameRef.child("state").set("winner");
  }

  const startGame = () => {
    let lett = getLetter();
    gameRef.child("letter").set(lett);
    players.map((player) => {
      gameRef.child("score").update({ [player]: 0 });
      gameRef.child("results").update({ [player]: "res" });
    });
    gameRef.child("state").set("writing");
  };

  const nextRound = () => {
    let lett = getLetter();
    setRound((round) => round + 1);
    setFinishButton(true);
    gameRef.child("letter").set(lett);
    gameRef.child("state").set("writing");
  };

  const getLetter = () => {
    let char = characters;
    let charLenght = char.length;
    let res = char.charAt(Math.floor(Math.random() * charLenght));
    let updatedChar = char.replace(res, "");
    setCharacters(updatedChar);
    return res;
  };

  const addPoint = (player, amount) => {
    let updatedScore = score[player] + amount;
    gameRef.child("score").update({ [player]: updatedScore });
  };

  const handleCloseGame = () => {
    if (isCreator) {
      firebase
        .database()
        .ref("games/" + gameId)
        .remove();
    }
    window.location.reload();
  };

  const changeElements = () => {
    gameRef.child("elements").set(insertEl);
  };

  switch (gameState) {
    case "tostart":
      return (
        <div className="sfondo_triv">
          {isCreator && gameState === "tostart" ? (
            <React.Fragment>
              <Grid justify="center" container>
                <Grid item xs={12}>
                  <h1 style={{ color: "white" }}>
                  CLICK START WHEN YOU ARE READY
                  </h1>
                  <h3 style={{ color: "white" }}>
                  Wait for other players before starting, otherwise they will be left out!
                  </h3>
                </Grid>
                <Grid item xs={12}>
                  <h1 style={{ color: "white" }}>
                  INVITE CODE:
                    <span style={{ color: "orange" }}> {gameId}</span>
                  </h1>
                </Grid>
                <Grid item xs={12}>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={startGame}
                  >
                    START
                  </Button>
                </Grid>
                <Grid item xs={12}>
                  <div style={{ padding: "40px", color: "white" }}>
                  Ready to play:
                    {players.map((player, i) => {
                      return (
                        <h3 style={{ color: "orange" }} key={i}>
                          {player}
                        </h3>
                      );
                    })}
                  </div>
                </Grid>
                <Grid item xs={12}>
                  <div style={{ padding: "10px" }}>
                    <h1 style={{ color: "white" }}>
                      Here you can change the words to guess!
                    </h1>
                    <Grid container>
                      {elements.map((el, i) => {
                        return (
                          <InsertElement
                            element={el}
                            number={i}
                            setInsertEl={setInsertEl}
                            key={i}
                          ></InsertElement>
                        );
                      })}
                    </Grid>
                  </div>
                </Grid>
                <Grid item xs={12}>
                  <div style={{ padding: "10px" }}>
                    <Button variant="contained" onClick={changeElements}>
                      OK
                    </Button>
                  </div>
                </Grid>
              </Grid>
            </React.Fragment>
          ) : (
            <Grid justify="center" container>
              <Grid item xs={12}>
                <h1>WAIT FOR THE GAME TO START :)</h1>
              </Grid>
              <Grid item xs={12}>
                <div style={{ padding: "40px" }}>
                Ready to play:
                  {players.map((player, i) => {
                    return (
                      <h3 style={{ color: "orange" }} key={i}>
                        {player}
                      </h3>
                    );
                  })}
                </div>
              </Grid>
            </Grid>
          )}
          <Grid justify="center" container>
            <Grid item xs={12}>
              <h3>
                RULES: 10 points for every correct word, only 5 points if any other player puts the same word.
                7 game rounds.
              </h3>
            </Grid>
          </Grid>
        </div>
      );
      break;
    case "writing":
      return (
        <div className="sfondo_acc">
          <h1 style={{ color: "white" }}>Speedy Words</h1>
          <Grid justify="center" container>
            <Grid item xs={6}>
              <h1 style={{ color: "orange" }}>LETTER: {letter}</h1>
            </Grid>
            <Grid item xs={6}>
              <Timer
                setIsTimeOver={setIsTimeOver}
                setFinishButton={setFinishButton}
              ></Timer>
            </Grid>
            {elements.map((el) => {
              return (
                <Grid item xs={12} md={4} key={el}>
                  <Insert element={el} setResult={setResult} key={el}></Insert>
                </Grid>
              );
            })}
          </Grid>

          <Button
            disabled={!finishButton}
            variant="contained"
            color="primary"
            style={{ margin: "40px" }}
            onClick={() => {
              setFinishButton(false);
              gameRef.child("finishButton").set(false);
              let flag = 0;
              let id = setInterval(() => {
                if (flag === 1) {
                  setIsTimeOver(true);
                  clearInterval(id);
                }
                flag = 1;
              }, 5000);
            }}
          >
            FINISHED
          </Button>
        </div>
      );
      break;
    case "correction":
      gameRef.child("finishButton").set(true);
      if (generalResult) {
        let scoreBoard = calculateScoreBoard();
        return (
          <div className="sfondo_acc">
            <h1 style={{ color: "white" }}>SCOREBOARD</h1>
            {scoreBoard.map((player) => {
              return (
                <p style={{ color: "white" }}>
                  {player[0]} : {player[1]}
                </p>
              );
            })}
            <ResultTable
              elements={elements}
              players={players}
              generalResult={generalResult}
              isCreator={isCreator}
              addPoint={addPoint}
              gameRef={gameRef}
            ></ResultTable>
            {isCreator ? (
              <React.Fragment>
                <h3 style={{ color: "white" }}>
                  You are the judge! To assign
                  <span style={{ color: "green" }}> 10</span> points click on the box to be evaluated.
                  To assign
                  <span style={{ color: "orange" }}> 5</span> points right click (long click from mobile)
                </h3>
                <Button
                  style={{ marginTop: "50px", marginBottom: "50px" }}
                  onClick={nextRound}
                  variant="contained"
                  color="secondary"
                >
                  Next Round
                </Button>
              </React.Fragment>
            ) : null}
          </div>
        );
      }
      return <p>Wait</p>;
      break;

    case "winner":
      let scoreBoard = calculateScoreBoard();
      return (
        <div className="sfondo_acc">
          <h1 style={{ color: "white" }}>{scoreBoard[0][0]} WINS</h1>
          <h1 style={{ color: "white" }}>SCOREBOARD</h1>
          {scoreBoard.map((player) => {
            return (
              <p style={{ color: "white" }}>
                {player[0]} : {player[1]}
              </p>
            );
          })}
          <Button
            onClick={handleCloseGame}
            variant="contained"
            color=" secondary"
          >
            NEW GAME
          </Button>
        </div>
      );
      break;
    default:
      return (
        <div className="sfondo_acc">
          <h1 style={{ color: "white" }}>LOADING..</h1>
        </div>
      );
      break;
  }
}

const InsertElement = ({ element, number, setInsertEl }) => {
  const [text, setText] = useState("");
  useEffect(() => {
    if (text != null && text != "")
      setInsertEl((result) => {
        let array = result;
        array[number] = text;
        return array;
      });
  }, [text]);
  return (
    <Grid item xs={6} md={4}>
      <h2 style={{ color: "white" }}>{element}</h2>
      <TextField variant="outlined" onChange={(e) => setText(e.target.value)} />
    </Grid>
  );
};

const Timer = ({ setIsTimeOver, setFinishButton }) => {
  const [time, setTime] = useState(60);
  useEffect(() => {
    if (time <= 13) {
      setFinishButton(false);
    }
    if (time <= 0) {
      setIsTimeOver(true);
      return;
    }
    let id = setInterval(() => {
      setTime((time) => time - 1);
    }, 1000);
    return () => clearInterval(id);
  }, [time]);
  return <h1 style={{ color: "white" }}>{time}</h1>;
};

const Insert = ({ element, setResult }) => {
  const [text, setText] = useState("");
  useEffect(() => {
    setResult((result) => {
      return { ...result, [element]: [text, 0] };
    });
  }, [text]);
  return (
    <Grid container>
      <Grid item xs={12}>
        <h2 style={{ color: "white" }}>{element}</h2>
        <TextField
          variant="outlined"
          onChange={(e) => setText(e.target.value.toUpperCase())}
        />
      </Grid>
    </Grid>
  );
};
