import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import {
    Typography,
} from '@material-ui/core';

class Home extends Component {
    render() {
        return (
            <div className="App">
                <br />
                <Typography variant="h4">Página Inicial</Typography>
                <br />
                <Link to={'./Jogadores'}>
                    <button variant="raised">
                        Lista de Jogadores
                    </button>
                </Link>
            </div>
        );
    }
}
export default Home;