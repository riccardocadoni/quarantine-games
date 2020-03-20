import React, { useState, useEffect, useContext } from 'react';
import {
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogTitle,
  DialogContent
} from '@material-ui/core';
import { GameContext } from '../App';
import { useHistory, Redirect } from 'react-router-dom';
import firebase from '../firebase';
import Board from './Board';

export default function Game() {
  const Game = useContext(GameContext);
  const nickName = Game.nickName;
  const gameId = Game.gameId;
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
  //game state
  const [gameState, setGameState] = useState();
  const [answers, setAnswers] = useState([0, 0, 0, 1]);
  //dialog
  const [isQuestionDialogOpen, setIsQuestionDialogOpen] = useState(false);
  const [isErrorDialogOpen, setIsErrorDialogOpen] = useState(false);
  const [isResultDialogOpen, setIsResultDialogOpen] = useState(false);

  useEffect(() => {
    const gameRef = firebase.database().ref('games/' + gameId);
    gameRef.once('value', function(snapshot) {
      if (!snapshot.val()) {
        setIsErrorDialogOpen(true);
      } else {
        if (nickName != snapshot.val().creator) {
          const playerr = snapshot.val().players;
          if (!playerr.includes(nickName)) {
            const players = snapshot.val().players;
            const playersUpdated = [...players, nickName];
            gameRef.child('players').set(playersUpdated);
          }
        } else setIsCreator(true);
        setCreator(snapshot.val().creator);
        setBoardArr(snapshot.val().board);
      }
    });
  }, []);

  useEffect(() => {
    const gameRef = firebase.database().ref('games/' + gameId);
    gameRef.on('value', function(snapshot) {
      if (!snapshot.val()) {
        setIsErrorDialogOpen(true);
      } else {
        setGameState(snapshot.val().state);
        setPlayers(snapshot.val().players);
        if (snapshot.val().playersQueque) {
          setPlayersQueque(snapshot.val().playersQueque);
          setPositions(snapshot.val().positions);
        }
      }
    });
    return () => gameRef.off();
  }, []);

  useEffect(() => {
    //se non è vuoto question
    if (Object.entries(question).length != 0) {
      setIsQuestionDialogOpen(true);
    }
  }, [question]);

  if (redirect) {
    Game.setGameId(null);
    return <Redirect to="/home"></Redirect>;
  }

  if (!gameId) setRedirect(true);

  const startGame = () => {
    const gameRef = firebase.database().ref('games/' + gameId);
    let shuffled = shuffle(players);
    let positions = {};
    shuffled.map(player => {
      positions[player] = -1;
    });
    gameRef.child('playersQueque').set(shuffled);
    gameRef.child('positions').set(positions);
    gameRef.child('state').set(players[0] + 'R');
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
    let numb = Math.floor(Math.random() * 5) + 1;
    let pos = positions[nickName] + numb;
    if (positions[nickName] + numb >= boardArr.length) {
      pos = boardArr.length - 1;
    }
    const gameRef = firebase.database().ref('games/' + gameId);
    let update = { [nickName]: pos };
    gameRef.child('positions').update(update);
    gameRef.child('state').set(nickName + 'P');
  };
  const nextPlayer = () => {
    const gameRef = firebase.database().ref('games/' + gameId);
    let position = playersQueque.indexOf(nickName);

    if (position == playersQueque.length - 1) {
      position = -1;
    }
    gameRef.child('state').set(playersQueque[position + 1] + 'R');
  };

  const handleQuestion = () => {
    fetch('https://opentdb.com/api.php?amount=1&difficulty=easy&type=multiple')
      .then(res => res.json())
      .then(res => {
        setQuestion(res.results[0]);
        setAnswers(shuffle(answers));
      });
  };
  const handleDialogClose = () => {
    setIsQuestionDialogOpen(false);
  };

  const declareWinner = () => {
    const gameRef = firebase.database().ref('games/' + gameId);
    gameRef.child('state').set('winner');
    gameRef.child('winner').set(nickName);
  };

  const rightAnswer = () => {
    setQuestionResult('right');
    setIsResultDialogOpen(true);
    if (positions[nickName] === boardArr.length - 1) {
      declareWinner();
    } else {
      const gameRef = firebase.database().ref('games/' + gameId);
      gameRef.child('state').set(nickName + 'R');
      setQuestion({});
    }
  };
  const wrongAnswer = () => {
    setQuestionResult('wrong');
    setIsResultDialogOpen(true);
    nextPlayer();
    setQuestion({});
  };

  const showVictory = winner => {
    setWinner(winner);
    setQuestionResult('winner');
    setIsResultDialogOpen(true);
  };

  const handleCloseGame = () => {
    alert('chiudere il gioco se sei creator');
  };

  const QuestionDialog = () => {
    if (question.incorrect_answers) {
      let incorrAnsw = ['daelim', ...question.incorrect_answers];
      return (
        <Dialog
          open={isQuestionDialogOpen}
          onClose={handleDialogClose}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">{question.category}</DialogTitle>
          <DialogContent>{question.question}</DialogContent>
          <DialogActions>
            {answers.map((answ, i) => {
              if (answ === 1) {
                return (
                  <Button onClick={rightAnswer} color="primary" key={i}>
                    {question.correct_answer}
                  </Button>
                );
              } else {
                incorrAnsw.splice(0, 1);
                return (
                  <Button onClick={wrongAnswer} color="primary" key={i}>
                    {incorrAnsw[0]}
                  </Button>
                );
              }
            })}
          </DialogActions>
        </Dialog>
      );
    } else return null;
  };

  const ResultDialog = () => {
    switch (questionResult) {
      case 'right':
        return (
          <Dialog
            open={isResultDialogOpen}
            onClose={() => setIsErrorDialogOpen(false)}
            aria-labelledby="form-dialog-title"
          >
            <DialogTitle id="form-dialog-title">RISPOSTA ESATTA!</DialogTitle>
            <DialogActions>
              <Button
                onClick={() => setIsResultDialogOpen(false)}
                color="primary"
              >
                OK
              </Button>
            </DialogActions>
          </Dialog>
        );
        break;
      case 'wrong':
        return (
          <Dialog
            open={isResultDialogOpen}
            onClose={() => setIsErrorDialogOpen(false)}
            aria-labelledby="form-dialog-title"
          >
            <DialogTitle id="form-dialog-title">RISPOSTA ERRATA :(</DialogTitle>
            <DialogActions>
              <Button
                onClick={() => setIsResultDialogOpen(false)}
                color="primary"
              >
                OK
              </Button>
            </DialogActions>
          </Dialog>
        );
        break;
      case 'winner':
        return (
          <Dialog
            open={isResultDialogOpen}
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
        break;

      default:
        return null;
        break;
    }
  };

  switch (gameState) {
    case 'tostart':
      return (
        <div>
          <p>Benvenuti al gioco creato da {creator}</p>
          {isCreator && gameState == 'tostart' ? (
            <Button variant="contained" color="primary" onClick={startGame}>
              START
            </Button>
          ) : (
            <p>aspetta che il creatore inizi la partita :D</p>
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

    case nickName + 'P':
      return (
        <div>
          <p>Rispondi alla domanda!</p>
          <Board board={boardArr} positions={positions}></Board>
          <Button onClick={handleQuestion}>DOMANDA!</Button>
          <QuestionDialog></QuestionDialog>
          <ResultDialog></ResultDialog>
        </div>
      );
      break;

    case nickName + 'R':
      return (
        <div>
          <p>E' ora di lanciare il dado!</p>
          <Board board={boardArr} positions={positions}></Board>
          <Button onClick={nextToP}>ROLL!</Button>
          <ResultDialog></ResultDialog>
        </div>
      );
      break;

    case 'winner':
      const gameRef = firebase
        .database()
        .ref('games/' + gameId)
        .child('winner');
      gameRef.once('value', function(snapshot) {
        showVictory(snapshot.val());
      });
      return <ResultDialog></ResultDialog>;
      break;

    default:
      break;
  }

  return (
    <div>
      <p>Benvenuti al gioco creato da {creator}</p>
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
}
