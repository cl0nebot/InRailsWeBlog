'use strict';

const styles = (theme) => ({
    modal: {
        top: '45%',
        left: '50%',
        transform: 'translate(-50%, -45%)',
        position: 'absolute',
        width: theme.spacing.unit * 50,
        backgroundColor: theme.palette.background.paper,
        boxShadow: theme.shadows[5],
        padding: theme.spacing.unit * 4,
    },
    input: {
        margin: '1.1rem .1rem'
    }
});

export default styles;
