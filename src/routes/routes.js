import React from 'react';
import Home from '../components/Home';
import Game from '../components/Game';

//NORMAL USERS ROUTES
export const routes = [
  { name: 'Home', path: '/home', exact: true, main: () => <Home /> },
  { name: 'Game', path: '/game', exact: true, main: () => <Game /> }
];
