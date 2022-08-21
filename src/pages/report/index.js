
import React, { useEffect, useState } from 'react';

import { AppBar, Avatar, Button, CircularProgress, Container, CssBaseline, getDividerUtilityClass, Grid, Icon, IconButton, Input, LinearProgress, linearProgressClasses, Link, Paper, styled, TextField, Toolbar, Typography } from "@mui/material";
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import { Box } from '@mui/system';
import { Add, Assessment, CompareArrows, Delete, Info, InsertChart, Launch, MoveToInbox, Receipt, Share, ShoppingCart } from '@mui/icons-material';
import { useStyles_mainCard } from '../../styles/general/main_card';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { CryptoTaxBreadcrubs } from '../../components/widgets/breadcrubs';
import { link_portfolio } from '../../links/links';
import { ReportOverviewBar } from './ReportOveriew';
import { useParams, useSearchParams } from 'react-router-dom';
import { insertUrlParam } from '../../controller/util/url_util';
import { ReportData, report_data } from '../../api/report/report_api';
import { DataGrid } from '@mui/x-data-grid';
import { tripple_by_aggregate_columns, tuple_by_aggregate_columns } from './table_columns';
import { useSnackbar } from 'notistack';


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

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));


function ReportPage({ token }) {
  const classes = useStyles_mainCard();
  const { enqueueSnackbar } = useSnackbar();

  // portfolio id
  const { id: pid, rid } = useParams();

  // [query params] ----------
  const [searchParams, setSearchParams] = useSearchParams();
  // const [transaction_page, setTransactionPage] = useState(searchParams.get("tt") ?? 0); TODO
  // -------------------------  
    
  // var switch_tt_tab = async (tab) => {
  //   insertUrlParam('tt', tab); // transaction type (tt)
  //   setTransactionPage(tab);
  //   switch_page_txs(1, false);
  //   re_load_txs(tab, pageSizeTxs, pageNumberTxs);
  // }

  // ------------------------------------

  const [loading, setLoading] = useState(true);
  const [reportData, setReportData] = useState(new ReportData(pid));

  const [rowsProfitsByCurrency, setRowsProfitsByCurrency] = useState([]);
  const [rowsProfitsByExchange, setRowsProfitsByExchange] = useState([]);
  const [rowsSellProfitsByCurrency, setRowsSellProfitsByCurrency] = useState([]);
  const [rowsSellProfitsByExchange, setRowsSellProfitsByExchange] = useState([]);
  const [rowsFeesByCurrency, setRowsFeesByCurrency] = useState([]);
  const [rowsFeesByExchange, setRowsFeesByExchange] = useState([]);
  // ------------------------------------

  const re_load_report = async () => {
    setTimeout(async () => {
      setLoading(true);
      
      // ==============================
      await report_data(token, pid, rid, reportData);

      // TODO add Datagrid rows
      const trippleMapper = tripple => ({
        "id": tripple.key,
        "sum_taxable_profit": tripple.taxable_profit,
        "sum_realized_profit": tripple.realized_profit,
      });
      const tupleMapper = tuple => ({
        "id": tuple.key,
        "fee_sum": tuple.fee_sum,
      });

      setRowsProfitsByCurrency(reportData.profitByCurrency.map(trippleMapper));
      setRowsProfitsByExchange(reportData.profitByExchange.map(trippleMapper));
      setRowsSellProfitsByCurrency(reportData.profitByCurrency.map(trippleMapper));
      setRowsSellProfitsByExchange(reportData.profitByExchange.map(trippleMapper));
      setRowsFeesByCurrency(reportData.feesByCurrency.map(tupleMapper));
      setRowsFeesByExchange(reportData.feesByExchange.map(tupleMapper));
      // ==============================

      setLoading(false);
    }, 0);
  }

  useEffect(async () => {
    await re_load_report();
    return () => {}
  }, [])

  // ------------------------------------

  // TODO
  // TODO
  // TODO
  const onClickShare = () => {
    enqueueSnackbar('Not availlable, yet.', { variant: 'info'});
  }

  const onClickDownloadReport = () => {
    enqueueSnackbar('Not availlable, yet.', { variant: 'info'});
  }

  // ------------------------------------
  
  var content_card = ""
  if (loading){
    content_card = <center><Box p={7}><CircularProgress /></Box></center>
  }
  else if (reportData.hasError()){
    content_card = <div>Error! {reportData.error}</div>
  } else {
    content_card = (
      <Box>
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
                  {reportData.report.title}
              </Typography>
            </Grid>
  
          <Box mt={3}>
            <ReportOverviewBar
              txs={reportData.report.transactions}
              tax_sum={reportData.report.taxable_profit}
              profit_sum={reportData.report.realized_profit}
              deposit_profit={reportData.report.deposit_profit}
              sell_profit={reportData.report.sell_profit}
              fee_sum={reportData.report.fee_sum}
              base_currency={reportData.report.base_currency}
              currencies={reportData.report.currencies}
              wallets={reportData.report.wallets}
            />
          </Box>
        </Box>

        <Box mt={3}>
          <Button variant="outlined" onClick={onClickShare}>SHARE</Button>
          <Button variant="contained" onClick={onClickDownloadReport} style={{ textDecoration: 'none', marginLeft: "1.2rem" }}>DOWNLOAD REPORT CSV's</Button>
        </Box>
  
        <Box mt={3}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={12} md={6} lg={6} xl={4}>
              <Box>
                <div className={classes.toolbar}>
                  <Typography
                    variant="h6"
                    noWrap
                    marginLeft={1.5}
                    component="span">
                      <Grid container alignItems="center"><Receipt /> <span style={{paddingLeft: 10}}>Profits by Currency</span></Grid>
                  </Typography>
                </div>
                <div style={{  width: "100%" }}>
                  <DataGrid
                    rows={rowsProfitsByCurrency}
                    columns={tripple_by_aggregate_columns("Currency", reportData.report.base_currency)}
                    autoHeight={true}
                    initialState={{
                      sorting: {
                        sortModel: [
                          {
                            field: 'sum_taxable_profit',
                            sort: 'desc',
                          },
                        ],
                      },
                      pagination: {
                        pageSize: 5
                      }
                    }}
                  />
                </div>
              </Box>
            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={6} xl={4}>
              <Box>
                <div className={classes.toolbar}>
                  <Typography
                    variant="h6"
                    noWrap
                    marginLeft={1.5}
                    component="span">
                      <Grid container alignItems="center"><Receipt /> <span style={{paddingLeft: 10}}>Profits by Exchange/Wallet</span></Grid>
                  </Typography>
                </div>
                <div style={{ width: "100%" }}>
                  <DataGrid
                    rows={rowsProfitsByExchange}
                    columns={tripple_by_aggregate_columns("Exchange/Wallet", reportData.report.base_currency)}
                    autoHeight={true}
                    initialState={{
                      sorting: {
                        sortModel: [
                          {
                            field: 'sum_taxable_profit',
                            sort: 'desc',
                          },
                        ],
                      },
                      pagination: {
                        pageSize: 5
                      }
                    }}
                  />
                </div>
              </Box>
            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={6} xl={4}>
              <Box>
                <div className={classes.toolbar}>
                  <Typography
                    variant="h6"
                    noWrap
                    marginLeft={1.5}
                    component="span">
                      <Grid container alignItems="center"><Receipt /> <span style={{paddingLeft: 10}}>Fees by Currency</span></Grid>
                  </Typography>
                </div>
                <div style={{ width: "100%" }}>
                  <DataGrid
                    rows={rowsFeesByCurrency}
                    columns={tuple_by_aggregate_columns("Currency", reportData.report.base_currency)}
                    autoHeight={true}
                    initialState={{
                      sorting: {
                        sortModel: [
                          {
                            field: 'fee_sum',
                            sort: 'desc',
                          },
                        ],
                      },
                      pagination: {
                        pageSize: 5
                      }
                    }}
                  />
                </div>
              </Box>
            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={6} xl={4}>
              <Box>
                <div className={classes.toolbar}>
                  <Typography
                    variant="h6"
                    noWrap
                    marginLeft={1.5}
                    component="span">
                      <Grid container alignItems="center"><Receipt /> <span style={{paddingLeft: 10}}>Fees by Exchange/Wallet</span></Grid>
                  </Typography>
                </div>
                <div style={{ width: "100%" }}>
                  <DataGrid
                    rows={rowsFeesByExchange}
                    columns={tuple_by_aggregate_columns("Exchange/Wallet", reportData.report.base_currency)}
                    autoHeight={true}
                    initialState={{
                      sorting: {
                        sortModel: [
                          {
                            field: 'fee_sum',
                            sort: 'desc',
                          },
                        ],
                      },
                      pagination: {
                        pageSize: 5
                      }
                    }}
                  />
                </div>
              </Box>
            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={6} xl={4}>
              <Box>
                <div className={classes.toolbar}>
                  <Typography
                    variant="h6"
                    noWrap
                    marginLeft={1.5}
                    component="span">
                      <Grid container alignItems="center"><Receipt /> <span style={{paddingLeft: 10}}>Fees by Currency</span></Grid>
                  </Typography>
                </div>
                <div style={{ width: "100%" }}>
                  <DataGrid
                    rows={rowsSellProfitsByCurrency}
                    columns={tripple_by_aggregate_columns("Currency", reportData.report.base_currency)}
                    autoHeight={true}
                    initialState={{
                      sorting: {
                        sortModel: [
                          {
                            field: 'sum_taxable_profit',
                            sort: 'desc',
                          },
                        ],
                      },
                      pagination: {
                        pageSize: 5
                      }
                    }}
                  />
                </div>
              </Box>
            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={6} xl={4}>
              <Box>
                <div className={classes.toolbar}>
                  <Typography
                    variant="h6"
                    noWrap
                    marginLeft={1.5}
                    component="span">
                      <Grid container alignItems="center"><Receipt /> <span style={{paddingLeft: 10}}>Fees by Exchange/Wallet</span></Grid>
                  </Typography>
                </div>
                <div style={{ width: "100%" }}>
                  <DataGrid
                    rows={rowsSellProfitsByExchange}
                    columns={tripple_by_aggregate_columns("Exchange/Wallet", reportData.report.base_currency)}
                    autoHeight={true}
                    initialState={{
                      sorting: {
                        sortModel: [
                          {
                            field: 'sum_taxable_profit',
                            sort: 'desc',
                          },
                        ],
                      },
                      pagination: {
                        pageSize: 5
                      }
                    }}
                  />
                </div>
              </Box>
            </Grid>
          </Grid>
        </Box>
  
      </Box>
    );
  }


{/* TODO: export to PDF */}
{/* TODO: list sell orders (consumers buy-sell pair) */}
  

  return (
      <PageWrapper>
        <CryptoTaxBreadcrubs items={[
          {
            title: "Portfolios", 
            href: "/portfolios/", 
            icon: <AccountBalanceWalletIcon sx={{ mr: 0.5 }} fontSize="inherit" />
          },
          {
            title: pid, 
            href: link_portfolio(pid), 
            icon: null
          },
          {
            title: "Report", 
            href: "", 
            icon: <CloudUploadIcon sx={{ mr: 0.5 }} fontSize="inherit" />
          },
          {
            title: rid, 
            href: "", 
            icon: null
          },
        ]} />
        <Paper className={classes.content}>
          { content_card }
        </Paper>
      </PageWrapper>
  );

}

export default ReportPage;
