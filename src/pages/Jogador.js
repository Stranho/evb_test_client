import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import {
    Typography,
    Paper,
    TablePagination,
    TableContainer
} from '@material-ui/core';

import CancelIcon from '@material-ui/icons/Cancel';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import Table from '../components/Table';

class Jogador extends Component {
    // Initialize the state
    constructor(props) {
        super(props);
        this.state = {
            baseHost: 'https://evb-test.herokuapp.com',
            jogador: {},
            transferencias: { received: [], made: [] },
            rowsPerPage: 5,
            page: 0,
            columns: [{
                Header: 'Nome',
                accessor: 'nome',
            },
            {
                Header: 'Valor',
                accessor: 'valor',
            },
            {
                Header: 'Data',
                Cell: ({ row }) => new Date(row.original.data_operacao).toLocaleDateString('pt-BR'),
            },
            {
                Header: 'Situação',
                Cell: ({ row }) => row.original.operacao_cancelada ? 'Cancelada' : 'Ativa',
            },
            {
                Header: 'Operações',
                Cell: ({ row }) => this.renderCellButton(row),
                width: 64,
            }
            ]

        }
    }

    renderCellButton(row) {
        return (row.original.jogador_origem === this.state.jogador.id && !row.original.operacao_cancelada) && <div><button onClick={() => this.cancelClickEvent(row.original.id)}><CancelIcon color='secondary' /></button></div>
    }

    cancelClickEvent(id) {
        fetch(`${this.state.baseHost}/Transfers/${id}`, { method: 'delete' }).then(() => this.getOne(this.state.jogador.id));
    }

    componentDidMount() {
        //console.log(this.props);
        this.getOne(this.props.match.params.id);
    }

    // Retorna a lista do express
    getOne = (id) => {
        fetch(`${this.state.baseHost}/Jogadores/${id}`)
            .then(res => res.json())
            .then(jogador => this.setState({ jogador }));
        fetch(`${this.state.baseHost}/Transfers/${id}`)
            .then(res => res.json())
            .then(transferencias => this.setState({ transferencias }));
    }

    render() {
        const { jogador, transferencias, columns, page, rowsPerPage } = this.state;

        return (
            <div className="App">
                <br />
                <Typography variant="h4">{jogador.nome}</Typography>
                <Typography variant="h3">{jogador.saldo}</Typography>

                {/* Checa para ver se recebeu alguma transferencia */}
                {transferencias.received.length ? (
                    <div>
                        <br />
                        {/* Exibe a lista de jogadores */}
                        <Typography variant="h5">Transferências recebidas</Typography>
                        <Paper>
                            <TableContainer>
                                <Table columns={columns} data={transferencias.received} page={page} rowsPerPage={rowsPerPage} />
                                <TablePagination
                                    rowsPerPageOptions={[5, 10, 25]}
                                    component="div"
                                    count={transferencias.received.length}
                                    rowsPerPage={rowsPerPage}
                                    page={page}
                                    onChangePage={(event, newPage) => { this.setState({ page: newPage }) }}
                                    onChangeRowsPerPage={(event) => {
                                        this.setState({ rowsPerPage: parseInt(event.target.value, 10) });
                                        this.setState({ page: 0 });
                                    }}
                                />
                            </TableContainer>
                        </Paper>
                    </div>
                ) : (
                    <div>
                        <Typography variant="h5">Nenhuma transferência recebida.</Typography>
                    </div>
                )
                }

                {/* Checa para ver se realizou alguma transferencia */}
                {transferencias.made.length ? (
                    <div>
                        <br />
                        {/* Exibe a lista de jogadores */}
                        <Typography variant="h5">Transferências realizadas</Typography>
                        <Paper>
                            <TableContainer>
                                <Table columns={columns} data={transferencias.made} page={page} rowsPerPage={rowsPerPage} />
                                <TablePagination
                                    rowsPerPageOptions={[5, 10, 25]}
                                    component="div"
                                    count={transferencias.made.length}
                                    rowsPerPage={rowsPerPage}
                                    page={page}
                                    onChangePage={(event, newPage) => { this.setState({ page: newPage }) }}
                                    onChangeRowsPerPage={(event) => {
                                        this.setState({ rowsPerPage: parseInt(event.target.value, 10) });
                                        this.setState({ page: 0 });
                                    }}
                                />
                            </TableContainer>
                        </Paper>

                    </div>
                ) : (
                    <div>
                        <Typography variant="h5">Nenhuma transferência realizada.</Typography>
                    </div>
                )
                }

                <br />
                <Link to={'./'}>
                    <button variant="raised">
                        <ArrowBackIcon color='primary' /> <span style={{ display: 'flex', alignItems: 'center' }}>Voltar</span>
                    </button>
                </Link>
            </div>
        );
    }
}

export default Jogador;