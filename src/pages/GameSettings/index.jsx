import React, { Component } from 'react';


// Styles
import './styles.css';

// Router
import { Redirect } from 'react-router-dom'


// Components
import Button from '../../components/button';



class GameSettings extends Component {

    state = {
        gameRules: {
            rounds: null
        },
        redirect: false

    }

    constructor(props) {
        super(props);

        this.setRounds = this.setRounds.bind(this);
    }

    async setRounds(rounds) {
        await this.setState({ gameRules: { rounds } });

        await localStorage.setItem("game", JSON.stringify({
            rounds: this.state.gameRules.rounds
        }));

        this.setState({ redirect: true });

    }


    render() {
        if (this.state.redirect) {
            return <Redirect to="/ticTacToe" />
        } else {

            return (
                <div className="GameSettings">
                    <h1>Best of:</h1>
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
            );
        }
    }
}

export default GameSettings;