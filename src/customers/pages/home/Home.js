import React, {useEffect, useState} from 'react'
import { Grid, Paper, makeStyles } from '@material-ui/core';
import Title from '../../dashboard/Title';
import CustomerCard from './CustomerCard';
import CardTravelIcon from '@material-ui/icons/CardTravel';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCartOutlined';
import {GetMyJobCardsCount} from '../../features/customerAuthSlice';
import { Services } from '../../features/orderServiceSlice';

const useStyles = makeStyles(theme => ({
  pageContent: {
      margin: theme.spacing(2),
      padding: theme.spacing(1)
  }
}))

export default function Home() {
  const classes = useStyles();
  const [card, setCard] = useState([]);
  const [serv, setServ] = useState([]);

  async function getCardData() {
    try {
      let response = await GetMyJobCardsCount();
      setCard(response.data);
    } catch (error) {
      console.log(error);
    }
  }
  useEffect(() => {
    getCardData();
  }, []);

  async function services() {
    try {
      const response = await Services();
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
      <Paper className={classes.pageContent}>
      <Title>Home</Title>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6} lg={4}>
            <CustomerCard 
              title='My jobcards'
              icon={<CardTravelIcon fontSize='large' color='primary'/>}
              details={card}
            />
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <CustomerCard 
              title='Ordered services'
              icon={<ShoppingCartIcon fontSize='large' color='primary'/>}
              details={serv}
            />
          </Grid>
        </Grid>
      </Paper>
    </>
  )
}
