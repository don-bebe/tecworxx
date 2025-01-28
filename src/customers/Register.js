import React, { useState, useEffect } from 'react'
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import Link from "@material-ui/core/Link";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Avatar from '@material-ui/core/Avatar';
import { makeStyles } from '@material-ui/core/styles';
import { FormControl, FormLabel, RadioGroup, FormControlLabel, Radio } from '@material-ui/core';
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Tecworx from "../start/tecworx.png";
import { Registration, reset } from "./features/customerAuthSlice";
import ReCAPTCHA from "react-google-recaptcha";
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/material.css'

const useStyles = makeStyles((theme) => ({
  root: {
    height: "100vh",
    backgroundImage: `url(${Tecworx})`,
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center",
    backgroundSize: "cover",
    backgroundColor:
      theme.palette.type === "light"
        ? theme.palette.grey[50]
        : theme.palette.grey[900],

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
  avatar: {
    margin: theme.spacing(0),
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1)
  },
  submit: {
    margin: theme.spacing(3, 0, 2)
  }
}));

export default function Register() {
  const classes = useStyles();
  const [role, setRole] = useState('Other');
  const [fullName, setName] = useState("");
  const [phone, setPhone] = useState();
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [contactPerson, setContact] = useState("");
  const [contactPersonCell, setContactPerson] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [verified, setVerified] = useState(false);


  const { custom, isError, isSuccess, isLoading, message } = useSelector(
    (state) => state.custom
  );

  useEffect(() => {
    if (custom || isSuccess) {
      navigate('/login')
    }
    dispatch(reset());
  }, [custom, isSuccess, dispatch, navigate]);

  const handleChange = (event) => {
    setRole(event.target.value);
  };

  const onChange = () => {
    setVerified(true);
  }

  const RegisterCustomer = (e) => {
    e.preventDefault();
    dispatch(Registration({ fullName, phone, email, address, contactPerson, contactPersonCell, role }));
  };
  return (
    <Grid container component="main" className={classes.root}>
      <CssBaseline />
      {/* <Grid item xs={false} sm={4} md={7} className={classes.image} /> */}
      <Grid className={classes.size} item xs={12} sm={8} md={5} component={Paper} elevation={1} square>
        <div className={classes.paper}>
          <Avatar className={classes.avatar} src={Tecworx} sx={{ width: 500, height: 500 }} />
          <Typography component="h1" variant="h5">
            Customer Registration
          </Typography>
          <form className={classes.form} noValidate onSubmit={RegisterCustomer}>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="fullName"
              label="Full Name"
              name="fullName"
              autoComplete="fullName"
              autoFocus
              value={fullName}
              onChange={(e) => setName(e.target.value)}
            />
            <PhoneInput
              label="Phone number"
              name="phone"
              id="phone"
              country={'zw'}
              enableSearch={true}
              value={phone}
              onChange={(e) => setPhone(e)}
              inputProps={{
                required: true
              }}
              required
              inputStyle={{ width: '100%' }}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              variant="outlined"
              margin="normal"
              fullWidth
              multiline
              rows={3}
              id="address"
              label="Address"
              name="address"
              autoComplete="address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
            <TextField
              variant="outlined"
              margin="normal"
              fullWidth
              id="contactPerson"
              label="Emergency contact person"
              name="contactPerson"
              autoComplete="contactPerson"
              value={contactPerson}
              onChange={(e) => setContact(e.target.value)}
            />
            <TextField
              variant="outlined"
              margin="normal"
              fullWidth
              id="contactPersonCell"
              label="Emergency contact person cell"
              name="contactPersonCell"
              autoComplete="contactPersonCell"
              value={contactPersonCell}
              onChange={(e) => setContactPerson(e.target.value)}
            />
            <FormControl component="fieldset">
              <FormLabel component="legend">Customer</FormLabel>
              <RadioGroup row aria-label="role" name="role" value={role} onChange={handleChange}>
                <FormControlLabel value="Company" control={<Radio />} label="Company" />
                <FormControlLabel value="Individual" control={<Radio />} label="Individual" />
                <FormControlLabel value="Other" control={<Radio />} label="Other" />
              </RadioGroup>
            </FormControl>
            <ReCAPTCHA
              sitekey={process.env.REACT_APP_SITEKEY}
              onChange={onChange}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
              disabled={!verified}
            >
              {isLoading ? "Signing up..." : "Register"}
            </Button>
            <Grid container>
              <Grid item>
                <Link href="/login" variant="body2">
                  {"Already have an account? Sign in"}
                </Link>
              </Grid>
            </Grid>
            <Typography variant="inherit" color="textSecondary">
              {isError && <center><p className="has-text-centered"><font color='red'>{message}</font></p></center>}
            </Typography>
          </form>
        </div>
      </Grid>
    </Grid>
  )
}
