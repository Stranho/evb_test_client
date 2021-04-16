import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import {
    Typography,
    DialogTitle,
    Dialog,
    Select,
    FormControl,
    InputLabel,
    MenuItem,
    TextField,
    Backdrop,
    Paper,
    TablePagination,
    TableContainer
} from '@material-ui/core';
import {
    Alert
} from '@material-ui/lab';
import SwapHorizontalCircleIcon from '@material-ui/icons/SwapHorizontalCircle';
import { green } from '@material-ui/core/colors';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';

import Table from '../components/Table';

class Jogadores extends Component {
    // Initialize the state
    constructor(props) {
        super(props);
        this.getList = this.getList.bind(this);
        this.dialogClose = this.dialogClose.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleNumberInput = this.handleNumberInput.bind(this);
        this.handleBackDropClose = this.handleBackDropClose.bind(this);
        this.dialogTransferClick = this.dialogTransferClick.bind(this);
        this.newPlayerConfirmClick = this.newPlayerConfirmClick.bind(this);
        this.state = {
            baseHost: 'https://evb-test.herokuapp.com',
            transferDialogOpen: false,
            newPlayerDialogOpen: false,
            newPlayerName: '',
            backDropOpen: false,
            idOrigem: 0,
            idDestino: '',
            valorDestino: 1,
            list: [],
            rowsPerPage: 5,
            page: 0,
            jogadorSelecionado: {},
            columns: [{
                Header: 'Nome',
                id: 'nome',
                Cell: ({ row }) => this.renderCellName(row),
            },
            {
                Header: 'Saldo',
                id: 'saldo',
                accessor: 'saldo',
            },
            {
                Header: 'Operações',
                Cell: ({ row }) => this.renderCellButton(row),
                width: 64,
            }
            ]
        }
    }

    componentDidMount() {
        this.getList();
    }

    // Retorna a lista do express
    getList() {
        fetch(`${this.state.baseHost}/Jogadores`)
            .then(res => res.json())
            .then(list => this.setState({ list }))
    }

    renderCellName(row) {
        return <Link to={`/Jogadores/${row.original.id}`} >{row.original.nome}</Link>
    }

    renderCellButton(row) {
        return <div><button onClick={() => this.transferButtonClick(row.original.id)} ><SwapHorizontalCircleIcon style={{ color: green[500] }} /></button></div>
    }

    transferButtonClick(id) {
        this.setState({ transferDialogOpen: true, idOrigem: id });
    }

    dialogClose() {
        this.getList();
        this.setState({ transferDialogOpen: false, newPlayerDialogOpen: false, idOrigem: 0, idDestino: 0, valorDestino: 0, newPlayerName: '' });
    }

