import React, { useState, useContext } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect
} from 'react-router-dom';
import Game from './components/Game';
import { routes } from './routes/routes';
import { Container } from '@material-ui/core';
import './App.css';
import Board from './components/Board';

export const GameContext = React.createContext(null);

function App() {
  const [gameId, setGameId] = useState(null);
  const [nickName, setNickName] = useState(null);
  return (
    <GameContext.Provider value={{ gameId, setGameId, nickName, setNickName }}>
      <div className="App">
        <Container style={{ padding: 0, maxWidth: 2000 }}>
          <Router>
            {gameId ? (
              <Switch>
                <Route
                  key={'/game'}
                  path={'/game'}
                  exact={true}
                  component={() => <Game />}
                />
                <Redirect from="/" to="/game" />
              </Switch>
            ) : (
              <Switch>
                {routes.map(route => (
                  <Route
                    key={route.path}
                    path={route.path}
                    exact={route.exact}
                    component={route.main}
                  />
                ))}
                <Redirect from="/" to="/home" />
              </Switch>
            )}
          </Router>
        </Container>
      </div>
    </GameContext.Provider>
  );
}

export default App;

{
  /* <GameContext.Provider value={{ gameId, setGameId, nickName, setNickName }}>
      <div className="App">
        <Container style={{ padding: 0, maxWidth: 2000 }}>
          <Router>
            {gameId ? (
              <Switch>
                <Route
                  key={'/game'}
                  path={'/game'}
                  exact={true}
                  component={() => <Game />}
                />
                <Redirect from="/" to="/game" />
              </Switch>
            ) : (
              <Switch>
                {routes.map(route => (
                  <Route
                    key={route.path}
                    path={route.path}
                    exact={route.exact}
                    component={route.main}
                  />
                ))}
                <Redirect from="/" to="/home" />
              </Switch>
            )}
          </Router>
        </Container>
      </div>
    </GameContext.Provider> */
}
