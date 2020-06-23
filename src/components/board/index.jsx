import React, { Component } from 'react';

import './styles.css';

class Board extends Component {
    render() {
        return (
            <div className="board">
                {this.props.children}
            </div>
        );
    }
}

export default Board;