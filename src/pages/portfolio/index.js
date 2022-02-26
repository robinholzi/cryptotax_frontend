
import React, { useEffect, useState } from 'react';

import CreateNewFolder from '@mui/icons-material/CreateNewFolder';
import FolderDelete from '@mui/icons-material/FolderDelete';
import { AppBar, Avatar, Button, CircularProgress, Container, CssBaseline, getDividerUtilityClass, Grid, Icon, IconButton, Input, LinearProgress, linearProgressClasses, Link, Paper, styled, Toolbar, Typography } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { makeStyles } from '@mui/styles';
import { blue, blueGrey, deepOrange, green, orange, red } from '@mui/material/colors';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import { InfoCard, SmallInfoCard } from '../../components/cards/infocard';
import { DashboardPage } from '../dashboard';
import { Box } from '@mui/system';
import { Add, Assessment, CompareArrows, Delete, Info, Launch, MoveToInbox, Receipt, Share, ShoppingCart } from '@mui/icons-material';
import { link_report } from '../../links/links';
import { useSearchParams } from 'react-router-dom';
import TransactionInfoDialog from './transaction_info';
import ReportInfoDialog from './report_info';
import { PortfolioData, portfolio_data, portfolio_reports, portfolio_txs, ReportListData, TxListData } from '../../api/portfolio/portfolio_api';
import {useParams} from 'react-router-dom';

  
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

const report_columns = [
  { 
    field: "id", headerName: "", width: 60, hide: false,
    renderCell: () => (
      // <Button variant="contained" href="#contained-buttons">
      //   <Launch />
      // </Button>
      // TODO: dynmaic value link
      <Link to={link_report(1, 1)}> 
        <Launch color='primary' />
      </Link>
    )
  },
  {
      field: "created",
      headerName: "Date",
      type: "datetime",
      width: 190,
      editable: false,
      filterable: false,
  },
  {
      field: "state",
      headerName: "State",
      width: 65,
      editable: false,
      sortable: false,
      filterable: true,
  },
  {
      field: "progress",
      headerName: "Progress",
      type: "number",
      width: 120,
      editable: false,
      sortable: false,
      filterable: false,
      renderCell: () => (
        <CustomizedProgressBars />
      )
  },
  {
      field: "transactions",
      headerName: "Txs",
      type: "number",
      width: 80,
      editable: false,
      sortable: false,
      filterable: false,
  },
  {
      field: "profit",
      headerName: "Profit",
      type: "number",
      width: 120,
      editable: false,
      sortable: false,
      filterable: false,
  },
  {
      field: "algo",
      headerName: "Algo",
      type: "string",
      width: 90,
      editable: false,
      sortable: false,
      filterable: false,
  },
  {
      field: "transfer_algo",
      headerName: "Transfer Algo",
      type: "string",
      width: 120,
      editable: false,
      sortable: false,
      filterable: false,
  },
];

// tid	oid	pid	from_currency_id	from_amount	to_currency_id	to_amount	datetime	
// exchange_wallet	fee_currency_id	fee

const orders_columns = [
  { 
    field: "tid", headerName: "", width: 40, hide: true,
  },
  { 
    field: "oid", headerName: "", width: 40, hide: true,
  },
  {
      field: "exchange_wallet",
      headerName: "Exchange",
      type: "string",
      width: 100,
      editable: false,
      sortable: true,
      filterable: true,
  },
  {
      field: "datetime",
      headerName: "Datetime",
      type: "datetime",
      width: 140,
      editable: false,
      sortable: true,
      filterable: true,
  },
  {
      field: "from_amount",
      headerName: "from 🔢",
      type: "number",
      width: 90,
      editable: false,
      sortable: true,
      filterable: true,
  },
  {
      field: "from_currency",
      headerName: "from 🪙",
      type: "string",
      width: 80,
      editable: false,
      filterable: true,
      sortable: false,
  },
  {
      field: "to_amount",
      headerName: "to 🔢",
      type: "number",
      width: 90,
      editable: false,
      sortable: true,
      filterable: true,
  },
  {
      field: "to_currency",
      headerName: "to 🪙",
      type: "string",
      width: 80,
      editable: false,
      filterable: true,
      sortable: false,
  },
  {
    field: "fee",
    headerName: "Fee",
    type: "string",
    width: 100,
    editable: false,
    sortable: true,
    filterable: true,
  },
  {
    field: "fee_currency",
    headerName: "Fee 🪙",
    type: "string",
    width: 80,
    editable: false,
    sortable: true,
    filterable: true,
  },
];

