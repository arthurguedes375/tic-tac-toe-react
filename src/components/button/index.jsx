import React, { Component } from 'react';

import './styles.css';

class Button extends Component {
    render() {
        return (
            <input onClick={this.props.onClick} type="button" className="btnRst" value={this.props.value} />
        );
    }
}

export default Button;