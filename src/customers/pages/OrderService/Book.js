import React, { useContext } from 'react'
import Title from '../../dashboard/Title'
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import MultiStepFormContext from "../../components/MultiFormContext";
import TextField from '@material-ui/core/TextField';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Disclaimer from '../../../panel/components/features/Disclaimer';
import Popup from '../../../panel/components/features/Popup';
import CssBaseline from "@material-ui/core/CssBaseline";

const useStyles = makeStyles((theme) => ({
  buttons: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
  button: {
    marginTop: theme.spacing(3),
    marginLeft: theme.spacing(1),
  },
  root: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },
  size: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center"
  },
  paper: {
    margin: theme.spacing(2, 4),
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1)
  }
}));

export default function Book() {
  const classes = useStyles();
  const { handleBack, selectedDate, handleDateChange, BookNow, isError, isLoading, message, book, check, setCheck, openPopup, setOpenPopup, agree, setAgree } = useContext(MultiStepFormContext);
  return (
    <React.Fragment>
      <Grid container component="main" className={classes.root}>
        <CssBaseline />
        <Grid className={classes.size} item xs={12} sm={8} md={5} elevation={1} square>
          <div className={classes.paper}>
            <Title>Book an appointment</Title>
            <form className={classes.form} noValidate>
              <TextField
                id="datetime-local"
                label="Appointment date"
                inputProps={{
                  min: new Date().toISOString().slice(0, 16)
                }}
                variant="outlined"
                name='bookedDate'
                type="datetime-local"
                defaultValue={selectedDate}
                onChange={(e) => handleDateChange(e)}
                InputLabelProps={{
                  shrink: true,
                }}
              />
              <FormControlLabel
                control={<Checkbox checked={check}
                  onChange={(event) => { setCheck(event.target.checked); setOpenPopup(true) }} color="primary" />}
                label="Read terms and conditions."
              />
              <Popup
                title="Terms and Conditions"
                openPopup={openPopup}
                setOpenPopup={setOpenPopup}>
                <Disclaimer agree={agree} setAgree={setAgree} />
              </Popup>
              <div>
                <Typography variant="inherit" color="textSecondary">
                  {isError && <center><p className="has-text-centered"><font color='red'>{message}</font></p></center>}
                </Typography>
              </div>

            </form>
          </div>
        </Grid>
      </Grid>
      <div className={classes.buttons}>
        <Button onClick={handleBack} className={classes.button} variant="contained" color='primary'>
          Back
        </Button>
        <Button className={classes.button} variant="contained" color='primary' disabled={!book || !agree} onClick={BookNow}>
          {isLoading ? "Booking..." : "Book now"}
        </Button>
      </div>
    </React.Fragment>
  )
}
