import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Copyright from '../../../components/copyright';
import { link_login, link_signup_success } from '../../../links/links';
import { useSnackbar } from 'notistack';
import { api_post_singup, SignupData } from '../../../api/auth/singup';
import { CircularProgress } from '@mui/material';
import { stringIsEmpty } from '../../../utils/string';
import  { Navigate  } from 'react-router-dom'

export default function SignUpSuccessPage() {
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = React.useState(false);
  const [redirectSuccess, setRedirectSuccess] = React.useState(false);
  const [signupData, setSignupData] = React.useState(new SignupData())

  const handleSubmit = (event) => {
    if (loading) return;
    setLoading(true);
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    
    setTimeout(async () => {
      const firstName = data.get('firstName')
      const lastName = data.get('lastName')
      const username = data.get('username')
      const email = data.get('email')
      const password = data.get('password')
      const repeatPassword = data.get('repeatPassword')
      const approveTerms = data.get('approveTerms')

      signupData.firstName = firstName;
      signupData.lastName = lastName;
      signupData.username = username;
      signupData.email = email;
      signupData.password = password;
      signupData.repeatPassword = repeatPassword;
      signupData.approveTerms = approveTerms;
      await api_post_singup(signupData);
      if (signupData.hasError()) {
        if (!stringIsEmpty(signupData.error)) {
          enqueueSnackbar('Error: ' + signupData.errorEmail, { variant: 'error' });
        } else {
          enqueueSnackbar('Error: One or more formular fields are filled invalidly!', { variant: 'error' });
        }
      } else {
        enqueueSnackbar('Signup successful. Please click email activation link!', { variant: 'success'});
        setTimeout(() => {
          setRedirectSuccess(true);
        }, 1000);
      }
      setLoading(false);
    }, 0);

  };

  if (redirectSuccess) {
    return <Navigate to={link_signup_success} />
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
        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign up
        </Typography>
        <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
              autoComplete="first-name"
              name="firstName"
              required
              fullWidth
              id="firstName"
              label="First Name"
              helperText={signupData.errorFirstName}
              error={signupData.hasErrorFirstName()}
              autoFocus
            />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                id="lastName"
                label="Last Name"
                name="lastName"
                autoComplete="last-name"
                helperText={signupData.errorLastName}
                error={signupData.hasErrorLastName()}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                id="username"
                label="Username"
                name="username"
                autoComplete="username"
                helperText={signupData.errorUsername}
                error={signupData.hasErrorUsername()}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                helperText={signupData.errorEmail}
                error={signupData.hasErrorEmail()}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="new-password"
                helperText={signupData.errorPassword}
                error={signupData.hasErrorPassword()}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                name="repeatPassword"
                label="Repeat password"
                type="password"
                id="repeatPassword"
                autoComplete="new-password"
                helperText={signupData.errorRepeatPassword}
                error={signupData.hasErrorRepeatPassword()}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={<Checkbox color="primary" name='approveTerms' id='approveTerms' value='approveTerms' error={signupData.hasErrorApproveTerms()} />}
                label="I accept the terms of service depicted at <domain>/terms/"
              />
            </Grid>
          </Grid>
          {
            (loading) 
              ? (
                <center><Box p={7}><CircularProgress /></Box></center>
              )
              : (
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                >
                  Sign Up
                </Button>
              )
          }
          <Grid container justifyContent="flex-end">
            <Grid item>
              <Link href={link_login} variant="body2">
                Already have an account? Sign in
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
}