'use strict';

const styles = (theme) => ({
    root: {
        margin: '.5rem auto 4rem',
        overflow: 'visible',
    },
    title: {
        width: '100%',
        margin: '0 0 2.5rem',
    },
    tagLabel: {
        width: '100%',
        margin: '1rem 0 .3rem',
        padding: '6px 0 7px',
        display: 'block',
        background: 'none',
        color: theme.palette.text.primary,
        fontSize: '1.33rem',
        lineHeight: '1.1875em'
    },
    select: {
        width: '90%'
    },
    expand: {
        transform: 'rotate(0deg)',
        marginLeft: 'auto',
        transition: theme.transitions.create('transform', {
            duration: theme.transitions.duration.shortest
        })
    },
    expandOpen: {
        transform: 'rotate(180deg)'
    }
});

export default styles;
