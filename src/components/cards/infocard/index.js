import { Avatar, Box, Card, CardContent, Grid, Typography } from '@mui/material';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import MoneyIcon from '@mui/icons-material/Money';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet'; 

export const InfoCard = (props) => (
  <Card
    sx={{ height: '100%', backgroundColor: "#222222" }}
    {...props}>
    <CardContent>
      <Grid
        container
        spacing={3}
        sx={{ justifyContent: 'space-between' }}
      >
        <Grid item>
          <Typography
            color="textSecondary"
            gutterBottom
            variant="overline"
          >
            BUDGET
          </Typography>
          <Typography
            color="textPrimary"
            variant="h4"
          >
            $24k
          </Typography>
        </Grid>
        <Grid item>
          <Avatar
            sx={{
              backgroundColor: 'error.main',
              height: 56,
              width: 56
            }}
          >
            <MoneyIcon />
          </Avatar>
        </Grid>
      </Grid>
      <Box
        sx={{
          pt: 2,
          display: 'flex',
          alignItems: 'center'
        }}
      >
        <ArrowDownwardIcon color="error" />
        <Typography
          color="error"
          sx={{
            mr: 1
          }}
          variant="body2"
        >
          12%
        </Typography>
        <Typography
          color="textSecondary"
          variant="caption"
        >
          Since last month
        </Typography>
      </Box>
    </CardContent>
  </Card>
);

export const SmallPlainInfoCard = (props) => {
  return (
    <Card
      sx={{ height: '100%', backgroundColor: "#222222" }}
      {...props}>
      <CardContent>
        <Grid
          container
          sx={{ justifyContent: 'space-between' }}
        >
          <Grid item>
            <Typography
              color="textSecondary"
              gutterBottom
              variant="overline"
              lineHeight={2}
            >
              {props.title}
            </Typography>
            <Typography
              color="textPrimary"
              variant={String(props.value).length < 7 ? "h5" : "h6"}
              pt={1.5}
            >
              {props.value}
            </Typography>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  )
};

export const SmallInfoCard = (props) => {
  return (
    <Card
      sx={{ height: '100%', backgroundColor: "#222222" }}
      {...props}>
      <CardContent>
        <Grid
          container
          spacing={3}
          sx={{ justifyContent: 'space-between' }}
        >
          <Grid item>
            <Typography
              color="textSecondary"
              gutterBottom
              variant="overline"
            >
              {props.title}
            </Typography>
            <Typography
              color="textPrimary"
              variant="h5"
            >
              {props.value}
            </Typography>
          </Grid>
          <Grid item>
            <Avatar
              sx={{
                backgroundColor: 'secondary.main',
                height: 40,
                width: 40
              }}
            >
              {props.children}
            </Avatar>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  )
};
