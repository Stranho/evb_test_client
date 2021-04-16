import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import './App.css';
import Home from './pages/Home';
import Jogadores from './pages/Jogadores';
import Jogador from './pages/Jogador';
import {
  AppBar,
  Toolbar,
  Typography,
} from '@material-ui/core';
import {
  CssBaseline,
  withStyles,
} from '@material-ui/core';
import { Fragment } from 'react';

const styles = theme => ({
  main: {
    padding: theme.spacing(3),
    [theme.breakpoints.down('xs')]: {
      padding: theme.spacing(2),
    },
  },
});

class App extends Component {
  render() {
    const App = ({ classes }) => (
      <Fragment>
        <CssBaseline />
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" color="inherit" align="center">
              Projeto Teste FullStack
            </Typography>
          </Toolbar>
        </AppBar>

        <div>
          <Switch>
            <Route exact path='/' component={Home} />
            <Route exact path='/Jogadores/:id' component={Jogador} />
            <Route path='/Jogadores' component={Jogadores} />
          </Switch>
        </div>
      </Fragment>

    )
    return (
      <Switch>
        <App />
      </Switch>
    );
  }
}

export default withStyles(styles)(App);
