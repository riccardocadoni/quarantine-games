import React from 'react';
import { Grid } from '@material-ui/core';

const Board = props => {
  const board = props.board;
  const pos = props.positions;
  return (
    <Grid container >
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
  let color = '';
  switch (props.color) {
    case 0:
      color = 'yellow';
      break;
    case 1:
      color = 'blue';
      break;
    case 2:
      color = 'brown';
      break;
    case 3:
      color = 'pink';
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
    <Grid container className="card" style={{ background: color }} 
    justify="center"
    alignItems="center"
   >
      {props.players.map((player,i)=>{
        return(
          <React.Fragment key={i}>
          <Grid item xs={6}  className="player_in_card">
          {player}
          </Grid>
        </React.Fragment>)
        
      })}
   
  </Grid>
    
  );
};
