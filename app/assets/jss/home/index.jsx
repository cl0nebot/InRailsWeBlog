'use strict';

import {
    gridWidth,
    articleAppendixWidth
} from '../theme';

const styles = (theme) => ({
    root: {
        position: 'relative',
        margin: '1rem auto 4rem',
        overflow: 'visible',
        maxWidth: articleAppendixWidth
    },
    grid: {
        maxWidth: gridWidth
    },
    tag: {
        margin: theme.spacing.unit,
    },
    category: {
        marginBottom: 32,
    },
    categoryName: {
        marginTop: 8,
        fontSize: '1.6rem',
        fontWeight: 500,
        borderBottom: `1px solid ${theme.palette.grey[300]}`,
    },
});

export default styles;
