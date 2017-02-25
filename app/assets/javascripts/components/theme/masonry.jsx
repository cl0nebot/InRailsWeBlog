'use strict';

const MasonryLoader = require('../../loaders/masonry');

const Pagination = require('../materialize/pagination');
const classNames = require('classnames');

var MasonryWrapper = (ComponentCard, componentCardProps, ComponentExposed, componentExposedProps) => React.createClass({
    propTypes: {
        elements: React.PropTypes.array.isRequired,
        isActive: React.PropTypes.bool.isRequired,
        type: React.PropTypes.string.isRequired,
        hasExposed: React.PropTypes.bool,
        componentsToExposed: React.PropTypes.array,
        isPaginated: React.PropTypes.bool,
        totalPages: React.PropTypes.number,
        onPaginationClick: React.PropTypes.func
    },

    getDefaultProps () {
        return {
            hasExposed: false,
            componentsToExposed: null,
            isPaginated: true,
            totalPages: 0,
            onPaginationClick: null
        }
    },

    getInitialState () {
        return {
            Masonry: null,
            masonryOptions: {
                transitionDuration: '0.6s',
                itemSelector: '.grid-item',
                percentPosition: true
            },
            exposedComponents: {}
        };
    },

    componentWillMount() {
        if (this.props.isActive) {
            MasonryLoader().then(({ Masonry }) => {
                this.setState({Masonry: Masonry});
            });
        }
    },

    componentDidMount() {
        if (this.props.isActive && this.masonry) {
            this.masonry.layout();
        }
    },

    masonry: null,

    _handleComponentClick(elementId, event) {
        if(!this.props.hasExposed) {
            return event;
        }

        event.preventDefault();

        let exposedComponents = this.state.exposedComponents;
        if (exposedComponents[elementId]) {
            delete exposedComponents[elementId];
        } else {
            exposedComponents[elementId] = true;
            setTimeout(() => {
                $('html, body').animate({scrollTop: $(ReactDOM.findDOMNode(this.refs[elementId])).offset().top}, 750);
            }, 600);
        }
        this.setState({
            exposedComponents: exposedComponents
        });
    },

    render() {
        let exposedComponents = this.state.exposedComponents;

        if(!!this.props.componentsToExposed) {
            this.props.componentsToExposed.forEach((componentId) => {
                exposedComponents[componentId] = true;
                setTimeout(() => {
                    $('html, body').animate({scrollTop: $(ReactDOM.findDOMNode(this.refs[componentId])).offset().top}, 750);
                }, 600);
            });
        }

        const ComponentNodes = this.props.elements.map((element) => {
            const itemClasses = classNames(
                'col s12 m6 l4',
                'grid-item',
                {
                    exposed: this.props.hasExposed && exposedComponents[element.id]
                }
            );

            let elementType = {};
            elementType[this.props.type] = element;

            return (
                <div key={element.id}
                     ref={element.id}
                     className={itemClasses}>
                    {
                        (this.props.hasExposed && exposedComponents[element.id])
                            ?
                            <div className="card-panel">
                                <ComponentExposed onClick={this._handleComponentClick}
                                    {...elementType}
                                    {...componentExposedProps}/>
                            </div>
                            :
                            <ComponentCard onClick={this._handleComponentClick}
                                {...elementType}
                                {...componentCardProps}/>
                    }
                </div>
            );
        });

        return (
            <div className="row">
                {
                    this.state.Masonry &&
                    <this.state.Masonry className="grid"
                                        elementType="div"
                                        options={this.state.masonryOptions}
                                        ref={function(c) {if (c) this.masonry = c.masonry;}.bind(this)}>
                        {ComponentNodes}
                    </this.state.Masonry>
                }

                {
                    this.props.isPaginated &&
                    <Pagination totalPages={this.props.totalPages}
                                onPaginationClick={this.props.onPaginationClick}/>
                }
            </div>
        )
    }
});


module.exports = MasonryWrapper;