import React, { useContext } from 'react'
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Grid from '@material-ui/core/Grid';
import MultiStepFormContext from "../../components/MultiFormContext";
import Title from '../../dashboard/Title';
import Button from '@material-ui/core/Button';

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: 345,
  },
  media: {
    height: 140,
  },
  buttons: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
  button: {
    marginTop: theme.spacing(3),
    marginLeft: theme.spacing(1),
  },
}));

export default function Manufacturer() {
  const classes = useStyles();
  const { manufact, setManufactureId, handleNext, handleBack, url } = useContext(MultiStepFormContext);
  return (
    <React.Fragment>
      <center><Title>
        Please Select Device Manufacturer
      </Title></center>
      <Grid container spacing={1}>
        {manufact.map(items => (
          <Grid item key={items.id} xs={12} md={6} lg={4}>
            <Card className={classes.root}>
              <CardActionArea onClick={(e) => { setManufactureId(items.id); handleNext(e) }}>
                <CardMedia
                  className={classes.media}
                  image={`${url}/${items.image}`}
                  title={items.manufacture}
                />
                <CardContent>
                  <Typography gutterBottom variant="h5" component="h2">{items.manufacture}</Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
      <div className={classes.buttons}>
        <Button onClick={handleBack} className={classes.button} variant="contained" color='primary'>
          Back
        </Button>
      </div>
    </React.Fragment>
  )
}
