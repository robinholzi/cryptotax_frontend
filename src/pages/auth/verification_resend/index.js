import { Alert, Box, CircularProgress, Container, FormControl, FormHelperText, Input, InputLabel, OutlinedInput, Typography } from "@mui/material";

import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Copyright from "../../../components/copyright";
import { link_forgot_password, link_login, link_signup, link_verification_resend, link_verification_resend_sucess } from "../../../links/links";
import { useState } from "react";
import { stringIsEmpty } from "../../../utils/string";
import { Forward } from "@mui/icons-material";
import { api_resendVerificationEmail, ResendVerificationEmailData } from "../../../api/auth/resend_verification_email";
import { Navigate } from "react-router-dom";

export default function VerificationResendPage() {
  const [redirectSuccess, setRedirectSuccess] = useState(false);
  const [resendEmailData, _] = useState(new ResendVerificationEmailData());
  const [__, update] = useState();
  const [waiting, setWaiting] = useState(false);
  
  const setEmailUsername = (str) => { resendEmailData.emailUsername = str; update(); }

  const handleSubmit = async e => {
    resendEmailData.cleanErrors();
    setWaiting(true);
    e.preventDefault();

    await api_resendVerificationEmail(resendEmailData);
    if (!resendEmailData.hasError()) {
      setWaiting(false);
      setRedirectSuccess(true);
    } else {
      setWaiting(false);
    }

  }

  if (redirectSuccess) {
    return <Navigate to={link_verification_resend_sucess} />
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
          (resendEmailData.hasError() && !stringIsEmpty(resendEmailData.error))
          ? (
            <Box container paddingBottom={3}>
              <Alert fullWidth variant="filled" severity="error">
                { resendEmailData.error }
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
        <Box container component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            type="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            error={!stringIsEmpty(resendEmailData.errorUsername)}
            onChange={e => setEmailUsername(e.target.value)}
            autoFocus
            helperText={resendEmailData.errorUsername ?? ""}
          />
          {waiting 
            ? <Box p={1}><center><CircularProgress /></center></Box>
            : <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Resend email
            </Button>
          }  
          <Grid container>
            <Grid item xs>
              <Link href={link_forgot_password} variant="body2">
                Forgot password?
              </Link>
            </Grid>
            <Grid item>
              <Link href={link_signup} variant="body2">
                {"New user? Sign Up"}
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
}