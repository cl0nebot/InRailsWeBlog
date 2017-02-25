'use strict';

const classNames = require('classnames');

var PictureSlider = React.createClass({
    propTypes: {
        id: React.PropTypes.string.isRequired,
        children: React.PropTypes.oneOfType([
            React.PropTypes.arrayOf(React.PropTypes.string),
            React.PropTypes.arrayOf(React.PropTypes.object)
        ]).isRequired,
        hasIndicators: React.PropTypes.bool,
        height: React.PropTypes.number,
        interval: React.PropTypes.number
    },

    getDefaultProps () {
        return {
            hasIndicators: true,
            height: 400,
            interval: 6000
        };
    },

    componentDidUpdate() {
        $('#' + this.props.id).find('.slider').slider();
    },

    render () {

        return (
            <div id={this.props.id}>
                <div className="slider">
                    <ul className="slides">
                        {
                            _.map(this.props.children, (picture, i) =>
                                <li key={i}>
                                    <img src={picture}/>
                                </li>
                            )
                        }
                    </ul>
                </div>
            </div>
        );
    }

// <div className="caption center-align">
//     <h3>
//         This is our big Tagline!
//     </h3>
//     <h5 className="light grey-text text-lighten-3">
//         Here's our small slogan.
//     </h5>
// </div>
});

module.exports = PictureSlider;
