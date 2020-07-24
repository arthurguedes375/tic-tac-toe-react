import React, { Component } from 'react';


// Styles
import './styles.css';

// Router
import { Redirect } from 'react-router-dom'

// Components
import Button from '../../components/button';


// Services
import { gameData as game_data } from '../../services/data';



class GameSettings extends Component {

    state = {

        maxRounds: 1,

        redirect: false,
        nicknameP1: 'Player 1',
        nicknameP2: 'Player 2',

        inputP1: '',
        inputP2: '',

    }

    constructor(props) {
        super(props);

        this.setRounds = this.setRounds.bind(this);
    }

    setRounds(rounds) {
        this.setState({ maxRounds: rounds });
    }

    async start() {
        const maxRounds = this.state.maxRounds;
        const nicknameP1 = this.state.nicknameP1;
        const nicknameP2 = this.state.nicknameP2;

        const gameData = await game_data.generateData(maxRounds, nicknameP1, nicknameP2);
        await game_data.save(gameData);
        this.setState({ redirect: true });
    }

    componentDidMount() {
        const data = localStorage.getItem("game_data") ? game_data.load() : { p1: {}, p2: {} };
        const newState = {};
        if (data.p1.nickname && data.p1.nickname !== "Player 1") {
            newState.nicknameP1 = data.p1.nickname;
            newState.inputP1 = data.p1.nickname;
            newState.maxRounds = data.maxRounds;
        }

        if (data.p2.nickname && data.p2.nickname !== "Player 2") {
            newState.nicknameP2 = data.p2.nickname;
            newState.inputP2 = data.p2.nickname;
            newState.maxRounds = data.maxRounds;
        }

        this.setState(newState);

        localStorage.removeItem("game_data")
    }


    render() {
        if (this.state.redirect) {
            return <Redirect to="/ticTacToe" />
        } else {

            return (
                <div className="GameSettings">
                    <div className="rounds">
                        <h1>Rounds: </h1>
                        <ul>
                            <li>
                                <Button onClick={() => this.setRounds(1)} value="1" />
                            </li>

                            <li>
                                <Button onClick={() => this.setRounds(3)} value="3" />
                            </li>

                            <li>
                                <Button onClick={() => this.setRounds(5)} value="5" />
                            </li>
                        </ul>
                    </div>
                    <div className="players">
                        <div>
                            <h1>Player 1: </h1>
                            <input type="text" placeholder="Name..." className="inputNickname" onChange={(e) => this.setState({ inputP1: e.target.value, nicknameP1: e.target.value })} value={this.state.inputP1} />
                        </div>

                        <div>
                            <h1>Player 2: </h1>
                            <input type="text" placeholder="Name..." className="inputNickname" onChange={(e) => this.setState({ inputP2: e.target.value, nicknameP2: e.target.value })} value={this.state.inputP2} />
                        </div>
                    </div>
                    <div>
                        <Button onClick={() => this.start()} value="Start!" />
                    </div>
                </div>
            );
        }
    }
}

export default GameSettings;