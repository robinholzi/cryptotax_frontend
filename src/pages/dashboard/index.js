
import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Button from '@mui/material/Button';
import CameraIcon from '@mui/icons-material/PhotoCamera';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Link from '@mui/material/Link';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { green, grey } from '@mui/material/colors';
import { link_login, link_portfolios } from '../../links/links';
import Copyright from '../../components/copyright';
import { FooterWidget } from '../../components/FooterBar';

export function DashboardPage() {
  
  return (
    <>
      <main>
        <Box
          sx={{
            bgcolor: 'primary.main',
            pt: 8,
            pb: 6,
          }}
        >
          <Container maxWidth="sm">
            <Typography
              component="h1"
              variant="h2"
              align="center"
              color="text.primary"
              gutterBottom
            >
              Analyse your<br/>Crypto Portfolios
            </Typography>
            <Typography variant="h5" align="center" color="text.secondary" paragraph>
              Ever struggled with analysing your crypto profits and construction a tax report?<br/>
              Start using our automated analysis tool!
            </Typography>
            <Stack
              sx={{ pt: 4 }}
              direction="row"
              spacing={2}
              justifyContent="center"
            >
              <Button variant="contained" style={{backgroundColor: grey[100]}} 
                onClick={() => window.location = (window.location.origin + link_portfolios)}>
                Analyse my Portfolio
              </Button>
              <Button variant="text" style={{backgroundColor: 'transparent', color: 'white'}}
                onClick={() => window.location = (window.location.origin + link_login)}>
                Login
              </Button>
            </Stack>
          </Container>
        </Box>
      </main>
    </>    
  )
}