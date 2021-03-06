'use strict';

const styles = (theme) => ({
    container: {
        position: 'relative',
        margin: '1rem auto 3rem',
        overflow: 'visible',
        maxWidth: '100%',
        backgroundColor: theme.palette.grey[100]
    },
    root: {
        padding: '1rem',
        paddingBottom: '1.5rem'
    },
    topicTitle: {
        textAlign: 'center',
        fontSize: '1.8rem',
        fontWeight: 500,
        margin: '1rem 0'
    }
});

export default styles;
