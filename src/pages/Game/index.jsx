import React, { Component } from 'react';

// Alerts
import Swal from 'sweetalert2';

// Styles
import './styles.css';

// Bootstrap
import '../../assets/lib/bootstrap.min.css';

// Router
import { Redirect, Link } from 'react-router-dom';

// Components
import Board from '../../components/board';
import Field from '../../components/field';
import Button from '../../components/button';


// Services
import { gameData as game_data } from '../../services/data';
import { themes } from '../../services/themes';



class Game extends Component {

    state = {
        game: {
            p1: {
                nickname: "",
            },
            p2: {
                nickname: "",
            }
        },


        board: ['', '', '', '', '', '', '', '', ''],
        symbols: {
            options: ['X', 'O'],
            turn_index: Math.round(Math.random(0, 1)),
            change() {
                this.turn_index = (this.turn_index === 0) ? 1 : 0;
            }
        },

        winning_sequences: [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6]
        ],
        gameover: false,

        redirect: false

    }

    constructor(props) {
        super(props);

        this.make_play = this.make_play.bind(this);
        this.check_winning_sequences = this.check_winning_sequences.bind(this);
        this.check_tied = this.check_tied.bind(this);
        this.alert = this.alert.bind(this);
        this.scoreBoard = this.scoreBoard.bind(this);
        this.start = this.start.bind(this);
    }

    componentDidMount() {
        const game = game_data.load();
        this.setState({ game });
        themes.loadThemes();
    }



    async make_play(position) {

        if (this.state.gameover) return false;
        if (this.state.board[position] === '') {
            const board = this.state.board;
            board[position] = this.state.symbols.options[this.state.symbols.turn_index];
            this.setState({ board })
            const check_winning_sequences_index = this.check_winning_sequences(this.state.symbols.options[this.state.symbols.turn_index])
            if (check_winning_sequences_index >= 0) {
                this.setState({ gameover: true })

                const state = this.state;

                const last_round = {
                    roundNumber: state.game.roundNumber,
                    winner: {
                        player: (state.symbols.options[state.symbols.turn_index] === "X") ? 1 : 2,
                    }
                }

                const nextGameStatus = game_data.nextRound(last_round);
                if (nextGameStatus.gameover === true) {
                    const data = {
                        title: `Winner: ${(nextGameStatus.winner === 1) ? nextGameStatus.p1.nickname : nextGameStatus.p2.nickname}`,
                        text: `
                        <strong>${this.state.game.p1.nickname}</strong>: ${nextGameStatus.p1.score}<br>
                        <strong>${this.state.game.p2.nickname}</strong>: ${nextGameStatus.p2.score}<br><br>

                        Settings?
                        
                        `,
                        icon: 'success',
                        confirmText: 'Yes!',
                        confirmValue: () => this.setState({ redirect: true }),
                        canceledValue() { }
                    }
                    setTimeout(() => this.alert(data), 150);
                } else {
                    await game_data.save(nextGameStatus)

                    let timerInterval;
                    Swal.fire({
                        title: 'Next round',
                        html: 'Next round in <b></b> milliseconds.',
                        timer: 700,
                        timerProgressBar: true,
                        onBeforeOpen: () => {
                            Swal.showLoading()
                            timerInterval = setInterval(() => {
                                const content = Swal.getContent()
                                if (content) {
                                    const b = content.querySelector('b')
                                    if (b) {
                                        b.textContent = Swal.getTimerLeft()
                                    }
                                }
                            }, 100)
                        },
                        onClose: () => {
                            clearInterval(timerInterval)
                            this.start()
                        }
                    }).then((result) => {
                        /* Read more about handling dismissals below */
                        if (result.dismiss === Swal.DismissReason.timer) {
                            // console.log('I was closed by the timer')
                        }
                    })

                }



            } else {
                this.state.symbols.change();
                if (this.check_tied()) {
                    this.setState({ gameover: true })


                    const data = {
                        title: 'We Tied',
                        text: 'Restart?',
                        icon: 'info',
                        confirmText: 'Yes!',
                        cancelText: 'No!',
                        confirmValue() { },
                        canceledValue() { }
                    }

                    setTimeout(() => this.alert(data), 150);
                }
            }
            return true;
        } else {
            return false;
        }
    }



    check_winning_sequences(symbol) {

        let returned = -1;

        // eslint-disable-next-line
        this.state.winning_sequences.map((value, i) => {
            if (this.state.board[this.state.winning_sequences[i][0]] === symbol &&
                this.state.board[this.state.winning_sequences[i][1]] === symbol &&
                this.state.board[this.state.winning_sequences[i][2]] === symbol) {
                returned = i;
            }
        });
        return returned;
    }

    // If tied return true
    check_tied() {
        let returned = true;

        // eslint-disable-next-line
        this.state.board.map((value, i) => {
            if (this.state.board[i] === '') returned = false;
        });
        return returned;
    }

    alert(data) {
        const swalWithBootstrapButtons = Swal.mixin({
            customClass: {
                confirmButton: 'btn btn-success confirmBtn',
                cancelButton: 'btn btn-secondary cancelBtn'
            },
            buttonsStyling: false
        })

        swalWithBootstrapButtons.fire({
            title: data.title,
            html: data.text,
            icon: data.icon,
            showCancelButton: (data.cancelText) ? true : false,
            confirmButtonText: data.confirmText,
            cancelButtonText: data.cancelText,
            reverseButtons: true
        }).then((result) => {
            if (result.value) {
                // Accept
                this.start();
                data.confirmValue();
            } else if (result.dismiss === Swal.DismissReason.cancel) {
                // Canceled
                data.canceledValue();
            }

        })
    }

    scoreBoard() {
        const game = game_data.load();
        alert(`
            ${game.p1.nickname}: ${game.p1.score}
            ${game.p2.nickname}: ${game.p2.score}
        `);
    }




    start() {

        const symbols = this.state.symbols;
        let board = this.state.board;
        symbols.turn_index = Math.round(Math.random(0, 1));
        board.fill('');

        this.setState({ symbols, board, gameover: false });
    }



    render() {
        if (this.state.redirect) {
            return <Redirect to="/" />
        } else {
            return (
                <div className="Game">

                    <h1 className="player">Turn: {(this.state.symbols.options[this.state.symbols.turn_index] === "X") ? this.state.game.p1.nickname : this.state.game.p2.nickname} ({this.state.symbols.options[this.state.symbols.turn_index]})</h1>

                    <Board>
                        {this.state.board.map((value, index) =>
                            <Field key={index} click={() => this.make_play(index)}>{value}</Field>)
                        }
                    </Board>
                    <div className="buttons">
                        <Link to="/"><Button value="Settings" /></Link>
                        <Button onClick={() => this.scoreBoard()} value="Score Board" />
                        <Button onClick={() => this.start()} value="Restart" />
                    </div>
                </div>
            );
        }
    }
}

export default Game;