// tid	did	pid	buy_datetime	currency_id	amount	
// taxable	datetime	exchange_wallet	fee_currency_id	fee

const deposits_columns = [
  { 
    field: "tid", headerName: "", width: 40, hide: true,
  },
  { 
    field: "did", headerName: "", width: 40, hide: true,
  },
  {
      field: "exchange_wallet",
      headerName: "Exchange",
      type: "string",
      width: 100,
      editable: false,
      sortable: true,
      filterable: true,
  },
  {
      field: "datetime",
      headerName: "Txn Datetime",
      type: "datetime",
      width: 140,
      editable: false,
      sortable: true,
      filterable: true,
  },
  {
      field: "buy_datetime",
      headerName: "Buy Datetime",
      type: "datetime",
      width: 140,
      editable: false,
      sortable: true,
      filterable: true,
  },
  {
      field: "amount",
      headerName: "🔢",
      type: "number",
      width: 90,
      editable: false,
      sortable: true,
      filterable: true,
  },
  {
      field: "currency",
      headerName: "🪙",
      type: "string",
      width: 80,
      editable: false,
      filterable: true,
      sortable: false,
  },
  {
      field: "taxable",
      headerName: "Taxable %",
      type: "number",
      width: 90,
      editable: false,
      sortable: true,
      filterable: true,
  },
  {
    field: "fee",
    headerName: "Fee",
    type: "string",
    width: 100,
    editable: false,
    sortable: true,
    filterable: true,
  },
  {
    field: "fee_currency",
    headerName: "Fee 🪙",
    type: "string",
    width: 80,
    editable: false,
    sortable: true,
    filterable: true,
  },
];

// taid	tfid	pid	currency_id	amount	from_exchange_wallet	datetime	exchange_wallet	fee_currency_id	fee

const transfers_columns = [
  { 
    field: "tid", headerName: "", width: 40, hide: true,
  },
  { 
    field: "tfid", headerName: "", width: 40, hide: true,
  },
  {
      field: "datetime",
      headerName: "Datetime",
      type: "datetime",
      width: 140,
      editable: false,
      sortable: true,
      filterable: true,
  },
  {
      field: "from_exchange_wallet",
      headerName: "From Exchg",
      type: "string",
      width: 110,
      editable: false,
      sortable: true,
      filterable: true,
  },
  {
      field: "exchange_wallet",
      headerName: "To Exchg",
      type: "string",
      width: 110,
      editable: false,
      sortable: true,
      filterable: true,
  },
  {
      field: "amount",
      headerName: "🔢",
      type: "number",
      width: 90,
      editable: false,
      sortable: true,
      filterable: true,
  },
  {
      field: "currency",
      headerName: "🪙",
      type: "string",
      width: 80,
      editable: false,
      filterable: true,
      sortable: false,
  },
  {
      field: "taxable",
      headerName: "Taxable %",
      type: "number",
      width: 90,
      editable: false,
      sortable: true,
      filterable: true,
  },
  {
    field: "fee",
    headerName: "Fee",
    type: "string",
    width: 100,
    editable: false,
    sortable: true,
    filterable: true,
  },
  {
    field: "fee_currency",
    headerName: "Fee 🪙",
    type: "string",
    width: 80,
    editable: false,
    sortable: true,
    filterable: true,
  },
];

// TODO report creation: multi choice algo

