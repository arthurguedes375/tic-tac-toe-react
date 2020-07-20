import React, { Component } from 'react';

// Alerts
import Swal from 'sweetalert2';

// Styles
import './styles.css';

// Bootstrap
import '../../assets/lib/bootstrap.min.css';

// Components
import Board from '../../components/board';
import Field from '../../components/field';
import Button from '../../components/button';

class Game extends Component {

    state = {

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

    }

    constructor(props) {
        super(props);

        this.make_play = this.make_play.bind(this);
        this.check_winning_sequences = this.check_winning_sequences.bind(this);
        this.check_tied = this.check_tied.bind(this);
        this.start = this.start.bind(this);
        this.alert = this.alert.bind(this);
    }


    make_play(position) {

        if (this.state.gameover) return false;
        if (this.state.board[position] === '') {
            const board = this.state.board;
            board[position] = this.state.symbols.options[this.state.symbols.turn_index];
            this.setState({ board })
            const check_winning_sequences_index = this.check_winning_sequences(this.state.symbols.options[this.state.symbols.turn_index])
            if (check_winning_sequences_index >= 0) {
                this.setState({ gameover: true })

                const data = {
                    title: `Winner: ${this.state.symbols.options[this.state.symbols.turn_index]}`,
                    text: 'Restart?',
                    icon: 'success',
                    confirmText: 'Yes!',
                    cancelText: 'No!',
                    canceledValue() { }

                }

                setTimeout(() => this.alert(data), 150);


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
        console.log(this.state.winning_sequences);

        let returned = -1;

        this.state.winning_sequences.map((value, i) => {
            if (this.state.board[this.state.winning_sequences[i][0]] === symbol &&
                this.state.board[this.state.winning_sequences[i][1]] === symbol &&
                this.state.board[this.state.winning_sequences[i][2]] === symbol) {
                console.log("Sequencia vencedora: " + i);
                returned = i;
            }
        });
        return returned;
    }

    // If tied return true
    check_tied() {
        console.log(this.state.board);
        let returned = true;
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
            text: data.text,
            icon: data.icon,
            showCancelButton: true,
            confirmButtonText: data.confirmText,
            cancelButtonText: data.cancelText,
            reverseButtons: true
        }).then((result) => {
            if (result.value) {
                // Accept
                this.start()
            } else if (result.dismiss === Swal.DismissReason.cancel) {
                // Canceled
                data.canceledValue();
            }

        })
    }

    start() {

        const symbols = this.state.symbols;
        let board = this.state.board;
        symbols.turn_index = Math.round(Math.random(0, 1));
        board.fill('');

        this.setState({ symbols, board, gameover: false });
    }



    render() {
        return (
            <div className="Game">
                <h1 className="player">Player: {this.state.symbols.options[this.state.symbols.turn_index]}</h1>
                <Board>
                    {this.state.board.map((value, index) =>
                        <Field key={index} click={() => this.make_play(index)}>{value}</Field>)
                    }
                </Board>
                <Button onClick={() => this.start()} value="Restart" />
            </div>
        );
    }
}

export default Game;