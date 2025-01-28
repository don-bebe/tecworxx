import React, {useEffect, useState} from 'react';
import {GetAllMyJobCards} from '../../features/customerAuthSlice';
import { Grid, Paper, makeStyles } from '@material-ui/core';
import MyJobCards from './MyJobCards';
import PageHeader from '../../../panel/components/features/PageHeader';
import WorkTwoToneIcon from '@material-ui/icons/WorkTwoTone';

const useStyles = makeStyles(theme => ({
    pageContent: {
        margin: theme.spacing(2),
        padding: theme.spacing(1)
    }
  }))  

export default function MyCards() {
    const classes = useStyles();
    const [card, setCard] = useState([]);

    const getCardData = async () => {
        try {
            let response = await GetAllMyJobCards();
            setCard(response.data);
        } catch (error) {
            console.log(error);
        }
      };
      useEffect(() => {
        getCardData();
    }, []);

  return (
    <>
        <PageHeader
            title="My Jobcards"
            subTitle="Available job cards"
            icon={<WorkTwoToneIcon fontSize="large" />}
        />
        <Paper className={classes.pageContent}>
            <Grid container spacing={2}>
            {card.map(items=>(
                <Grid item key={items.id} xs={8} md={6} lg={4} >
                    <MyJobCards items={items}/>
                </Grid>
            ))}
            </Grid>
        </Paper>
    </>
  )
}
