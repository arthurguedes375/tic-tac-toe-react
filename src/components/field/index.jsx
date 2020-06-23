import React, { Component } from 'react';

import './styles.css';

class field extends Component {
    render() {
        return (
            <div className="field" onClick={this.props.click}>
                {this.props.children}
            </div>
        );
    }
}

export default field;