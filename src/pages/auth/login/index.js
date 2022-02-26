import { Alert, Box, CircularProgress, Container, FormControl, FormHelperText, Input, InputLabel, OutlinedInput, Typography } from "@mui/material";

import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Copyright from "../../../components/copyright";
import { link_forgot_password, link_signup } from "../../../links/links";
import { api_loginUser, LoginData } from "../../../api/login";
import { useState } from "react";
import { stringIsEmpty } from "../../../utils/string";
import { storeToken } from "../../../controller/auth/auth";

export default function LoginPage({setToken}) {
  const [loginData, _] = useState(new LoginData());
  const [__, update] = useState();
  const [waiting, setWaiting] = useState(false);

  const setErrorUsername = (str) => { loginData.errorUsername = str; update(); }
  const setErrorPassword = (str) => { loginData.errorPassword = str; update(); }
  const setEmailUsername = (str) => { loginData.emailUsername = str; update(); }
  const setPassword = (str) => { loginData.password = str; update(); }

  const handleSubmit = async e => {
    console.log(loginData.emailUsername, loginData.password);
    loginData.cleanErrors();
    setWaiting(true);
    e.preventDefault();

    await api_loginUser(loginData);
    console.log(loginData.errorEmailUsername, loginData.errorPassword)
    if (!stringIsEmpty(loginData.token)) {
      storeToken(loginData.token);
      setToken(loginData.token);
    }

    setTimeout(function() {
      setWaiting(false);
    }, 1000);
  }

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        {
          (loginData.hasError() && !stringIsEmpty(loginData.error))
          ? (
            <Box container paddingBottom={3}>
              <Alert fullWidth variant="filled" severity="error">
                {loginData.error}
              </Alert>
            </Box>
          ) : ""
        }
        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            error={!stringIsEmpty(loginData.errorUsername)}
            onChange={e => setEmailUsername(e.target.value)}
            autoFocus
            helperText={loginData.errorUsername ?? ""}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            error={!stringIsEmpty(loginData.errorPassword)}
            autoComplete="current-password"
            onChange={e => setPassword(e.target.value)}
            helperText={loginData.errorPassword ?? ""}
          />
          {/* <FormControlLabel
            control={<Checkbox value="remember" color="primary" />}
            label="Remember me"
          /> */}
          {/* TODO */}
          <br/>
          {waiting 
            ? <Box p={1}><center><CircularProgress /></center></Box>
            : <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign In
            </Button>
          }  
          <Grid container>
            <Grid item xs>
              <Link to={link_forgot_password} variant="body2">
                Forgot password?
              </Link>
            </Grid>
            <Grid item>
              <Link to={link_signup} variant="body2">
                {"New user? Sign Up"}
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
      <Box sx={{ mt: 8, mb: 4 }}>
        <Copyright />
      </Box>
    </Container>
  );
}