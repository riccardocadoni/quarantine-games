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
    gameRef.on("value", function(snapshot) {
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
      }
    });
  }, []);
  useEffect(() => {
    const gameRef = firebase.database().ref("/elements");
    gameRef.once("value", function(snapshot) {
      if (!snapshot.val()) {
        console.log("errroe di qulche genere");
      } else {
        setElements(snapshot.val());
      }
    });
  }, []);
  useEffect(() => {
    const gameRef = firebase.database().ref("games/" + gameId);
    gameRef.once("value", function(snapshot) {
      if (!snapshot.val()) {
        console.log("errroe di qulche genere");
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
      gameRef.child("state").set("is_time_over");
      setIsTimeOver(false);
    }
  }, [isTimeOver]);

  const calculateScoreBoard = () => {
    let scoreBoard = [];
    for (let player in score) {
      scoreBoard.push([player, score[player]]);
    }
    scoreBoard.sort(function(a, b) {
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
    players.map(player => {
      gameRef.child("score").update({ [player]: 0 });
      gameRef.child("results").update({ [player]: "res" });
    });
    gameRef.child("state").set("writing");
  };

  const nextRound = () => {
    let lett = getLetter();
    setRound(round => round + 1);
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

  switch (gameState) {
    case "tostart":
      return (
        <div className="sfondo_acc" style={{ position: "fixed" }}>
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
                <Button variant="contained" color="primary" onClick={startGame}>
                  START
                </Button>
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
    case "writing":
      return (
        <div className="sfondo_acc">
          <h1 style={{ color: "white" }}>Animali cose e città</h1>
          <Grid justify="center" container>
            <Grid item xs={6}>
              <h1 style={{ color: "orange" }}>LETTERA: {letter}</h1>
            </Grid>
            <Grid item xs={6}>
              <Timer
                setIsTimeOver={setIsTimeOver}
                setFinishButton={setFinishButton}
              ></Timer>
            </Grid>
            {elements.map(el => {
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
            FINITO
          </Button>
        </div>
      );
      break;
    case "is_time_over":
      gameRef.child("finishButton").set(true);
      return (
        <div className="sfondo">
          <h1 style={{ color: "white" }}>Animali cose e città</h1>
          <Grid justify="center" container>
            <Grid item xs={6}>
              <h1 style={{ color: "orange" }}>LETTERA: {letter}</h1>
            </Grid>
            {elements.map(el => (
              <Grid item xs={12} key={el}>
                <p
                  style={{
                    color: "white",
                    fontSize: "20px",
                    fontWeight: "bold"
                  }}
                >
                  {el} : {result[el]}
                </p>
              </Grid>
            ))}
          </Grid>
          {isCreator ? (
            <Button
              variant="contained"
              color="secondary"
              onClick={() => {
                gameRef.child("state").set("correction");
              }}
            >
              QUANDO TUTTI SONO PRONTI
            </Button>
          ) : null}
        </div>
      );
      break;
    case "correction":
      if (generalResult) {
        let scoreBoard = calculateScoreBoard();
        return (
          <div className="sfondo">
            <p>classifica</p>
            {scoreBoard.map(player => {
              return <p>{player} </p>;
            })}
            <ResultTable
              elements={elements}
              players={players}
              generalResult={generalResult}
              isCreator={isCreator}
              addPoint={addPoint}
            ></ResultTable>
            {isCreator ? (
              <Button onClick={nextRound}>Prossimo Round</Button>
            ) : null}
          </div>
        );
      }
      return <p>attendi</p>;
      break;

    case "winner":
      let scoreBoard = calculateScoreBoard();
      return (
        <div className="sfondo_acc">
          <p>classifica</p>
          {scoreBoard.map(player => {
            return <p>{player}</p>;
          })}
        </div>
      );
      break;
    default:
      return <p>default</p>;
      break;
  }
}

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
      setTime(time => time - 1);
    }, 1000);
    return () => clearInterval(id);
  }, [time]);
  return <h1 style={{ color: "white" }}>{time}</h1>;
};

const Insert = ({ element, setResult }) => {
  const [text, setText] = useState("");
  useEffect(() => {
    setResult(result => {
      return { ...result, [element]: text };
    });
  }, [text]);
  return (
    <Grid container>
      <Grid item xs={12}>
        <h2 style={{ color: "white" }}>{element}</h2>
        <TextField
          variant="outlined"
          onChange={e => setText(e.target.value.toUpperCase())}
        />
      </Grid>
    </Grid>
  );
};
