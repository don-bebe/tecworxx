import React, { useEffect, useState } from 'react'
import clsx from 'clsx';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import HomeIcon from '@material-ui/icons/Home';
import PeopleIcon from '@material-ui/icons/People';
import PersonIcon from '@material-ui/icons/Person';
import LocalGroceryStoreIcon from '@material-ui/icons/LocalGroceryStore';
import DevicesOtherIcon from '@material-ui/icons/DevicesOther';
import CreditCardIcon from '@material-ui/icons/CreditCard';
import BarChartIcon from '@material-ui/icons/BarChart';
import StoreIcon from '@material-ui/icons/Store';
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import TuneIcon from '@material-ui/icons/Tune';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import AccountCircle from '@material-ui/icons/AccountCircle';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import { useDispatch, useSelector } from "react-redux";
import { getMe, LogOut, reset, ChangePasswords } from '../../../start/authSlice';
import { useNavigate } from 'react-router-dom';
import SettingsApplicationsIcon from '@material-ui/icons/SettingsApplications';
import Popup from './Popup';
import Profile from '../../pages/home/Profile';
import ChangePassword from '../../pages/home/ChangePassword';
import WorkIcon from '@material-ui/icons/Work';
import Tecworx from "../../../start/tecworx.png";
import TimelineIcon from '@material-ui/icons/Timeline';
import { Info } from '@material-ui/icons';
import LockIcon from '@material-ui/icons/Lock';
import AssignmentIcon from '@material-ui/icons/Assignment';
import NotificationsIcon from '@material-ui/icons/Notifications';

const drawerWidth = 240;


const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: 36,
  },
  hide: {
    display: 'none',
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
  },
  drawerOpen: {
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerClose: {
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: theme.spacing(7) + 1,
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing(9) + 1,
    },
  },
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(1),
  },
}));

