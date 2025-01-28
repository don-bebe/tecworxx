import React from "react";
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import {
    AccountTree,
    Ballot,
    AssignmentTurnedIn
} from '@material-ui/icons';


const style = makeStyles(theme => ({
    root: {
        backgroundColor: '#ccc',
        zIndex: 1,
        color: '#fff',
        width: 50,
        height: 50,
        display: 'flex',
        borderRadius: '50%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    active: {
        background: theme.palette.primary.main,
        boxShadow: '0 4px 10px 0 rgba(0,0,0,.25)',
    },
    completed: {
        background: theme.palette.primary.main
    },
}));

const CardStepper = props => {
    const classes = style();
    const { active, completed } = props;

    const icons = {
        1: <AccountTree />,
        2: <Ballot />,
        3: <AssignmentTurnedIn />,
    };

    return (
        <div
            className={clsx(classes.root, {
                [classes.active]: active,
                [classes.completed]: completed,
            })}
        >
            {icons[String(props.icon)]}
        </div>
    );
}

CardStepper.propTypes = {
    active: PropTypes.bool,
    completed: PropTypes.bool,
};

export default CardStepper;