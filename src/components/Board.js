import React from "react";
import { Grid } from "@material-ui/core";
//hooks
import { getBoardCard } from "../utils";

const Board = props => {
  const board = props.board;
  const pos = props.positions;
  return (
    <Grid container>
      {board.map((col, i) => {
        let players = [];
        for (let key in pos) {
          if (pos[key] === i) {
            players.push(key);
          }
        }
        return (
          <React.Fragment key={i}>
            <Grid item xs={4} md={2}>
              <Card color={col} players={players}></Card>
            </Grid>
          </React.Fragment>
        );
      })}
    </Grid>
  );
};

export default Board;

const Card = props => {
  let color = getBoardCard(props.color);

  if (color === "last") {
    color = "orange";
    return (
      <Grid
        container
        className="card"
        style={{ background: color }}
        justify="center"
        alignItems="center"
      >
        <h3>LAST ONE</h3>
        {props.players.map((player, i) => {
          return (
            <React.Fragment key={i}>
              <Grid item xs={6} className="player_in_card">
                {player}
              </Grid>
            </React.Fragment>
          );
        })}
      </Grid>
    );
  }

  return (
    <Grid
      container
      className="card"
      style={{ background: color }}
      justify="center"
      alignItems="center"
    >
      {color === "grey" ? (
        <h1 style={{ color: "white" }}>-2</h1>
      ) : (
        props.players.map((player, i) => {
          return (
            <React.Fragment key={i}>
              <Grid item xs={6} className="player_in_card">
                {player}
              </Grid>
            </React.Fragment>
          );
        })
      )}
    </Grid>
  );
};
