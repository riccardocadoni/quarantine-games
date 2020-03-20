import React from 'react';
import { Grid } from '@material-ui/core';

const Board = props => {
  const board = props.board;
  const pos = props.positions;
  return (
    <Grid container /* spacing={1} */>
      {board.map((col, i) => {
        let players = [];
        for (let key in pos) {
          if (pos[key] === i) {
            players.push(key);
          }
        }
        return (
          <React.Fragment key={i}>
            <Grid item xs={3}>
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
  let color = '';
  switch (props.color) {
    case 0:
      color = 'red';
      break;
    case 1:
      color = 'blue';
      break;
    case 2:
      color = 'white';
      break;
    case 3:
      color = 'black';
      break;
    case 4:
      color = 'green';
      break;
    case 5:
      color = 'orange';
      break;
    default:
      break;
  }
  return (
    <div className="card" style={{ background: color }}>
      {props.players}
    </div>
  );
};
