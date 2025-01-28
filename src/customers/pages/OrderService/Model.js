import React, {useContext} from 'react'
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Grid from '@material-ui/core/Grid';
import Title from '../../dashboard/Title';
import Button from '@material-ui/core/Button';
import MultiStepFormContext from "../../components/MultiFormContext";

const useStyles = makeStyles((theme)=>({
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

export default function Model() {
  const classes = useStyles();
  const { model, handleBack, setModelId, handleNext, url } = useContext(MultiStepFormContext);
  return (
    <React.Fragment>
       <center><Title>
        Please Select Device Model
      </Title></center>
      <Grid container spacing={1}>
        {model.map(items=>(
          <Grid item key={items.id} xs={12} md={6} lg={4}>
              <Card className={classes.root}>
                <CardActionArea onClick={(e)=>{setModelId(items.id); handleNext(e)}}>
                  <CardMedia
                    className={classes.media}
                    image={`${url}/${items.image}`}
                    title={items.model}
                  />
                  <CardContent>
                    <Typography gutterBottom variant="h5" component="h2">{items.model}</Typography>
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
