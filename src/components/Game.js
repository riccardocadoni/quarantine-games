import React, { useState, useEffect, useContext } from "react";
import firebase from "../firebase";
import { GameContext } from "../App";
import { Redirect } from "react-router-dom";
//components
import TriviaGame from "./TriviaGame";
import AccGame from "./AccGame";
import ErrorDialog from "./dialogs/ErrorDialog";

export default function Game() {
  const Game = useContext(GameContext);
  const gameId = Game.gameId;
  const nickName = Game.nickName;

  const [game, setGame] = useState();
  const [isErrorDialogOpen, setIsErrorDialogOpen] = useState(false);
  const [redirect, setRedirect] = useState(false);

  useEffect(() => {
    const gameRef = firebase.database().ref("games/" + gameId + "/game");
    gameRef.once("value", function(snapshot) {
      if (!snapshot.val()) {
        setIsErrorDialogOpen(true);
      } else {
        setGame(snapshot.val());
      }
    });
  }, []);

  if (redirect) {
    Game.setGameId(null);
    return <Redirect to="/home"></Redirect>;
  }
  if (!gameId) setRedirect(true);

  switch (game) {
    case "Trivia":
      return <TriviaGame></TriviaGame>;
      break;
    case "Acc":
      return <AccGame></AccGame>;
      break;
    default:
      break;
  }

  return (
    <ErrorDialog
      isErrorDialogOpen={isErrorDialogOpen}
      setRedirect={setRedirect}
    ></ErrorDialog>
  );
}
