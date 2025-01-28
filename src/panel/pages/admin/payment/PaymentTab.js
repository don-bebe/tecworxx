import React from 'react'
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Box from '@material-ui/core/Box';
import MonetizationOnIcon from '@material-ui/icons/MonetizationOn';
import AllInboxIcon from '@material-ui/icons/AllInbox';
import AssessmentIcon from '@material-ui/icons/Assessment';
import { Typography } from '@material-ui/core';
import MethodOfPayment from './MethodOfPayment';
import JobPayments from './JobPayments';
import OrderPayments from './OrderPayments';

function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`scrollable-force-tabpanel-${index}`}
            aria-labelledby={`scrollable-force-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box p={3}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.any.isRequired,
    value: PropTypes.any.isRequired,
};

function a11yProps(index) {
    return {
        id: `scrollable-force-tab-${index}`,
        'aria-controls': `scrollable-force-tabpanel-${index}`,
    };
}

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
        width: '100%',
        backgroundColor: theme.palette.background.paper,
    },
}));

export default function PaymentTab() {
    const classes = useStyles();
    const [value, setValue] = React.useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };
    return (
        <div className={classes.root}>
            <AppBar position="static" color="default">
                <Tabs
                    value={value}
                    onChange={handleChange}
                    variant="scrollable"
                    scrollButtons="on"
                    indicatorColor="primary"
                    textColor="primary"
                    aria-label="scrollable force tabs example"
                >
                    <Tab label="Method of payment" icon={<MonetizationOnIcon />} {...a11yProps(0)} />
                    <Tab label="Jobcard payments" icon={<AllInboxIcon />} {...a11yProps(1)} />
                    <Tab label="Order service payments" icon={<AssessmentIcon />} {...a11yProps(2)} />
                </Tabs>
            </AppBar>
            <TabPanel value={value} index={0}>
                <MethodOfPayment />
            </TabPanel>
            <TabPanel value={value} index={1}>
                <JobPayments />
            </TabPanel>
            <TabPanel value={value} index={2}>
                <OrderPayments />
            </TabPanel>
        </div>
    )
}
