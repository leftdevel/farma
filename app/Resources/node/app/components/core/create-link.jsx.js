/*jshint esnext: true */
import React, {PropTypes} from 'react';

class CreateLink extends React.Component {
    constructor() {
        super();
        this._onClick = this._onClick.bind(this);
    }

    render() {
        return (
            <div className="float right">
                <a href="#" onClick={this._onClick} className="waves-effect waves-light">{this.props.title}</a>
                &nbsp;
                <a href="#" onClick={this._onClick} className="btn-floating btn-large waves-effect waves-light light-blue darken-3">
                    <i className="mdi-content-add"></i>
                </a>
            </div>
        );
    }

    _onClick(event) {
        event.preventDefault();
        this.props.clickHandler();
    }
}

CreateLink.propTypes = {
    title: PropTypes.string.isRequired,
    clickHandler: PropTypes.func.isRequired
};

export default CreateLink;
