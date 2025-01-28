import React, { useContext } from 'react'
import MultiStepFormContext from "../../components/MultiFormContext";
import Title from '../../dashboard/Title';
import Button from '@material-ui/core/Button';
import { TextField, Grid, Typography } from '@material-ui/core';
import CssBaseline from "@material-ui/core/CssBaseline";
import { makeStyles } from '@material-ui/core/styles';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Disclaimer from '../../../panel/components/features/Disclaimer';
import Popup from '../../../panel/components/features/Popup';

const useStyles = makeStyles((theme) => ({
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
  buttons: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
  button: {
    marginTop: theme.spacing(3),
    marginLeft: theme.spacing(1),
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
  },
  submit: {
    margin: theme.spacing(3, 0, 2)
  },
}));


export default function Fault() {
  const classes = useStyles();
  const { handleBack, setModel, model, serialNo, setSerial, problemDesc, setProblemDesc, date, setDate, OrderRecord, isLoading, isError, message, checked, setChecked, openPopup, setOpenPopup, agree, setAgree } = useContext(MultiStepFormContext);
  return (
    <React.Fragment>
      <Grid container component="main" className={classes.root}>
        <CssBaseline />
        <Grid className={classes.size} item xs={12} sm={8} md={5} elevation={1} square>
          <div className={classes.paper}>
            <Title>
              Complete the form
            </Title>
            <form className={classes.form} noValidate>
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="model"
                label="Device Model"
                name="model"
                value={model}
                onChange={(e) => setModel(e.target.value)}
              />
              <TextField
                variant="outlined"
                margin="normal"
                fullWidth
                id="serialNo"
                label="Serial No"
                name="serialNo"
                value={serialNo}
                onChange={(e) => setSerial(e.target.value)}
              />
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                multiline
                rows={4}
                id="problemDesc"
                label="Fault description"
                name="problemDesc"
                value={problemDesc}
                onChange={(e) => setProblemDesc(e.target.value)}
              />
              <TextField
                id="datetime-local"
                label="Appointment date"
                inputProps={{
                  min: new Date().toISOString().slice(0, 16)
                }}
                variant="outlined"
                name='date'
                type="datetime-local"
                defaultValue={date}
                onChange={(e) => setDate(e.target.value)}
                required
                InputLabelProps={{
                  shrink: true,
                }}
                style={{ width: '100%' }}
              />
              <FormControlLabel
                control={<Checkbox checked={checked}
                  onChange={(event) => { setChecked(event.target.checked); setOpenPopup(true) }} color="primary" />}
                label="Read terms and conditions."
              />
              <Popup
                title="Terms and Conditions"
                openPopup={openPopup}
                setOpenPopup={setOpenPopup}>
                <Disclaimer  agree={agree} setAgree={setAgree}/>
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
        <Button className={classes.button} variant="contained" color='primary' disabled={!model || !problemDesc || !date || !agree} onClick={OrderRecord}>
          {isLoading ? "Submiting..." : "Submit"}
        </Button>
      </div>
    </React.Fragment>
  )
}
