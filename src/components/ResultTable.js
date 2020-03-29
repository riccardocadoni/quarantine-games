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
  addPoint
}) {
  const leftClick = (player, e) => {
    if (e.target.style.background === "green") {
      return;
    }
    if (e.target.style.background === "red") {
      return;
    }
    e.target.style.background = "green";
    addPoint(player, 10);
  };

  const rightClick = (player, e) => {
    if (e.target.style.background === "green") {
      return;
    }
    if (e.target.style.background === "red") {
      return;
    }
    e.target.style.background = "red";
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
                return isCreator ? (
                  <TableCell
                    align="right"
                    key={el}
                    onClick={e => {
                      leftClick(player, e);
                    }}
                    onContextMenu={e => {
                      rightClick(player, e);
                    }}
                  >
                    {generalResult[player] ? generalResult[player][el] : null}
                  </TableCell>
                ) : (
                  <TableCell align="right" key={el}>
                    {generalResult[player] ? generalResult[player][el] : null}
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
