'use strict';

const RadioButtons = (props) => {
    return (
        <div>
            {
                Object.keys(props.buttons).map((key) =>
                    <div key={key}>
                        <input id={key}
                               type="radio"
                               name={props.group}
                               checked={props.checkedButton === key}
                               onChange={props.onRadioChanged}
                               {...props.validator}/>

                        <label htmlFor={key}>
                            {props.buttons[key]}
                        </label>
                    </div>
                )
            }
        </div>
    );
};

RadioButtons.propTypes = {
    buttons: PropTypes.object.isRequired,
    group: PropTypes.string.isRequired,
    checkedButton: PropTypes.string,
    onRadioChanged: PropTypes.func,
    validator: PropTypes.object
};

RadioButtons.defaultProps = {
    checkedButton: null,
    onRadioChanged: null,
    validator: null
};

export default RadioButtons;
