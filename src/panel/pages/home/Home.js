import React, { useEffect, useState } from 'react';
import { Grid, Paper, makeStyles, Container } from '@material-ui/core';
import NoteCard from '../../components/features/NoteCard';
import PeopleIcon from '@material-ui/icons/People';
import StoreIcon from '@material-ui/icons/Store';
import { countCustomer } from '../../components/services/customerSlice';
import { countProducts } from '../../components/services/stockSlice';
import { countJobs, countJobCardsToDiagonise, countJobCardsCancelled, countJobCardsRepair, countMeJobs } from '../../components/services/jobcardSlice';
import CardTravelIcon from '@material-ui/icons/CardTravel';
import { HomeTwoTone, Build, Assignment } from '@material-ui/icons';
import PageHeader from '../../components/features/PageHeader';
import TuneIcon from '@material-ui/icons/Tune';
import CancelIcon from '@material-ui/icons/Cancel';
import PhonelinkSetupIcon from '@material-ui/icons/PhonelinkSetup';
import PieChart from '../charts/PieChart';
import clsx from 'clsx';
import LineChart from '../charts/LineChart';
import { useSelector } from "react-redux";
import BarChart from '../charts/BarChart';
import { OrderedServicesSum } from '../../components/services/orderService/assignSlice'
import ShoppingCartIcon from '@material-ui/icons/ShoppingCartOutlined';
import { countAssigned } from '../../components/services/orderService/assignSlice';

const useStyles = makeStyles(theme => ({
  pageContent: {
    margin: theme.spacing(0.5),
    padding: theme.spacing(0.5)
  },
  container: {
    paddingTop: theme.spacing(0.5),
    paddingBottom: theme.spacing(0.5),
  },
  paper: {
    padding: theme.spacing(2),
    display: 'flex',
    overflow: 'auto',
    flexDirection: 'column',
  },
  fixedHeight: {
    height: 350,
  },
}))

export default function Home() {
  const classes = useStyles();
  const [cust, setCust] = useState([]);
  const [prod, setProd] = useState([]);
  const [job, setJob] = useState([]);
  const [cancel, setCancel] = useState([]);
  const [diagnose, setDiagnose] = useState([]);
  const [repair, setRepair] = useState([]);
  const [serv, setServ] = useState([]);
  const [mecards, setMecards] = useState([]);
  const [assign, setAssign] = useState([]);
  const { user } = useSelector((state) => state.auth);

  const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);

  const getCustData = async () => {
    try {
      let response = await countCustomer();
      setCust(response.data);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getCustData();
  }, []);

  const getAssignData = async () => {
    try {
      let response = await countAssigned();
      setAssign(response.data);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getAssignData();
  }, []);

  const getCancelData = async () => {
    try {
      let response = await countJobCardsCancelled();
      setCancel(response.data);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getCancelData();
  }, []);

  const getCountMeData = async () => {
    try {
      let response = await countMeJobs();
      setMecards(response.data);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getCountMeData();
  }, []);

  const getDiagnose = async () => {
    try {
      let response = await countJobCardsToDiagonise();
      setDiagnose(response.data);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getDiagnose();
  }, []);

  const getRepair = async () => {
    try {
      let response = await countJobCardsRepair();
      setRepair(response.data);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getRepair();
  }, []);

  const getJobData = async () => {
    try {
      let response = await countJobs();
      setJob(response.data);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getJobData();
  }, []);

  const getProData = async () => {
    try {
      let response = await countProducts();
      setProd(response.data);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getProData();
  }, []);

  async function services() {
    try {
      const response = await OrderedServicesSum();
      setServ(response.data)
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    services();
  }, []);

  return (
    <>
      <PageHeader
        title="Home Page"
        subTitle="Some features"
        icon={<HomeTwoTone fontSize="large" />}
      />
      <main className={classes.pageContent}>
        <Container maxWidth="lg" className={classes.container}>
          <Grid container spacing={3}>
            {user && user.role === "User" && (
              <>
                {/*Line Charts */}
                <Grid item xs={12} md={8} lg={8}>
                  <Paper className={fixedHeightPaper}>
                    {/* line chart*/}
                    <LineChart />
                  </Paper>
                </Grid>
                <Grid item xs={12} md={4} lg={4}>
                  <Paper className={fixedHeightPaper}>
                    {/* bar chart*/}
                    <BarChart />
                  </Paper>
                </Grid>
              </>
            )}
            {user && user.role === "Admin" && (
              <>
                {/*Charts */}
                <Grid item xs={12} md={8} lg={8}>
                  <Paper className={fixedHeightPaper}>
                    {/* bar chart*/}
                    <BarChart />
                  </Paper>
                </Grid>
                <Grid item xs={12} md={4} lg={4}>
                  <Paper className={fixedHeightPaper}>
                    <PieChart />
                  </Paper>
                </Grid>
                <Grid item xs={12} md={12} lg={12}>
                  <Paper className={fixedHeightPaper}>
                    {/* line chart*/}
                    <LineChart />
                  </Paper>
                </Grid>
              </>
            )}
            {user && (user.role === "Technician" || user.role === "Tech-Admin") && (
              <>
                <Grid item xs={12}>
                  <Paper className={classes.paper}>
                    <Grid container spacing={3}>
                      <Grid item xs={12} md={6} lg={4}>
                        <NoteCard
                          title='My work'
                          icon={<Build fontSize='large' color='primary' />}
                          details={mecards}
                        />
                      </Grid>
                      <Grid item xs={12} md={6} lg={4}>
                        <NoteCard
                          title='My Orders'
                          icon={<Assignment fontSize='large' color='primary' />}
                          details={assign}
                        />
                      </Grid>
                    </Grid>
                  </Paper>
                </Grid>
              </>
            )}
            <Grid item xs={12}>
              <Paper className={classes.paper}>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6} lg={4}>
                    <NoteCard
                      title='Customers'
                      icon={<PeopleIcon fontSize='large' color='primary' />}
                      details={cust}
                    />
                  </Grid>
                  <Grid item xs={12} md={6} lg={4}>
                    <NoteCard
                      title='Products'
                      icon={<StoreIcon fontSize='large' color='primary' />}
                      details={prod}
                    />
                  </Grid>
                  <Grid item xs={12} md={6} lg={4}>
                    <NoteCard
                      title='Total Job Cards'
                      icon={<CardTravelIcon fontSize='large' color='primary' />}
                      details={job}
                    />
                  </Grid>
                  <Grid item xs={12} md={6} lg={4}>
                    <NoteCard
                      title='Job cards to diagnose'
                      icon={<TuneIcon fontSize='large' color='primary' />}
                      details={diagnose}
                    />
                  </Grid>
                  <Grid item xs={12} md={6} lg={4}>
                    <NoteCard
                      title='Job cards to repair'
                      icon={<PhonelinkSetupIcon fontSize='large' color='primary' />}
                      details={repair}
                    />
                  </Grid>
                  <Grid item xs={12} md={6} lg={4}>
                    <NoteCard
                      title='Cancelled job cards'
                      icon={<CancelIcon fontSize='large' color='error' />}
                      details={cancel}
                    />
                  </Grid>
                  <Grid item xs={12} md={6} lg={4}>
                    <NoteCard
                      title='Ordered services'
                      icon={<ShoppingCartIcon fontSize='large' color='primary' />}
                      details={serv}
                    />
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </main>

    </>
  )
}
