import { Alert, Box, CircularProgress, Container, FormControl, FormHelperText, Input, InputLabel, OutlinedInput, Typography } from "@mui/material";

import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Copyright from "../../../components/copyright";
import { link_forgot_password, link_login, link_signup } from "../../../links/links";
import { Done } from "@mui/icons-material";

export default function SignUpSuccess() {
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
          <Done />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign up successful
        </Typography>
        <Box sx={{ mt: 1 }}>
          <Typography textAlign={'center'}>
            We've sent you an email with which you can activate your account!
            Please click the button/link in it.
          </Typography>
          <Link href={link_login}>
            <Button
              type="link"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}>
                
              Sign In
            </Button>
          </Link>
        </Box>
      </Box>
    </Container>
  );
}