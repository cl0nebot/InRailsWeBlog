'use strict';

var Button = React.createClass({
    propTypes: {
        children: React.PropTypes.string.isRequired,
        onClickButton: React.PropTypes.func,
        tooltip: React.PropTypes.string,
        icon: React.PropTypes.string,
        iconPosition: React.PropTypes.string,
        id: React.PropTypes.string
    },

    getDefaultProps () {
        return {
            onClickButton: null,
            tooltip: null,
            icon: null,
            id: null,
            iconPosition: 'right'
        };
    },

    getInitialState() {
        return {
            disabled: false
        };
    },

    componentDidMount () {
        if(this.state.tooltip) {
            let selector = '.tooltipped' + (this.props.id ? '#' + this.props.id : '');
            $(selector).tooltip();
        }
    },

    componentDidUpdate () {
        if(this.props.tooltip) {
            let selector = '.tooltipped' + (this.props.id ? '#' + this.props.id : '');
            $(selector).tooltip();
        }
    },

    toggleButton() {
        this.setState({disabled: !this.state.disabled});
    },

    _renderIcon () {
        if (this.props.icon) {
            return (
                <i className={`material-icons ${this.props.iconPosition}`}>{this.props.icon}</i>
            )
        }
    },

    render () {
        if(this.props.tooltip) {
            return (
                <button className="btn waves-effect waves-light tooltipped"
                        id={this.props.id}
                        type="submit"
                        method="post"
                        onClick={this.props.onClickButton}
                        data-position="bottom"
                        data-delay="50"
                        data-tooltip={this.props.tooltip}
                        disabled={this.state.disabled} >
                    {this._renderIcon()}
                    {this.props.children}
                </button>
            );
        } else {
            return (
                <button className="btn waves-effect waves-light"
                        type="submit"
                        method="post"
                        onClick={this.props.onClickButton}
                        disabled={this.state.disabled} >
                    {this._renderIcon()}
                    {this.props.children}
                </button>
            );
        }
    }
});

module.exports = Button;
