import { Box, CircularProgress, Container, Typography } from "@mui/material";

import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Copyright from "../../../components/copyright";
import { link_signup, link_login } from "../../../links/links";
import { useSnackbar } from "notistack";
import { useState } from "react";
import { api_resetPassword, ResetPasswordData } from "../../../api/auth/reset_password";

export default function ForgotPasswordPage() {
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(false);

  const handleSubmit = (event) => {
    if (loading) return;
    setLoading(true);
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    setTimeout(async () => {
      const resetData = new ResetPasswordData(data.get('email'));
      await api_resetPassword(resetData);
      if (resetData.hasError()) {
        if (resetData.hasErrorEmail()) {
          enqueueSnackbar('Error: ' + resetData.errorEmail, { variant: 'error' });
        } else {
          enqueueSnackbar('Error: ' + resetData.error, { variant: 'error' });
        }
      } else {
        enqueueSnackbar('Password reset email sent.', { variant: 'success'});
      }
      setLoading(false);
    }, 0);

  };

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
          Forgot your Password?
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
            autoFocus
          />
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
                    Send Reset Email
                  </Button>
                )
          }
          <Grid container>
            <Grid item xs>
              <Link href={link_login} variant="body2">
              {"Login"}
              </Link>
            </Grid>
            <Grid item>
              <Link href={link_signup} variant="body2">
                {"Sign Up"}
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
}