function PortfolioPage({ token }) {
  const classes = useStyles();

  // portfolio id
  const { id: pid } = useParams();

  const [loading, setLoading] = useState(true);
  const [loadingReports, setLoadingReports] = useState(true);
  const [loadingTxs, setLoadingTxs] = useState(true);
  const [inputsBlocked, setInputsBlocked] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const [portfolioData, setPortfolioListData] = useState(new PortfolioData(pid));
  const [portfolioReports, setPortfolioReports] = useState(new ReportListData());
  const [portfolioTxs, setPortfolioTxs] = useState(new TxListData());

   // transaction type (tt)
  var transaction_page = searchParams.get("tt") ?? 0;
  var switch_tt_tab = (tab) => {
    var searchParams = new URLSearchParams(window.location.search);
    searchParams.set("tt", tab);
    window.location.search = searchParams.toString();
  }

  const re_load_portfolio = async () => {
    var delayInMilliseconds = 0; // ms

    setTimeout(async () => {
      setLoading(true);
      await portfolio_data(token, portfolioData);
      setLoading(false);
    }, delayInMilliseconds);

    setTimeout(async () => {
      setLoadingReports(true);
      await portfolio_reports(token, pid, portfolioReports);
      setLoading(false);
    }, delayInMilliseconds);

    setTimeout(async () => {
      setLoadingTxs(true);
      await portfolio_txs(token, pid, portfolioTxs);
      setLoading(false);
    }, delayInMilliseconds);
  }

  useEffect(async () => {
    await re_load_portfolio();
  }, [])

  var portfolio = {
    'name': "Robin's Portfolio #1"
  }

  const report_rows = [
      { id: 1, created: (new Date()).toLocaleString(), 
        state: 1, progress: 30, transactions: 33, profit: "231 €", latestReportState: '', algo: 'FIFO', transfer_algo: 'LIFO' },
  ];

  var transaction_box = ""
  if (transaction_page == 0) {
    const orders_rows = [
      { id: 1, exchange_wallet: "Binance", datetime: (new Date()).toLocaleString(), 
      from_amount: 21.1, from_currency: "ETH",
      to_amount: 0.1203000, to_currency: "BTC", fee: 0.002302, fee_currency: "BNB" },
      { id: 2, exchange_wallet: "Binance", datetime: (new Date()).toLocaleString(), 
      from_amount: 21.1, from_currency: "ETH",
      to_amount: 0.1203000, to_currency: "BTC", fee: 0.002302, fee_currency: "BNB" },
    ];
    transaction_box = (
      <div style={{ height: 300, width: "100%" }}>
        <DataGrid rows={orders_rows} columns={orders_columns} checkboxSelection />
      </div>
    )
  } else if (transaction_page == 1) {
    const deposits_rows = [
      { id: 1, exchange_wallet: "Binance", datetime: (new Date()).toLocaleString(), 
      buy_datetime: (new Date()).toLocaleString(), 
      amount: 21.1, currency: "ETH",
      taxable: 0.1203000, fee: 0.002302, fee_currency: "BNB" },
    ];
    transaction_box = (
      <div style={{ height: 300, width: "100%" }}>
        <DataGrid rows={deposits_rows} columns={deposits_columns} checkboxSelection />
      </div>
    )
  } else { // if (transaction_page == 2)
    const transfers_rows = [
      { id: 1, from_exchange_wallet: "Kraken", exchange_wallet: "Binance", datetime: (new Date()).toLocaleString(), 
      buy_datetime: (new Date()).toLocaleString(), 
      amount: 21.1, currency: "ETH",
      taxable: 0.1203000, fee: 0.002302, fee_currency: "BNB" },
      { id: 2, from_exchange_wallet: "Kraken", exchange_wallet: "Binance", datetime: (new Date()).toLocaleString(), 
      buy_datetime: (new Date()).toLocaleString(), 
      amount: 21.1, currency: "ETH",
      taxable: 0.1203000, fee: 0.002302, fee_currency: "BNB" },
      { id:3, from_exchange_wallet: "Kraken", exchange_wallet: "Binance", datetime: (new Date()).toLocaleString(), 
      buy_datetime: (new Date()).toLocaleString(), 
      amount: 21.1, currency: "ETH",
      taxable: 0.1203000, fee: 0.002302, fee_currency: "BNB" },
    ];
    transaction_box = (
      <div style={{ height: 300, width: "100%" }}>
        <DataGrid rows={transfers_rows} columns={transfers_columns} checkboxSelection />
      </div>
    )
  }

  // TODO make transfers editable 
  {/* TODO editable transactions, dateppicker */}
  var content_card = ""
  if (loading){
    content_card = <center><Box p={7}><CircularProgress /></Box></center>
  }
  else if (portfolioData.hasError()){
    console.log("11  ");
    content_card = <div>Error! {portfolioData.error}</div>
  } else {
    content_card = <Box>
      <Box
        component="main"
        // sx={{
        //   flexGrow: 1,
        //   py: 8
        // }}
      >
          <Grid container spacing="1" alignItems="center">
            <AccountBalanceWalletIcon />
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

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          pt: 4,
          pb: 1
        }}
      >
        <Box>
          <div className={classes.toolbar}>
            <Typography
              variant="h6"
              noWrap
              marginLeft={1.5}
              component="span">
                <Grid container alignItems="center"><Assessment /> <span style={{paddingLeft: 10}}>Reports</span></Grid>
            </Typography>
            <div>
              <ReportInfoDialog />
              <Button
                  variant="contained"
                  style={{ 
                    backgroundColor: green[400],
                    color: "white"
                  }}
                  startIcon={<Add />}
              >
                New Report
              </Button>
              <Button
                  sx={{ml: 2}}
                  variant="contained"
                  style={{ 
                    backgroundColor: red[400],
                    color: "white"
                  }}
                  startIcon={<Delete />}
              >
                Delete
              </Button>
              <Button
                  sx={{ml: 2}}
                  variant="contained"
                  color="primary"
                  style={{ 
                    color: "white"
                  }}
                  startIcon={<Share />}
              >
                Share
              </Button>
            </div>
          </div>
          <div style={{ height: 300, width: "100%" }}>
            <DataGrid rows={report_rows} columns={report_columns} checkboxSelection />
          </div>
        </Box>
      </Box>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          pt: 4,
          pb: 1
        }}
      >
        <Box>
          <div className={classes.toolbar}>
            <Typography
              variant="h6"
              noWrap
              marginLeft={1.5}
              component="span">
                <Grid container alignItems="center"><Receipt /> <span style={{paddingLeft: 10}}>Transactions</span></Grid>
            </Typography>
            <div>
              <Button
                  variant="contained"
                  style={{ 
                    backgroundColor: green[400],
                    color: "white"
                  }}
                  startIcon={<Add />}
              >
                New Report
              </Button>
              <Button
                  sx={{ml: 2}}
                  variant="contained"
                  style={{ 
                    backgroundColor: red[400],
                    color: "white"
                  }}
                  startIcon={<Delete />}
              >
                Delete
              </Button>
            </div>
          </div>
          <div className={classes.toolbar}>
            <div> </div>
            <div>
              <TransactionInfoDialog />
              <Button
                  sx={{ml: 2}}
                  variant="contained"
                  style={{ 
                    backgroundColor: (transaction_page==0) ? blue[300] : blueGrey[300],
                    color: "white"
                  }}
                  startIcon={<ShoppingCart />}
                  onClick={() => switch_tt_tab(0)}
              >
                Orders
              </Button>
              <Button
                  sx={{ml: 2}}
                  variant="contained"
                  style={{ 
                    backgroundColor: (transaction_page==1) ? blue[500] : blueGrey[500],
                    color: "white"
                  }}
                  startIcon={<MoveToInbox />}
                  onClick={() => switch_tt_tab(1)}
              >
                Deposit
              </Button>
              <Button
                  sx={{ml: 2}}
                  variant="contained"
                  style={{ 
                    backgroundColor: (transaction_page==2) ? blue[700] : blueGrey[700],
                    color: "white"
                  }}
                  startIcon={<CompareArrows />}
                  onClick={() => switch_tt_tab(2)}
              >
                Transfer
              </Button>
            </div>
          </div>
        </Box>
        {transaction_box}
      </Box>
    </Box>;
  }

  return (    
    <PageWrapper>
      <Paper className={classes.content}>
        { content_card }
      </Paper>
    </PageWrapper>
  );

}

export default PortfolioPage;