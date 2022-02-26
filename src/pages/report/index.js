
import React from 'react';

import CreateNewFolder from '@mui/icons-material/CreateNewFolder';
import FolderDelete from '@mui/icons-material/FolderDelete';
import { AppBar, Avatar, Button, Container, CssBaseline, getDividerUtilityClass, Grid, Icon, IconButton, Input, LinearProgress, linearProgressClasses, Link, Paper, styled, Toolbar, Typography } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { makeStyles } from '@mui/styles';
import { blue, blueGrey, deepOrange, green, orange, red } from '@mui/material/colors';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import { InfoCard, SmallInfoCard } from '../../components/cards/infocard';
import { DashboardPage } from '../dashboard';
import { Box } from '@mui/system';
import { Add, Assessment, CompareArrows, Delete, Info, InsertChart, Launch, MoveToInbox, Receipt, Share, ShoppingCart } from '@mui/icons-material';
import { link_report } from '../../links/links';
import { useSearchParams } from 'react-router-dom';

  
const useStyles = makeStyles((theme) => ({
  menuButton: {
    // marginRight: theme.spacing(2)
  },
  button: {
    marginLeft: 12,
  },
  title: {
    flexGrow: 1
  },
  toolbar: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: 12, // theme.spacing(2)
  },
  content: {
    marginTop: 42, // theme.spacing(2),
    padding: 20, // theme.spacing(2)
  }
}));

function PageWrapper({children}) {
  return <Container>
      {children}
  </Container>
}

const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
  height: 10,
  borderRadius: 5,
  [`&.${linearProgressClasses.colorPrimary}`]: {
    backgroundColor: theme.palette.grey[theme.palette.mode === 'light' ? 200 : 800],
  },
  [`& .${linearProgressClasses.bar}`]: {
    borderRadius: 5,
    backgroundColor: theme.palette.mode === 'light' ? '#1a90ff' : '#308fe8',
  },
}));

function CustomizedProgressBars() {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <BorderLinearProgress variant="determinate" value={50} />
    </Box>
  );
}


function ReportPage(portfolio_id, transaction_page=0) {
  const classes = useStyles();

  var portfolio = {
    'name': "Robin's Portfolio Report #13234"
  }

  return (    
      <PageWrapper>
        <Paper className={classes.content}>

          <Box
            component="main"
            // sx={{
            //   flexGrow: 1,
            //   py: 8
            // }}
          >
              <Grid container spacing="1" alignItems="center">
                <InsertChart />
                <Typography
                  variant="h6"
                  noWrap
                  marginLeft={1.5}
                  component="span">
                    {portfolio.name}
                </Typography>
              </Grid>


              <Grid
                container
                spacing={3}
              >
                {/* <Grid
                  item
                  lg={3}
                  sm={4}
                  xl={3}
                  xs={6}
                >
                  <InfoCard />
                </Grid> */}
                <Grid
                  item
                  lg={2}
                  sm={3}
                  xl={2}
                  xs={3}
                >
                  <SmallInfoCard />
                </Grid>
                <Grid
                  item
                  lg={2}
                  sm={3}
                  xl={2}
                  xs={3}
                >
                  <SmallInfoCard />
                </Grid>
                <Grid
                  item
                  lg={2}
                  sm={3}
                  xl={2}
                  xs={3}
                >
                  <SmallInfoCard />
                </Grid>
              </Grid>
          </Box>

          {/* TODO: export to PDF */}
          {/* TODO: list sell orders (consumers buy-sell pair) */}

        </Paper>
      </PageWrapper>
  );

}

export default ReportPage;