import React from 'react'
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import SettingsApplicationsIcon from '@material-ui/icons/SettingsApplications';
import LocalLibraryIcon from '@material-ui/icons/LocalLibrary';
import DevicesIcon from '@material-ui/icons/Devices';
import ListAltIcon from '@material-ui/icons/ListAlt';
import WarningIcon from '@material-ui/icons/Warning';
import RepairCategory from "./repair/RepairCategory";
import Manufacturer from "./manufacture/Manufacturer";
import Model from "./model/Model";
import Problem from "./problem/Problem";
import OrdersReceived from "./orders/OrdersReceived";

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

export default function OrderService() {
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
                <Tab label="Ordered services" icon={<ListAltIcon />} {...a11yProps(0)} />
                <Tab label="Repair Category" icon={<SettingsApplicationsIcon />} {...a11yProps(1)} />
                <Tab label="Manufacturer" icon={<LocalLibraryIcon />} {...a11yProps(2)} />
                <Tab label="Model" icon={<DevicesIcon />} {...a11yProps(3)} />
                <Tab label="Service offered" icon={<WarningIcon />} {...a11yProps(4)} />
            </Tabs>
         </AppBar>
         <TabPanel value={value} index={0}>
            <OrdersReceived/>
        </TabPanel>
        <TabPanel value={value} index={1}>
            <RepairCategory/>
        </TabPanel>
        <TabPanel value={value} index={2}>
            <Manufacturer/>
        </TabPanel>
      <TabPanel value={value} index={3}>
            <Model/>
      </TabPanel>
      <TabPanel value={value} index={4}>
            <Problem/>
      </TabPanel>
    </div>
  )
}
