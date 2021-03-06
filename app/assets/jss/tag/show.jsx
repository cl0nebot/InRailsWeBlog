'use strict';

import {
    gridWidth
} from '../theme';

const styles = (theme) => ({
    root: {
        position: 'relative',
        margin: '1rem auto 4rem',
        overflow: 'visible',
        maxWidth: gridWidth
    },
    title: {
        fontSize: '2.8rem',
        fontWeight: 500,
        marginTop: 30
    },
    subtitle: {
        fontSize: '2.4rem',
        marginTop: 40,
        marginBottom: 15
    },
    subtitle2: {
        fontSize: '1.8rem',
        marginTop: 30,
        marginBottom: 10
    },
    avatar: {
        color: theme.palette.text.primary
    }
});

export default styles;
