import React, {useContext} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Checkbox from '@material-ui/core/Checkbox';
import Title from '../../dashboard/Title';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import MultiStepFormContext from "../../components/MultiFormContext";
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { Typography } from '@material-ui/core';

const useStyles = makeStyles((theme)=>({
  buttons: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
  button: {
    marginTop: theme.spacing(3),
    marginLeft: theme.spacing(1),
  },
}));

export default function Problem() {
  const classes = useStyles();
  const { availableServices, handleBack, handleNext, totalCost, checked, handleCheckedChange, enabled } = useContext(MultiStepFormContext);
  return (
    <React.Fragment>
      <center><Title>
        Please Select Device Problem
      </Title></center>
      <Grid container spacing={1}>
        <Grid item xs={12} md={8}>
          {availableServices.map(items=>(
            <FormGroup>
              <FormControlLabel
                control={<Checkbox multiple checked={checked[items.problem] === null ? false: checked[items.problem]}
                onChange={(e)=>handleCheckedChange(items, e)} 
                key={items.id}/>}
                label={items.problem}
              />
            </FormGroup>
          ))}
        </Grid>
        <Grid item xs={12} md={4}>
          <Typography variant="h5" color='primary'>
            TotalCost: ${totalCost} 
          </Typography>
        </Grid>
      </Grid>
      <div className={classes.buttons}>
        <Button onClick={handleBack} className={classes.button} variant="contained" color='primary'>
          Back
        </Button>
        <Button onClick={handleNext} className={classes.button} disabled={!enabled} variant="contained" color='primary'>
          Next
        </Button>
      </div>
    </React.Fragment>
  )
}
