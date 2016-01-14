'use strict';

var classNames = require('classnames');

var Spinner = React.createClass({
    propTypes: {
        size: React.PropTypes.string,
        spinnerClass: React.PropTypes.string
    },

    getDefaultProps () {
        return {
            size: null,
            spinnerClass: ''
        };
    },

    render () {
        let sizeProperties = {};
        sizeProperties[this.props.size] = this.props.size;
        let preloaderClasses = classNames(
            'preloader-wrapper',
            'active',
            sizeProperties
        );

        return (
            <div className={this.props.spinnerClass}>
                <div className={preloaderClasses}>
                    <div className="spinner-layer spinner-blue-only">
                        <div className="circle-clipper left">
                            <div className="circle"/>
                        </div>
                        <div className="gap-patch">
                            <div className="circle"/>
                        </div>
                        <div className="circle-clipper right">
                            <div className="circle"/>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
});

module.exports = Spinner;

