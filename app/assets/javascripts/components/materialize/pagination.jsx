'use strict';

import mix from '../../mixins/mixin';
import HistoryMixin from '../../mixins/history';

import ReactPaginate from 'react-paginate';

export default class Pagination extends mix(React.Component).with(HistoryMixin) {
    static propTypes = {
        totalPages: PropTypes.number,
        initialPage: PropTypes.number,
        currentPage: PropTypes.number,
        numOfPageShow: PropTypes.number,
        className: PropTypes.string,
        hasHistory: PropTypes.bool,
        onPaginationClick: PropTypes.func
    };

    static defaultProps = {
        totalPages: 0,
        initialPage: 1,
        currentPage: null,
        numOfPageShow: 10,
        className: null,
        hasHistory: true,
        onPaginationClick: null
    };

    constructor(props) {
        super(props);

        this._pagination = null;
    }

    componentWillMount() {
        if (this.props.hasHistory) {
            this.watchHistory('pagination');
        }
    }

    onHistoryChanged = (pagination) => {
        pagination = pagination || {selected: 0};

        this._handlePaginationClick(pagination, false);

        if (this._pagination) {
            this._pagination.setState({
                selected: pagination.page
            });
        }
    };

    _handlePaginationClick = (pagination, addToHistory = true) => {
        if (this.props.onPaginationClick) {
            this.props.onPaginationClick(pagination);

            if (this.props.hasHistory && addToHistory) {
                this.addToHistory({pagination: {page: pagination.selected}});
            }
        }
    };

    render() {
        const {totalPages, initialPage, currentPage, numOfPageShow, className} = this.props;

        const pageRangeDisplayed = Math.ceil(numOfPageShow / 2);
        const marginPagesDisplayed = Math.ceil(numOfPageShow / 4);

        if (totalPages <= 1) {
            return null;
        }

        return (
            <div className={classNames('clearfix', className)}>
                <ReactPaginate ref={(pagination) => this._pagination = pagination}
                               pageCount={totalPages}
                               initialPage={initialPage - 1}
                               forcePage={currentPage ? currentPage - 1 : currentPage}
                               disableInitialCallback={true}
                               pageRangeDisplayed={pageRangeDisplayed}
                               marginPagesDisplayed={marginPagesDisplayed}
                               previousLabel={<i className="material-icons">chevron_left</i>}
                               nextLabel={<i className="material-icons">chevron_right</i>}
                               breakLabel={<span className="break">...</span>}
                               onPageChange={this._handlePaginationClick}
                               containerClassName="pagination center-align"
                               subContainerClassName="pages"
                               pageClassName="waves-effect"
                               activeClassName="active"
                               disabledClassName="disabled"/>
            </div>
        );
    }
};
