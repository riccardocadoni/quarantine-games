import React from "react";
import {
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody
} from "@material-ui/core";

export default function ResultTable({
  players,
  elements,
  generalResult,
  isCreator,
  addPoint,
  gameRef
}) {
  const leftClick = (player, el, e) => {
    if (e.target.style.background === "green") {
      e.target.style.background = "";
      gameRef
        .child("results")
        .child(player)
        .child(el)
        .update({ 1: 0 });
      addPoint(player, -10);
      return;
    }
    if (e.target.style.background === "orange") {
      return;
    }
    e.target.style.background = "green";
    gameRef
      .child("results")
      .child(player)
      .child(el)
      .update({ 1: 10 });
    addPoint(player, 10);
  };

  const rightClick = (player, el, e) => {
    if (e.target.style.background === "green") {
      return;
    }
    if (e.target.style.background === "orange") {
      e.target.style.background = "";
      gameRef
        .child("results")
        .child(player)
        .child(el)
        .update({ 1: 0 });
      addPoint(player, -5);
      return;
    }
    e.target.style.background = "orange";
    gameRef
      .child("results")
      .child(player)
      .child(el)
      .update({ 1: 5 });
    addPoint(player, 5);
  };

  return (
    <TableContainer>
      <Table aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell></TableCell>
            {elements.map(el => {
              return (
                <TableCell align="right" key={el}>
                  {el}
                </TableCell>
              );
            })}
          </TableRow>
        </TableHead>
        <TableBody>
          {players.map(player => (
            <TableRow key={player}>
              <TableCell component="th" scope="row">
                {player}
              </TableCell>
              {elements.map(el => {
                let color = "";
                if (
                  generalResult[player] &&
                  generalResult[player][el] &&
                  generalResult[player][el][1] === 10
                ) {
                  color = "green";
                }
                if (
                  generalResult[player] &&
                  generalResult[player][el] &&
                  generalResult[player][el][1] === 5
                ) {
                  color = "orange";
                }
                return isCreator ? (
                  <TableCell
                    align="right"
                    key={el}
                    style={{ background: color }}
                    onClick={e => {
                      leftClick(player, el, e);
                    }}
                    onContextMenu={e => {
                      e.preventDefault();
                      rightClick(player, el, e);
                    }}
                  >
                    {generalResult[player] && generalResult[player][el]
                      ? generalResult[player][el][0]
                      : null}
                  </TableCell>
                ) : (
                  <TableCell
                    align="right"
                    key={el}
                    style={{ background: color }}
                  >
                    {generalResult[player] && generalResult[player][el]
                      ? generalResult[player][el][0]
                      : null}
                  </TableCell>
                );
              })}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