    dialogTransferClick() {
        const located = this.state.list.find((item) => item.id === this.state.idOrigem)
        if (this.state.idDestino === 0) return;

        if (located && located.saldo > this.state.valorDestino) {
            const data = {
                idOrigem: this.state.idOrigem,
                idDestino: this.state.idDestino,
                valor: this.state.valorDestino
            };
            fetch(`${this.state.baseHost}/Transfers`, {
                method: 'post', headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }, body: JSON.stringify(data)
            }).then(() => this.dialogClose());
        } else {
            this.setState({ backDropOpen: true, transferDialogOpen: false });
        }
    }

    newPlayerConfirmClick() {
        const data = {
            nome: this.state.newPlayerName,
            saldo: 10
        };
        fetch(`${this.state.baseHost}/Jogadores`, {
            method: 'post', headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }, body: JSON.stringify(data)
        }).then(() => this.dialogClose());
    }

    handleChange(e) {
        this.setState({ [e.target.name]: e.target.value });
    }

    handleNumberInput(e) {
        if (e.target.validity.valid || e.target.value === '')
            this.setState({ valorDestino: e.target.value });
    }

    handleBackDropClose() {
        this.setState({ backDropOpen: false, transferDialogOpen: true });
    }

    render() {
        const { list, columns, transferDialogOpen, newPlayerDialogOpen, rowsPerPage, page } = this.state;

        return (
            <div className="App">
                <br />
                <Typography variant="h4">Lista de Jogadores</Typography>

                {/* Checa para ver se possui jogadores */}
                {list.length ? (
                    <div>
                        <br />
                        {/* Exibe a lista de jogadores */}
                        <Paper>
                        <TableContainer>
                        <Table columns={columns} data={list} page={page} rowsPerPage={rowsPerPage} />
                        <TablePagination
                                    rowsPerPageOptions={[5, 10, 25]}
                                    component="div"
                                    count={list.length}
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

                        {/* <Paper>
                            <TableContainer>
                                <RTable>
                                    <TableHead>
                                        <TableRow>
                                            {columns.map((column) => (
                                                <TableCell
                                                    key={column.id}
                                                    align={column.align}
                                                    style={{ minWidth: column.minWidth }}
                                                >
                                                    {column.Header}
                                                </TableCell>
                                            ))}
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {list.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                                            return (
                                                <TableRow hover role="checkbox" tabIndex={-1} key={row.code}>
                                                    {columns.map((column) => {
                                                        const value = row[column.id];
                                                        return (
                                                            <TableCell key={column.id} align={column.align}>
                                                                {column.format && typeof value === 'number' ? column.format(value) : value }
                                                            </TableCell>
                                                        );
                                                    })}
                                                </TableRow>
                                            );
                                        })}
                                    </TableBody>                                
                                </RTable>
                                <TablePagination
                                    rowsPerPageOptions={[5, 10, 25]}
                                    component="div"
                                    count={list.length}
                                    rowsPerPage={rowsPerPage}
                                    page={page}
                                    onChangePage={(event, newPage) => { this.setState({ page: newPage }) }}
                                    onChangeRowsPerPage={(event) => {
                                        this.setState({ rowsPerPage: parseInt(event.target.value, 10) });
                                        this.setState({ page: 0 });
                                    }}
                                />
                            </TableContainer>
                        </Paper> */}
                    </div>
                ) : (
                    <div>
                        <Typography variant="h2">Nenhum jogador encontrado.</Typography>
                    </div>
                )
                }
                <br />
                <table>
                    <tr>
                        <td>
                            <button variant="raised" onClick={() => this.setState({ newPlayerDialogOpen: true })}>
                                <AddCircleOutlineIcon color='primary' /> <span style={{ display: 'flex', alignItems: 'center' }}>Novo</span>
                            </button>
                        </td>
                        <td>
                            <Link to={'/'}>
                                <button variant="raised">
                                    <ArrowBackIcon color='primary' /> <span style={{ display: 'flex', alignItems: 'center' }}>Voltar</span>
                                </button>
                            </Link>
                        </td>
                    </tr>
                </table>

                <Dialog onClose={this.dialogClose} open={transferDialogOpen} maxWidth='sm' fullWidth={true}>
                    <DialogTitle id="transfer-dialog">Fazer Transferências</DialogTitle>
                    <table>
                        <tr>
                            <td width='70%'>
                                <FormControl required={true} fullWidth={true}>
                                    <InputLabel id="fcDestino">Jogador</InputLabel>
                                    <Select
                                        labelId="fcDestino"
                                        id="idDestino"
                                        name='idDestino'
                                        value={this.state.idDestino}
                                        onChange={this.handleChange}
                                        error={this.state.idDestino === 0}
                                    >
                                        {list.map((jogador) => {
                                            return jogador.id !== this.state.idOrigem && <MenuItem value={jogador.id}>{jogador.nome}</MenuItem>
                                        })}
                                    </Select>
                                </FormControl>
                            </td><td>
                                <FormControl>
                                    <TextField label='Valor'
                                        id='valorDestino'
                                        name='valorDestino'
                                        value={this.state.valorDestino}
                                        onChange={this.handleNumberInput}
                                        type='tel'
                                        error={this.state.valorDestino < 1}
                                        inputProps={{ pattern: "[0-9]*" }}
                                    ></TextField>
                                </FormControl>
                            </td>
                        </tr>
                        <tr>
                            <td><button onClick={this.dialogTransferClick} >Transferir</button>
                                <button onClick={() => this.setState({ transferDialogOpen: false })}>Cancelar</button>
                            </td>
                        </tr>
                    </table>
                </Dialog>
                <Backdrop open={this.state.backDropOpen} onClick={this.handleBackDropClose} style={{ zIndex: 99 }} >
                    <Alert severity="error" style={{ zIndex: 99 }}>Saldo insuficiente!</Alert>
                </Backdrop>

                <Dialog onClose={this.dialogClose} open={newPlayerDialogOpen} maxWidth='sm' fullWidth={true}>
                    <DialogTitle id="new-player-dialog">Novo Jogador</DialogTitle>
                    <FormControl>
                        <TextField label='Nome'
                            id='newPlayerName'
                            name='newPlayerName'
                            onChange={this.handleChange}
                            value={this.state.newPlayerName}
                            error={this.state.newPlayerName === ''}
                        ></TextField>
                    </FormControl>
                    <table width='100%'>
                        <th>
                            <td width='50%'>
                                <button onClick={this.newPlayerConfirmClick} >Confirmar</button>
                            </td>
                            <td>
                                <button onClick={() => this.setState({ newPlayerDialogOpen: false })}>Cancelar</button>
                            </td>
                        </th>
                    </table>
                </Dialog>
            </div>
        );
    }
}

export default Jogadores;