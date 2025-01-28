import React, { useContext } from 'react'
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Grid from '@material-ui/core/Grid';
import Title from '../../dashboard/Title';
import MultiStepFormContext from "../../components/MultiFormContext";

const useStyles = makeStyles({
  root: {
    maxWidth: 345,
  },
  media: {
    height: 140,
  },
});

export default function RepairType() {
  const classes = useStyles();
  const { repairCat, setRepairId, handleNext, url } = useContext(MultiStepFormContext);

  return (
    <React.Fragment>
       <center><Title>
        Please Select Device Category
      </Title></center>
      <Grid container spacing={1}>
        {repairCat.map(items=>(
          <Grid item key={items.id} xs={12} md={6} lg={4}>
              <Card className={classes.root}>
                <CardActionArea onClick={(e)=>{setRepairId(items.id); handleNext(e)}}>
                  <CardMedia
                    className={classes.media}
                    image={`${url}/${items.image}`}
                    title="Contemplative Reptile"
                  />
                  <CardContent>
                    <Typography gutterBottom variant="h5" component="h2">{items.repair}</Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
          </Grid>
        ))}
      </Grid>
    </React.Fragment>
  )
}