export const MiniDrawer = (props) => {
  const classes = useStyles();
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const [isOpen, isSetOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const opens = Boolean(anchorEl);
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { isError } = useSelector((state) => state.auth);
  const { message } = useSelector((state) => state.auth);
  const [openPass, setOpenPass] = useState(false);
  const navigate = useNavigate();
  const [recordForView, setRecordForView] = useState(null);

  useEffect(() => {
    dispatch(getMe());
  }, [dispatch]);

  useEffect(() => {
    if (isError) {
      navigate('/');
    }
  }, [isError, navigate]);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const logout = () => {
    dispatch(LogOut());
    dispatch(reset());
    navigate("/");
  };

  const openInWindow = user => {
    setRecordForView(user)
    isSetOpen(true)
  }

  const changePass = async (change) => {
    try {
      await dispatch(ChangePasswords(change));
      setOpenPass(false)
    } catch (error) {
      console.log(error)
    }
  }

  const openChangePass = (user) => {
    setRecordForView(user)
    setOpenPass(true);
  }

  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar
        position="fixed"
        className={clsx(classes.appBar, {
          [classes.appBarShift]: open,
        })}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            className={clsx(classes.menuButton, {
              [classes.hide]: open,
            })}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap>
            <img src={Tecworx} alt="tecworx" width="55px" height="55px" />
          </Typography>
          <div style={{ display: "flex", flex: 1 }} />
          <IconButton color='inherit'>
            <NotificationsIcon />
          </IconButton>
          <IconButton
            aria-label="account of current user"
            aria-controls="menu-appbar"
            aria-haspopup="true"
            onClick={handleMenu}
            color="inherit"
          >
            <AccountCircle />
          </IconButton>
          <Menu
            id="menu-appbar"
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            keepMounted
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            open={opens}
            onClose={handleClose}
          >
            <MenuItem onClick={() => { openInWindow(user) }}>My Profile</MenuItem>
            <MenuItem onClick={() => { openChangePass(user) }}>Change password</MenuItem>
            <MenuItem onClick={logout}>Logout</MenuItem>
          </Menu>
          <IconButton color="inherit">
            <LockIcon onClick={logout} />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        className={clsx(classes.drawer, {
          [classes.drawerOpen]: open,
          [classes.drawerClose]: !open,
        })}
        classes={{
          paper: clsx({
            [classes.drawerOpen]: open,
            [classes.drawerClose]: !open,
          }),
        }}
      >
        <div className={classes.toolbar}>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
          </IconButton>
        </div>
        <Divider />
        <List>
          <ListItem button onClick={() => navigate('/home')}>
            <ListItemIcon>
              <HomeIcon />
            </ListItemIcon>
            <ListItemText primary="Home" />
          </ListItem>

          {user && user.role === "Admin" && (
            <>
              <ListItem button onClick={() => navigate('/employees')}>
                <ListItemIcon>
                  <PersonIcon />
                </ListItemIcon>
                <ListItemText primary="Employee" />
              </ListItem>
              <ListItem button onClick={() => navigate('/customers')}>
                <ListItemIcon>
                  <PeopleIcon />
                </ListItemIcon>
                <ListItemText primary="Customers" />
              </ListItem>
              <ListItem button onClick={() => navigate('/stockmanagement')}>
                <ListItemIcon>
                  <LocalGroceryStoreIcon />
                </ListItemIcon>
                <ListItemText primary="Stock Management" />
              </ListItem>
              <ListItem button onClick={() => navigate('/viewcard')}>
                <ListItemIcon>
                  <CreditCardIcon />
                </ListItemIcon>
                <ListItemText primary="Job cards" />
              </ListItem>
              <ListItem button onClick={() => navigate('/vieworders')}>
                <ListItemIcon>
                  <AssignmentIcon />
                </ListItemIcon>
                <ListItemText primary="Ordered services" />
              </ListItem>
              <ListItem button onClick={() => navigate('/sales')}>
                <ListItemIcon>
                  <TimelineIcon />
                </ListItemIcon>
                <ListItemText primary="Sales" />
              </ListItem>
              <ListItem button onClick={() => navigate('/viewpayments')}>
                <ListItemIcon>
                  <BarChartIcon />
                </ListItemIcon>
                <ListItemText primary="Services payments" />
              </ListItem>
            </>
          )}
          {user && user.role === "User" && (
            <>
              <ListItem button onClick={() => navigate('/customers')}>
                <ListItemIcon>
                  <PeopleIcon />
                </ListItemIcon>
                <ListItemText primary="Customers" />
              </ListItem>
              <ListItem button onClick={() => navigate('/jobcard')}>
                <ListItemIcon>
                  <DevicesOtherIcon />
                </ListItemIcon>
                <ListItemText primary="Job cards" />
              </ListItem>
              <ListItem button onClick={() => navigate('/pointofsale')}>
                <ListItemIcon>
                  <StoreIcon />
                </ListItemIcon>
                <ListItemText primary="Point of sale" />
              </ListItem>
              <ListItem button onClick={() => navigate('/vieworders')}>
                <ListItemIcon>
                  <AssignmentIcon />
                </ListItemIcon>
                <ListItemText primary="Ordered services" />
              </ListItem>
            </>
          )}
          {user && user.role === "Technician" && (
            <>
              <ListItem button onClick={() => navigate('/diagnosis')}>
                <ListItemIcon>
                  <TuneIcon />
                </ListItemIcon>
                <ListItemText primary="Diagnose" />
              </ListItem>
              <ListItem button onClick={() => navigate('/repair')}>
                <ListItemIcon>
                  <SettingsApplicationsIcon />
                </ListItemIcon>
                <ListItemText primary="Repair" />
              </ListItem>
              <ListItem button onClick={() => navigate('/assignment')}>
                <ListItemIcon>
                  <AssignmentIcon />
                </ListItemIcon>
                <ListItemText primary="Assigned orders" />
              </ListItem>
              <ListItem button onClick={() => navigate('/mywork')}>
                <ListItemIcon>
                  <WorkIcon />
                </ListItemIcon>
                <ListItemText primary="My working profile" />
              </ListItem>
            </>
          )}
          {user && user.role === "Tech-Admin" && (
            <>
              <ListItem button onClick={() => navigate('/orderservice')}>
                <ListItemIcon>
                  <Info />
                </ListItemIcon>
                <ListItemText primary="Order services" />
              </ListItem>
              <ListItem button onClick={() => navigate('/diagnosis')}>
                <ListItemIcon>
                  <TuneIcon />
                </ListItemIcon>
                <ListItemText primary="Diagnose" />
              </ListItem>
              <ListItem button onClick={() => navigate('/repair')}>
                <ListItemIcon>
                  <SettingsApplicationsIcon />
                </ListItemIcon>
                <ListItemText primary="Repair" />
              </ListItem>
              <ListItem button onClick={() => navigate('/assignment')}>
                <ListItemIcon>
                  <AssignmentIcon />
                </ListItemIcon>
                <ListItemText primary="Assigned orders" />
              </ListItem>
              <ListItem button onClick={() => navigate('/viewcard')}>
                <ListItemIcon>
                  <CreditCardIcon />
                </ListItemIcon>
                <ListItemText primary="Job cards" />
              </ListItem>
              <ListItem button onClick={() => navigate('/mywork')}>
                <ListItemIcon>
                  <WorkIcon />
                </ListItemIcon>
                <ListItemText primary="My working profile" />
              </ListItem>
            </>
          )}
          <ListItem button onClick={logout}>
            <ListItemIcon>
              <ExitToAppIcon />
            </ListItemIcon>
            <ListItemText primary="Logout" />
          </ListItem>
        </List>
      </Drawer>
      <main className={classes.content}>
        <div className={classes.toolbar} />
        {props.children}
      </main>
      <Popup
        title="My Profile"
        openPopup={isOpen}
        setOpenPopup={isSetOpen}>
        <Profile user={recordForView} />
      </Popup>
      <Popup
        title="Change password"
        openPopup={openPass}
        setOpenPopup={setOpenPass}>
        <ChangePassword
          user={recordForView}
          changePass={changePass}
          setOpenPass={setOpenPass} />
        <Typography variant="inherit" color="textSecondary">
          {isError && <center><p className="has-text-centered"><font color='red'>{message}</font></p></center>}
        </Typography>
      </Popup>

    </div>
  )
};

