'use strict';

import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';

const SelectFieldForm = ({input, label, helperText, options, meta: {touched, error}, ...custom}) => (
    <TextField {...input}
               select={true}
               label={label}
               value={input.value}
               error={touched && !!error}
               helperText={!!error ? error : helperText}
               {...custom}>
        {
            Array.isArray(options)
                ?
                options.map((key, i) => (
                    <MenuItem key={i}
                              value={key}>
                        {key}
                    </MenuItem>
                ))
                :
                Object.keys(options).map((key) => (
                    <MenuItem key={key}
                              value={key}>
                        {options[key]}
                    </MenuItem>
                ))
        }
    </TextField>
);

SelectFieldForm.propTypes = {
    input: PropTypes.object.isRequired,
    meta: PropTypes.object.isRequired,
    label: PropTypes.string.isRequired,
    options: PropTypes.oneOfType([
        PropTypes.array,
        PropTypes.object
    ]).isRequired,
    helperText: PropTypes.string,
    custom: PropTypes.object
};

export default SelectFieldForm;
