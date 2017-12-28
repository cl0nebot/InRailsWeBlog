'use strict';

const UserTracking = ({tracking}) => (
    <div className="user-tracking row center-align">
        {
            $.toMap(tracking, (index, value) => (
                <div key={index}
                     className="col s12 m6">
                    <strong className="tracking-number">
                        {value}
                    </strong>
                    <h5 className="tracking-name">
                        {I18n.t('js.tracking.' + index)}
                    </h5>
                </div>
            ))
        }
    </div>
);

UserTracking.propTypes = {
    tracking: PropTypes.object.isRequired
};

export default UserTracking;
