import React, { useState, useEffect } from 'react'
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Link from '@material-ui/core/Link';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Tecworx from "../start/tecworx.png";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { LoginCustomer, reset } from "./features/customerAuthSlice";
import ReCAPTCHA from "react-google-recaptcha";
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/material.css'

const useStyles = makeStyles((theme) => ({
  root: {
    height: '100vh',
  },
  image: {
    backgroundImage: `url(${Tecworx})`,
    backgroundRepeat: 'no-repeat',
    backgroundColor:
      theme.palette.type === 'light' ? theme.palette.grey[50] : theme.palette.grey[900],
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  },
  paper: {
    margin: theme.spacing(8, 4),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

export default function Login() {
  const classes = useStyles();
  const [fullName, setName] = useState("");
  const [phone, setPhone] = useState();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [verified, setVerified] = useState(false);

  const { custom, isError, isSuccess, isLoading, message } = useSelector(
    (state) => state.custom
  );

  useEffect(() => {
    if (custom || isSuccess) {
      alert('You have successfully logged in')
      navigate('/menu')
    }
    dispatch(reset());
  }, [custom, isSuccess, dispatch, navigate]);

  const AuthCustom = (e) => {
    e.preventDefault();
    dispatch(LoginCustomer({ fullName, phone }));
  };

  const onChange = () => {
    setVerified(true);
  }

  return (
    <Grid container component="main" className={classes.root}>
      <CssBaseline />
      <Grid item xs={false} sm={4} md={7} className={classes.image} />
      <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
        <div className={classes.paper}>
          <Avatar className={classes.avatar} src={Tecworx} sx={{ width: 500, height: 500 }} />
          <Typography component="h1" variant="h5">
            Customer Sign in
          </Typography>
          <form className={classes.form} noValidate onSubmit={AuthCustom}>
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
            <ReCAPTCHA
              sitekey={process.env.REACT_APP_SITEKEY}
              onChange={onChange}
              style={{ marginTop: 20 }}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
              disabled={!verified}
            >
              {isLoading ? "Signing in..." : "Sign in"}
            </Button>
            <Grid container>
              <Grid item>
                <Link href="/register" variant="body2">
                  {"Don't have an account? Sign Up"}
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
