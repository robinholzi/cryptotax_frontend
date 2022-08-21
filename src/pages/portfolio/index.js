
import React, { useEffect, useState } from 'react';

import { Autocomplete, Button, CircularProgress, Container, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControl, FormHelperText, FormLabel, Grid, Icon, IconButton, Input, InputAdornment, InputLabel, Link, ListItem, MenuItem, OutlinedInput, Paper, Select, Slide, styled, TextField, ToggleButton, ToggleButtonGroup, Toolbar, Typography } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { makeStyles } from '@mui/styles';
import { blue, blueGrey, deepOrange, green, lightGreen, orange, red } from '@mui/material/colors';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import { InfoCard, SmallInfoCard, SmallPlainInfoCard } from '../../components/cards/infocard';
import { Box, fontSize } from '@mui/system';
import { AccountBalance, Add, Assessment, CompareArrows, Delete, Info, Launch, MoveToInbox, Receipt, Share, ShoppingCart, Title, Visibility, VisibilityOff } from '@mui/icons-material';
import { link_portfolio, link_portfolio_import, link_report } from '../../links/links';
import { useSearchParams } from 'react-router-dom';
import TransactionInfoDialog from './transaction_info';
import ReportInfoDialog from './report_info';
import { AnalysisMode, analysisModeStringList, PortfolioData, portfolio_data, 
  portfolio_reports, portfolio_txs, portfolio_update, ReportListData, TransferAlgo, 
  transferAlgoStringList, transferAlgoFromString, MiningTaxMethod, miningTaxMethodFromString, stringFromMiningTaxMethodLong, miningTaxMethodStringList, miningTaxMethodList, stringFromMiningTaxMethod, reports_delete, portfolio_report_create, OrderListData, DepositListData, TransferListData, portfolio_orders, portfolio_deposits, portfolio_transfers, portfolio_txs_delete } from '../../api/portfolio/portfolio_api';
import {useParams} from 'react-router-dom';
import { useSnackbar } from 'notistack';
import { stringIsEmpty } from '../../utils/string';
import { CurrencyListData, currency_list } from '../../api/portfolio/currency_api.ts'
import { HoverSelectField } from '../../components/forms/HoverSelectField';
import { MUISwitch } from '../../components/forms/CustomIconSwitch';
import { deposits_columns, orders_columns, report_columns, transfers_columns } from './table_columns';
import { ReportSanitizationError, sanitize_report } from './report_creation';
import { insertUrlParam, removeUrlParameter } from '../../controller/util/url_util';
import { useStyles_mainCard } from '../../styles/general/main_card';
import { CryptoTaxBreadcrubs } from '../../components/widgets/breadcrubs';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import DateTimePicker from '@mui/lab/DateTimePicker';
import { ParsedTransfer } from '../../model/txs/transfer';
import { ParsedDeposit } from '../../model/txs/deposit';
import { ParsedOrder } from '../../model/txs/order';
import { portfolio_insert_deposits, portfolio_insert_orders, portfolio_insert_transfers } from '../../api/portfolio/txs_api';



// TODO tooltips
//   <Tooltip title="Delete">
//   <IconButton>
//     <DeleteIcon />
//   </IconButton>
// </Tooltip>

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function PageWrapper({children}) {
  return <Container>
      {children}
  </Container>
}

// TODO: on edit report title within row... 

function PortfolioPage({ token }) {
  const classes = useStyles_mainCard();
  const { enqueueSnackbar } = useSnackbar();

  // portfolio id
  const { id: pid } = useParams();
  
  // [query params] ----------
  const [searchParams, setSearchParams] = useSearchParams();
  const [transaction_page, setTransactionPage] = useState(searchParams.get("tt") ?? 0);
  const [pageSizeReports, setPageSizeReports] = useState(parseInt(searchParams.get("r_size") ?? 25));
  const [pageSizeTxs, setPageSizeTxs] = useState(parseInt(searchParams.get("t_size") ?? 25));
  const [pageNumberReports, setPageNumberReports] = useState(parseInt(searchParams.get("r_page") ?? 1));
  const [pageNumberTxs, setPageNumberTxs] = useState(parseInt(searchParams.get("t_page") ?? 1));
  // -------------------------
  
  // ---
  var update_page_size_reports = async (page_size) => {
    const size = Math.max(5, Math.min(100, page_size));
    insertUrlParam('r_size', size);
    setPageSizeReports(size);
    switch_page_reports(1, false);
    re_load_reportlist(size, 1);
  }
  var switch_page_reports = async (page_number, reload=false) => { // 1-based argument
    const number = Math.max(1, page_number);
    insertUrlParam('r_page', number);
    setPageNumberReports(number);
    if (reload) re_load_reportlist(pageSizeReports, number);
  }
  var update_page_size_txs = async (page_size) => {
    const size = Math.max(5, Math.min(100, page_size));
    insertUrlParam('t_size', size);
    setPageSizeTxs(size);
    switch_page_txs(1, false);
    re_load_txs(transaction_page, size, 1);
  }
  var switch_page_txs = async (page_number, reload=false) => { // 1-based argument
    const number = Math.max(1, page_number);
    insertUrlParam('t_page', number);
    setPageNumberTxs(number);
    if (reload) re_load_txs(transaction_page, pageSizeTxs, number);
  }
  var switch_tt_tab = async (tab) => {
    insertUrlParam('tt', tab); // transaction type (tt)
    setTransactionPage(tab);
    switch_page_txs(1, false);
    re_load_txs(tab, pageSizeTxs, pageNumberTxs);
  }
  // ---

  const [loading, setLoading] = useState(true);
  const [titleUpdateLoading, setTitleUpdateLoading] = useState(false);
  const [loadingReports, setLoadingReports] = useState(true);
  const [loadingTxs, setLoadingTxs] = useState(true);
  const [inputsBlocked, setInputsBlocked] = useState(false);
  const [portfolioData, setPortfolioListData] = useState(new PortfolioData(pid));
  const [portfolioReports, setPortfolioReports] = useState(new ReportListData());
  const [portfolioOrderData, setPortfolioOrderData] = useState(new OrderListData());
  const [portfolioDepositData, setPortfolioDepositData] = useState(new DepositListData());
  const [portfolioTransferData, setPortfolioTransferData] = useState(new TransferListData());
  
  // ----------
  const [rowsReports, setRowsReports] = useState([])
  const [rowsTxs, setRowsTxs] = useState([])
  const [reportRowCount, setReportRowCount] = useState(0);
  const [txsRowCount, setTxsRowCount] = useState(0);
  // ----------
  
  const [selectionModelReports, setSelectionModelReports] = useState([]);
  const [editReportRowsModel, setEditReportRowsModel] = React.useState({});
  
  const [selectionModelTxs, setSelectionModelTxs] = useState([]);
  const [editRowsModelTxs, setEditRowsModelTxs] = React.useState({});

  const [currenciesLoading, setCurrenciesLoading] = useState(true);
  const [currencyListData, setCurrencyListData] = useState(new CurrencyListData());
  
  // Load currencies ==========================
  useEffect(async () => {
    setTimeout(async () => {
      await currency_list(token, currencyListData);
      setCurrenciesLoading(false);
    }, 0);
  }, [])
  // ==========================================

  const re_load_portfolio = async () => {
    re_load_data();
    re_load_reportlist();
    re_load_txs(transaction_page);
  }

  const re_load_data = async () => {
    setTimeout(async () => {
      setLoading(true);
      await portfolio_data(token, portfolioData);
      setLoading(false);
    }, 0);
  }
  
  const re_load_reportlist = async (size, number) => {
    setLoadingReports(true);
    setTimeout(async () => {
      await portfolio_reports(token, pid, portfolioReports,
        size || (pageSizeReports ?? 25), 
        number || (pageNumberReports ?? 1)
      );
      var new_rows = [];
      for (const pf of portfolioReports.dataList) {
        let modeStr = ""
        if (pf.failed) {
          modeStr = "❌";
        }
        else {
          switch (pf.mode) {
            case AnalysisMode.PROCESSING: modeStr = "⌛"; break;
            case AnalysisMode.ANALYSING: modeStr = "⌛⌛"; break;
            case AnalysisMode.FINISHED: modeStr = "✔️"; break;
            default: modeStr = "❌";
          }
        }

        new_rows.push({ 
          id: pf.analysis_id, 
          title: pf.title,
          created: pf.created, // ).toLocaleString()
          mode: modeStr,
          algo: pf.algo,
          transfer_algo: pf.transfer_algo,
          base_currency: pf.base_currency,
          
          transactions: pf.transactions, 
          currencies: pf.currencies, 
          wallets: pf.wallets, 
          tax_vs_realized_profit: pf.taxable_profit.toPrecision(5) + " / " + pf.realized_profit.toPrecision(4), 
          fee_sum: pf.fee_sum, 
          progress: pf.progress * 100.0, 
          msg: pf.msg, 
        });
      }
      setReportRowCount(portfolioReports.number_reports ?? 0);
      setRowsReports(new_rows)
      setLoadingReports(false);
    }, 0);
  }
  
  const re_load_txs = async (transaction_page, size, number) => {
    setLoadingTxs(true);
    setTimeout(async () => {
      if (transaction_page == 0) {
        // orders
        await portfolio_orders(token, pid, portfolioOrderData,
          size || (pageSizeTxs ?? 25), 
          number || (pageNumberTxs ?? 1)
        );
        var new_rows = [];
        for (const order of portfolioOrderData.txs) {
          new_rows.push({ 
            id: order.tid, 
            datetime: order.datetime,
            exchange_wallet: order.exchange_wallet,
            fee_currency: order.fee_currency,
            fee: order.fee,
            
            oid: order.oid, 
            from_currency: order.from_currency, 
            from_amount: order.from_amount, 
            to_currency: order.to_currency, 
            to_amount: order.to_amount
          });
        }
        setTxsRowCount(portfolioOrderData.number_txs ?? 0);
        setRowsTxs(new_rows)

      } else if (transaction_page == 1) {
        // deposits
        await portfolio_deposits(token, pid, portfolioDepositData,
          size || (pageSizeTxs ?? 25), 
          number || (pageNumberTxs ?? 1)
        );
        var new_rows = [];
        for (const deposit of portfolioDepositData.txs) {
          new_rows.push({ 
            id: deposit.tid, 
            datetime: deposit.datetime,
            exchange_wallet: deposit.exchange_wallet,
            fee_currency: deposit.fee_currency,
            fee: deposit.fee,
            
            did: deposit.did, 
            buy_datetime: deposit.buy_datetime, 
            currency: deposit.currency, 
            amount: deposit.amount, 
            taxable: deposit.taxable,
            type: deposit.type
          });
        }
        setTxsRowCount(portfolioDepositData.number_txs ?? 0);
        setRowsTxs(new_rows)

      } else {
        // transfers
        await portfolio_transfers(token, pid, portfolioTransferData,
          size || (pageSizeTxs ?? 25), 
          number || (pageNumberTxs ?? 1)
        );
        var new_rows = [];
        for (const transfer of portfolioTransferData.txs) {
          new_rows.push({ 
            id: transfer.tid, 
            datetime: transfer.datetime,
            exchange_wallet: transfer.exchange_wallet,
            fee_currency: transfer.fee_currency,
            fee: transfer.fee,
            
            tfid: transfer.tfid, 
            currency: transfer.currency, 
            amount: transfer.amount, 
            from_exchange_wallet: transfer.from_exchange_wallet
          });
        }
        setTxsRowCount(portfolioTransferData.number_txs ?? 0);
        setRowsTxs(new_rows)
      }
      setLoadingTxs(false);
    }, 0);
  }

  useEffect(async () => {
    await re_load_portfolio();
    return () => {}
  }, [])

  // ------------------------------------
  // TODO: Message queue or something to reduce number of API calls
  const changePortfolioName = (newVal) => {
    console.log(newVal)
    setTitleUpdateLoading(true);
    setTimeout(async () => {
      const res = await portfolio_update(token, pid, newVal);
      if (res == "success") {
        enqueueSnackbar('Portfolio name updated.', { variant: 'success'});
      } else {
        enqueueSnackbar('Portfolio name updated failed!', { variant: 'error' });
      }
      setTitleUpdateLoading(false);
    }, 0);
  }
  // ------------------------------------

  const [createReportDialogOpen, setCreateDialogOpen] = React.useState(false);
  const [newReportName, setNewReportName] = React.useState("");
  const [newReportBaseCurrencyTag, setNewReportBaseCurrencyTag] = React.useState("");
  const [newReportAnalysisAlgorithm, setNewReportAnalysisAlgorithm] = React.useState(null);
  const [newReportTransferAlgorithm, setNewReportTransferAlgorithm] = React.useState(null);
  const [newReportUntaxedAllowance, setNewReportUntaxedAllowance] = React.useState(0.0);
  const [newReportTaxablePeriod, setNewReportTaxablePeriod] = React.useState(-1);
  const [newReportMiningTaxMethod, setNewReportMiningTaxMethod] = React.useState(null);
  const [newReportMiningDepositProfitRate, setNewReportMiningDepositProfitRate] = React.useState(0.0);
  const [newReportAllowCrossWalletSells, setNewReportAllowCrossWalletSells] = React.useState(false);
  const openCreateReportDialog = async () => {
    setNewReportName("");
    setCreateDialogOpen(true);
  };
  const closeCreateReportDialog = async () => setCreateDialogOpen(false);
  const confirmCreateReport = async () => {
    try {
      const val_res = sanitize_report(
        currencyListData.currency_tags,
        newReportName, 
        newReportBaseCurrencyTag,
        newReportAnalysisAlgorithm,
        newReportTransferAlgorithm,
        newReportUntaxedAllowance,
        newReportTaxablePeriod,
        newReportMiningTaxMethod,
        newReportMiningDepositProfitRate,
        newReportAllowCrossWalletSells,
      )

      setLoadingReports(true);
      
      // API CALL
      const res = await portfolio_report_create(token, pid,
        val_res.reportName, 
        val_res.baseCurrencyTag,
        val_res.analysisAlgorithm,
        val_res.transferAlgorithm,
        val_res.untaxedAllowance,
        val_res.taxablePeriodDays,
        val_res.miningTaxMethod,
        val_res.miningDepositProfitRate,
        val_res.allowCrossWalletSells
      );
    
      if (res==="success") {
        enqueueSnackbar('Created portfolio!', { variant: 'success'});
        setLoadingReports(false);
        setTimeout(async () => {
          await re_load_reportlist();
        }, 400);
      } else {
        enqueueSnackbar('Creating portfolio failed: ' + res, { variant: 'error' });
        setLoadingReports(false);
      }

    } catch (ex) {
      if (ex instanceof ReportSanitizationError) {
        enqueueSnackbar(ex.msg, { variant: ex.severity });
        setLoadingReports(false);
        // specific error
      } else throw ex;
    }
    closeCreateReportDialog();
    setLoadingReports(false);

    return;
  }

  // ------------------------------------

  const [confirmReportDeleteOpen, setReportConfirmDeleteOpen] = useState(false);
  const clickReportDelete = async () => {
    
    if (selectionModelReports.length < 1) {
      enqueueSnackbar('You have to select a report first!', { variant: 'error' });
      return;
    }
    setReportConfirmDeleteOpen(true);

    return;
  }
  const closeReportDeleteConfirm = async () => {
    setReportConfirmDeleteOpen(false);
    return;
  }
  const deleteSelectedReports = async () => {
    setReportConfirmDeleteOpen(false);
    setInputsBlocked(true);
    const selected = selectionModelReports;
    const res = await reports_delete(token, pid, selected.toString());
    if (res==="success") {
      enqueueSnackbar('Deleted reports!', { variant: 'success'});
      const newRows = rowsReports.filter((value, index) => 
        (value != null && !selected.some((val) => val===value.id) )
      );
      setRowsReports(newRows);
    } else {
      enqueueSnackbar('Deleting reports failed: ' + res, { variant: 'error' });
    }
    setInputsBlocked(false);
    return;
  }
  
  // ------------------------------------

  const [shareReportDialogOpen, setShareReportDialogOpen] = useState(false);
  const clickShareReport = async () => {
    if (selectionModelReports.length < 1) {
      enqueueSnackbar('You have to select a reports first!', { variant: 'error' });
      return;
    }
    if (selectionModelReports.length > 1) {
      enqueueSnackbar('You can only share 1 report at a time!', { variant: 'error' });
      return;
    }
    setShareReportDialogOpen(true);
    return;
  }
  const closeShareReportDialog = async () => {
    setShareReportDialogOpen(false);
    return;
  }
  const shareReport = async () => {
    if (selectionModelReports.length < 1) {
      setShareReportDialogOpen(false);
      return;
    }
    const rid = selectionModelReports[0];
    console.log("share!, rid:", rid);
    enqueueSnackbar('This feature is not implemented, yet!', { variant: 'warning'}); // TODO
    setShareReportDialogOpen(false);
    return;
  }

  // ------------------------------------
  const [createTxDialogOpen, setCreateTxDialogOpen] = React.useState(false);
  const [newTxType, setNewTxType] = React.useState("order");
  const [newTxDatetime, setNewTxDatetime] = React.useState(new Date());
  const [newTxFee, setNewTxFee] = React.useState(0);
  const [newTxFeeCurrency, setNewTxFeeCurrency] = React.useState("USD");
  const [newTxExchange_to, setNewTxExchange_to] = React.useState("");

  const [newTransferExchangeFrom, setNewTransferExchangeFrom] = React.useState("");

  const [newOrderFromAmount, setNewOrderFromAmount] = React.useState(0);
  const [newOrderFromCurrency, setNewOrderFromCurrency] = React.useState("");
  const [newOrderToAmount, setNewOrderToAmount] = React.useState(0);
  const [newOrderToCurrency, setNewOrderToCurrency] = React.useState("");

  const [newDepositTransferAmount, setNewDepositTransferAmount] = React.useState(0);
  const [newDepositTransferCurrency, setNewDepositTransferCurrency] = React.useState("");

  const [newDepositBuyDate, setNewDepositBuyDate] = React.useState(null);
  const [newDepositTaxable, setNewDepositTaxable] = React.useState(0);  // in %
  const [newDepositType, setNewDepositType] = React.useState('G');
  
  // ERRORS -------------------------------------------------------
  const [errorNewTxExchange_to, setErrorNewTxExchange_to] = React.useState("");
  const [errornewTxFee, setErrorNewTxFee] = React.useState("");
  const [errorNewTxFeeCurrency, setErrorNewTxFeeCurrency] = React.useState("");

  const [errorNewTransferExchangeFrom, setErrorNewTransferExchangeFrom] = React.useState("");
  
  const [errorNewOrderFromAmount, setErrorNewOrderFromAmount] = React.useState("");
  const [errorNewOrderFromCurrency, setErrorNewOrderFromCurrency] = React.useState("");
  const [errorNewOrderToAmount, setErrorNewOrderToAmount] = React.useState("");
  const [errorNewOrderToCurrency, setErrorNewOrderToCurrency] = React.useState("");

  const [errorNewDepositTransferAmount, setErrorNewDepositTransferAmount] = React.useState("");
  const [errorNewDepositTransferCurrency, setErrorNewDepositTransferCurrency] = React.useState("");
  
  const [errorNewDepositTaxable, setErrorNewDepositTaxable] = React.useState("");
  
  // --------------------------------------------------------------

  const openCreateTxDialog = async () => {
    clearNewTxErrors();
    setCreateTxDialogOpen(true);
  };
  const closeCreateTxDialog = async () => setCreateTxDialogOpen(false);
  const clearNewTxErrors = () => {
    setErrorNewTxExchange_to("");
    setErrorNewTxFee("");
    setErrorNewTxFeeCurrency("");

    setErrorNewTransferExchangeFrom("");

    setErrorNewOrderFromAmount("");
    setErrorNewOrderFromCurrency("");
    setErrorNewOrderToAmount("");
    setErrorNewOrderToCurrency("");

    setErrorNewDepositTransferAmount("");
    setErrorNewDepositTransferCurrency("");

    setErrorNewDepositTaxable("");
  }
  const confirmCreateTx = async () => {
    clearNewTxErrors();
    let error = false;

    if (newTxDatetime == null || newTxDatetime == undefined) {
      // ("must not be empty!");
      enqueueSnackbar('Datetime must not be null!', { variant: 'error' });
      error = true;
    }

    if (stringIsEmpty(newTxExchange_to) || newTxExchange_to.length < 1) {
      setErrorNewTxExchange_to("must not be empty!");
      enqueueSnackbar('Exchange/wallet must not be empty!', { variant: 'error' });
      error = true;
    }
    
    if (newTxFee < 0) {
      setErrorNewTxFee("must be >= 0!");
      enqueueSnackbar('Fee amount must be >= 0!', { variant: 'error' });
      error = true;
    }

    let san_depositTaxable;
    if (newTxType === 'order') {
      if (newOrderFromAmount <= 0) {
        setErrorNewOrderFromAmount("must be greater than 0!");
        enqueueSnackbar('From amount must be greater than 0!', { variant: 'error' });
        error = true;
      }
      if ((newOrderFromCurrency ?? "").length < 1) {
        setErrorNewOrderFromCurrency("must not be empty!");
        enqueueSnackbar('From currency must not be empty!', { variant: 'error' });
        error = true;
      }
      if (newOrderToAmount <= 0) {
        setErrorNewOrderToAmount("must be greater than 0!");
        enqueueSnackbar('To amount must be greater than 0!', { variant: 'error' });
        error = true;
      }
      if ((newOrderToCurrency ?? "").length < 1) {
        setErrorNewOrderToCurrency("must not be empty!");
        enqueueSnackbar('To currency must not be empty!', { variant: 'error' });
        error = true;
      }

    } else if (newTxType === 'deposit') {
      if (newDepositTaxable < 0 || newDepositTaxable > 100) {
        errorNewDepositTaxable("must be >=0 and <=1!");
        enqueueSnackbar('"Taxable" must be >=0 and <=1!', { variant: 'error' });
        error = true;
      }
      san_depositTaxable = Math.max(0, Math.min(100, newDepositTaxable)) / 100.0;
    } else { // 2: transfer
      if (stringIsEmpty(newTransferExchangeFrom) || newTransferExchangeFrom.length < 1) {
        setErrorNewTransferExchangeFrom("must not be empty!");
        enqueueSnackbar('Exchange/wallet must not be empty!', { variant: 'error' });
        error = true;
      }
      if (newTransferExchangeFrom === newTxExchange_to) {
        setErrorNewTransferExchangeFrom("Must differ from <to exchange>!");
        enqueueSnackbar('From and to exchange must not be equal!', { variant: 'error' });
        error = true;
      }
    }
    if (newTxType === 'deposit' || newTxType === 'transfer') {
      if (newDepositTransferAmount <= 0) {
        setErrorNewDepositTransferAmount("must be greater than 0!");
        enqueueSnackbar('Amount must be greater than 0!', { variant: 'error' });
        error = true;
      }
      if ((newDepositTransferCurrency ?? "").length < 1) {
        setErrorNewDepositTransferCurrency("must not be empty!");
        enqueueSnackbar('Currency must not be empty!', { variant: 'error' });
        error = true;
      }
    }
    
    if (error) return;

    closeCreateTxDialog();
    setLoadingTxs(true);

    // API CALL
    let res;
    if (newTxType === 'order') {
      const tx = new ParsedOrder(
        newTxDatetime, newTxExchange_to,
        newTxFee, newTxFeeCurrency,

        newOrderFromCurrency,
        newOrderToCurrency,
        newOrderFromAmount,
        newOrderToAmount
      )
      res = await portfolio_insert_orders(token, pid, [tx]);
    } else if (newTxType === 'deposit') {
      const tx = new ParsedDeposit(
        newTxDatetime, newTxExchange_to,
        newTxFee, newTxFeeCurrency,

        newDepositType,
        newDepositBuyDate ?? newTxDatetime,
        newDepositTransferAmount,
        newDepositTransferCurrency,
        san_depositTaxable
      )
      res = await portfolio_insert_deposits(token, pid, [tx]);
      
    } else { // transfer
      const tx = new ParsedTransfer(
        newTxDatetime, newTxExchange_to,
        newTxFee, newTxFeeCurrency,

        newTransferExchangeFrom,
        newDepositTransferAmount,
        newDepositTransferCurrency,
      )
      res = await portfolio_insert_transfers(token, pid, [tx]);

    }

    if (res === "success") {
      enqueueSnackbar('Created Tx!', { variant: 'success'});

      setTimeout(async () => {
        await re_load_txs(transaction_page);
      }, 100);
    } else {
      enqueueSnackbar('Creating Tx failed: ' + res, { variant: 'error' });
      setLoading(false);
    }

    return;
  }

  // ------------------------------------

  const [confirmTxsDeleteOpen, setTxsConfirmDeleteOpen] = useState(false);
  const clickTxsDelete = async () => {
    
    if (selectionModelTxs.length < 1) {
      enqueueSnackbar('You have to select a report first!', { variant: 'error' });
      return;
    }
    setTxsConfirmDeleteOpen(true);

    return;
  }
  const closeTxsDeleteConfirm = async () => {
    setTxsConfirmDeleteOpen(false);
    return;
  }
  const deleteSelectedTxs = async () => {
    setTxsConfirmDeleteOpen(false);
    setInputsBlocked(true);

    const selected = selectionModelTxs; // tids
    const res = await portfolio_txs_delete(token, pid, selected.toString());
    if (res==="success") {
      enqueueSnackbar('Deleted Txs!', { variant: 'success'});
      const newRows = rowsTxs.filter((value, index) => 
        (value != null && !selected.some((val) => val===value.id) )
      );
      setRowsTxs(newRows);
    } else {
      enqueueSnackbar('Deleting Txs failed: ' + res, { variant: 'error' });
    }

    setInputsBlocked(false);
    return;
  }

  // ------------------------------------

  // TODO
  const handleEditReportRowsModelChange = React.useCallback((model) => {
    // for (const attr of model) {
    //   console.log("handleEditRowsModelChange -> ", attr)
    // }
    // console.log("model: ", model)
    // console.log("model.key: ", model.key)
    // console.log("model.keys: ", model.keys)
    // rows = rows.map((v, i) => (v['id']==) )
    setEditReportRowsModel(model);
  }, []);
  const handleEditReportRowsCommit = React.useCallback(async (pid) => {
  //   // TODO
  //   // TODO
  }, []);

  const loadingButtonReplacor = <span style={{marginRight: 10}}><CircularProgress size={30} /></span>

  // ------------------------------------

  // TODO
  const handleEditTxRowsModelChange = React.useCallback((model) => {
    // for (const attr of model) {
    //   console.log("handleEditRowsModelChange -> ", attr)
    // }
    // console.log("model: ", model)
    // console.log("model.key: ", model.key)
    // console.log("model.keys: ", model.keys)
    // rows = rows.map((v, i) => (v['id']==) )
    setEditRowsModelTxs(model);
  }, []);
  const handleEditTxRowsCommit = React.useCallback(async (pid) => {
  //   // TODO
  //   // TODO
  }, []);

  // ------------------------------------

  // TODO make transfers editable 
  {/* TODO editable transactions, dateppicker */}
  var content_card = ""
  if (loading){
    content_card = <center><Box p={7}><CircularProgress /></Box></center>
  }
  else if (portfolioData.hasError()){
    content_card = <div>Error! {portfolioData.error}</div>
  } else {
    var datagrid_reports = ""
    var datagrid_transaction = ""
    if (portfolioReports.hasError()){
      datagrid_reports = <div>Error! {portfolioReports.error}</div>
    }
    else {
      datagrid_reports = (
        <DataGrid 
          rows={rowsReports} 
          columns={report_columns(pid)}
          checkboxSelection
          autoHeight

          paginationMode='server'
          loading={loadingReports}
          rowCount={reportRowCount}
          pageSize={pageSizeReports}
          page={pageNumberReports-1}
          onPageSizeChange={(pageSize, _) => { update_page_size_reports(pageSize); }}
          onPageChange={(page, _) => { switch_page_reports(page+1, true); }}

          onSelectionModelChange={ (newSelection) => { 
            setSelectionModelReports(newSelection);
          } }
          selectionModel={selectionModelReports} 
          editRowsModel={editReportRowsModel}
          editMode="row"
          onEditRowsModelChange={handleEditReportRowsModelChange}
          onRowEditCommit={handleEditReportRowsCommit}
        />
      )  
    }

    if (transaction_page == 0) {
      if (portfolioOrderData.hasError()){
        datagrid_transaction = <div>Error! {portfolioReports.error}</div>
      } else {
        datagrid_transaction = (
          <div style={{ height: 300, width: "100%" }}>
            <DataGrid 
              rows={rowsTxs} 
              columns={orders_columns} 
              checkboxSelection
              
              paginationMode='server'
              loading={loadingTxs}
              rowCount={txsRowCount}
              pageSize={pageSizeTxs}
              page={pageNumberTxs-1}
              onPageSizeChange={(pageSize, _) => { update_page_size_txs(pageSize); }}
              onPageChange={(page, _) => { switch_page_txs(page+1, true); }}

              onSelectionModelChange={ (newSelection) => { 
                setSelectionModelTxs(newSelection);
              } }
              selectionModel={selectionModelTxs} 
              editRowsModel={editRowsModelTxs}
              editMode="row"
              onEditRowsModelChange={handleEditTxRowsModelChange}
              onRowEditCommit={handleEditTxRowsCommit}
            />
          </div>
        )
      }
    } else if (transaction_page == 1) {
      if (portfolioDepositData.hasError()){
        datagrid_transaction = <div>Error! {portfolioReports.error}</div>
      } else {
        datagrid_transaction = (
          <div style={{ height: 300, width: "100%" }}>
            <DataGrid 
              rows={rowsTxs} 
              columns={deposits_columns}
              checkboxSelection
              
              paginationMode='server'
              loading={loadingTxs}
              rowCount={txsRowCount}
              pageSize={pageSizeTxs}
              page={pageNumberTxs-1}
              onPageSizeChange={(pageSize, _) => { update_page_size_txs(pageSize); }}
              onPageChange={(page, _) => { switch_page_txs(page+1, true); }}

              onSelectionModelChange={ (newSelection) => { 
                setSelectionModelTxs(newSelection);
              } }
              selectionModel={selectionModelTxs} 
              editRowsModel={editRowsModelTxs}
              editMode="row"
              onEditRowsModelChange={handleEditTxRowsModelChange}
              onRowEditCommit={handleEditTxRowsCommit}
            />
          </div>
        )
      }
    } else { // if (transaction_page == 2)
      if (portfolioTransferData.hasError()){
        datagrid_transaction = <div>Error! {portfolioReports.error}</div>
      } else {
        datagrid_transaction = (
          <div style={{ height: 300, width: "100%" }}>
            <DataGrid 
              rows={rowsTxs} 
              columns={transfers_columns}
              checkboxSelection

              paginationMode='server'
              loading={loadingTxs}
              rowCount={txsRowCount}
              pageSize={pageSizeTxs}
              page={pageNumberTxs-1}
              onPageSizeChange={(pageSize, _) => { update_page_size_txs(pageSize); }}
              onPageChange={(page, _) => { switch_page_txs(page+1, true); }}

              onSelectionModelChange={ (newSelection) => { 
                setSelectionModelTxs(newSelection);
              } }
              selectionModel={selectionModelTxs} 
              editRowsModel={editRowsModelTxs}
              editMode="row"
              onEditRowsModelChange={handleEditTxRowsModelChange}
              onRowEditCommit={handleEditTxRowsCommit}
            />
          </div>
        )
      }
    }

    content_card = <Box>
      <Box component="main">
          <Grid container pl={1.5} spacing="1" alignItems="center">
            <AccountBalanceWalletIcon />
            <Box pl={2}>
              <TextField id="outlined-basic" label="Title" variant="outlined" 
                style={{ fontWeight: 600 }}
                defaultValue={portfolioData.portfolio.title} 
                onChange={(event) => { changePortfolioName(event.target.value); }}
              />
            </Box>
            { titleUpdateLoading ? <Box pl={2}><CircularProgress /></Box> : ""
            }
          </Grid>
          
          <Grid
            container
            spacing={3}
            mt={1}
          >
            <Grid
              item
              lg={2}
              sm={3}
              xl={2}
              xs={3}
            >
              <SmallPlainInfoCard title="Transactions" value={portfolioData.portfolio.transactions} /> {/* <Receipt style={{color: 'white'}} />   */}
            </Grid>
            <Grid
              item
              lg={2}
              sm={3}
              xl={2}
              xs={3}
            >
              <SmallPlainInfoCard title="Wallets" value={portfolioData.portfolio.exchanges} /> {/* <AccountBalanceWalletIcon style={{color: 'white'}} />   */}
            </Grid>
            <Grid
              item
              lg={2}
              sm={3}
              xl={2}
              xs={3}
            >
              <SmallPlainInfoCard title="Realized Profit" value={
                portfolioData.portfolio.latest_report_profit 
                ? `${portfolioData.portfolio.latest_report_profit.toPrecision(5)} ${portfolioData.portfolio.latest_report_currency}`
                : ""
                } /> {/* <AccountBalance style={{color: 'white'}} />   */}
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
            {
              inputsBlocked 
              ? loadingButtonReplacor
              : 
                <div>
                  <ReportInfoDialog />
                  <Button
                      variant="contained"
                      style={{ 
                        backgroundColor: green[400],
                        color: "white"
                      }}
                      startIcon={<Add />}
                      classes={{
                        endIcon: classes.endIcon,
                      }}
                      onClick={ openCreateReportDialog }
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
                      classes={{
                        endIcon: classes.endIcon,
                      }}
                      onClick={ clickReportDelete }
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
                      classes={{
                        endIcon: classes.endIcon,
                      }}
                      onClick={ clickShareReport }
                  >
                    Share
                  </Button>
                </div>
            }
          </div>
          <div style={{ width: "100%" }}>
            {datagrid_reports}
          </div>

          {/* ========================================= */}
          <Dialog open={createReportDialogOpen} onClose={closeCreateReportDialog}>
            <DialogTitle>Create new Report</DialogTitle>
            <DialogContent>
              
              <Box pb={2} pl={2} pr={2}>
                { 
                  (currenciesLoading)
                  ? <Box pt={2}><CircularProgress /></Box>
                  : (
                    (currencyListData.hasError())
                    ? `Error: ${currencyListData.error}`
                    : (<Box>
                      <TextField
                        autoFocus
                        margin="dense"
                        id="title"
                        label="Report title"
                        type="text"
                        fullWidth
                        variant="standard"
                        onChange={ (e) => setNewReportName(e.target.value) }
                      />
                      <Box marginTop={2}><Autocomplete
                        disablePortal
                        id="combo-box-demo"
                        options={currencyListData.currency_tags}
                        sx={{ width: 300 }}
                        onChange={ (_, newValue) => setNewReportBaseCurrencyTag(newValue) }
                        renderInput={(params) => <TextField {...params} 
                          label="Base Currency" 
                          onChange={ (e) => setNewReportBaseCurrencyTag(e.target.value) }
                        />}
                      /></Box>
                      <Box marginTop={2}><FormLabel>Analysis Algorithm</FormLabel></Box>
                      <HoverSelectField marginTop={2}
                        placeholder="FIFO (default)" options={
                          transferAlgoStringList.map(
                            (val) => (
                              {
                                label: (transferAlgoFromString(val) == TransferAlgo.ALGO_FIFO) ? (val + " (default)") : val, 
                                value: val
                              }
                            )
                          )
                        }
                        onElementSelect= { ((val) => { setNewReportAnalysisAlgorithm(val) }) }
                      />
                      <Box marginTop={2}><FormLabel>Transfer Algorithm</FormLabel></Box>
                      <HoverSelectField marginTop={2}
                        placeholder="FIFO (default)" options={
                          transferAlgoStringList.map(
                            (val) => (
                              {
                                label: (transferAlgoFromString(val) == TransferAlgo.ALGO_FIFO) ? (val + " (default)") : val, 
                                value: val
                              }
                            )
                          )
                        } 
                        onElementSelect= { ((val) => { setNewReportTransferAlgorithm(val) }) }
                      />

                      <Box marginTop={2}>
                        <FormControl sx={{ m: 1, width: '25ch' }} variant="standard">
                          <InputLabel htmlFor="create-report-untaxed-allowance">Untaxed allowance</InputLabel>
                          <Input
                            id="create-report-untaxed-allowance"
                            type="number"
                            defaultValue={0}
                            sx={{ m: 1, width: '25ch' }}
                            endAdornment={<InputAdornment position="end">🪙Base</InputAdornment>}
                            inputProps={{
                              'aria-label': 'base_currency',
                            }}
                            variant="standard"
                            onChange={ (e) => setNewReportUntaxedAllowance(parseFloat(e.target.value)) }
                          />
                        </FormControl>
                        <FormControl sx={{ m: 1, width: '25ch' }} variant="standard">
                          <InputLabel htmlFor="create-report-taxable-period-days">Taxable period<br/>{"<0 for never tax free"}</InputLabel>
                          <Input
                            id="create-report-taxable-period-days"
                            type="number"
                            defaultValue={-1}
                            sx={{ m: 1, width: '25ch', pt: 2 }}
                            endAdornment={<InputAdornment position="end">days</InputAdornment>}
                            inputProps={{
                              'aria-label': 'taxable_period',
                            }}
                            variant="standard"
                            onChange={ (e) => setNewReportTaxablePeriod(parseInt(e.target.value)) }
                          />
                        </FormControl>
                      </Box>
                      
                      <Box marginTop={2}><FormLabel>Mining Tax Method</FormLabel></Box>
                      <HoverSelectField marginTop={2}
                        placeholder="select..." options={
                          miningTaxMethodList.map(
                            (val) => (
                              {
                                label: stringFromMiningTaxMethodLong(val) + (
                                  (val == MiningTaxMethod.ON_DEPOSIT_AND_GAINS) 
                                      ? " (default)" : ""
                                ), 
                                value: stringFromMiningTaxMethodLong(val)
                              }
                            )
                          )
                        }
                        onElementSelect= { ((val) => { setNewReportMiningTaxMethod(val) }) }
                      />

                      <Grid marginTop={2} container>
                        <Grid item xs={6}>
                          <FormControl sx={{ m: 1, width: '25ch' }} variant="standard">
                            <InputLabel htmlFor="create-report-mining-deposit-profit-rate">Mining deposit profit rate</InputLabel>
                            <Input
                              id="create-report-mining-deposit-profit-rate"
                              type="number"
                              defaultValue={0}
                              sx={{ m: 1, width: '25ch' }}
                              endAdornment={<InputAdornment position="end">%</InputAdornment>}
                              inputProps={{
                                'aria-label': 'mining_deposit_profit_rate',
                              }}
                              variant="standard"
                              onChange={ (e) => setNewReportMiningDepositProfitRate(parseFloat(e.target.value)) }
                            />
                          </FormControl>
                        </Grid>
                        <Grid item xs={6} pl={1}>
                          <Box><FormLabel>Allow Cross Wallet Sells</FormLabel></Box>
                          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 0.5fr)' }}>
                            <ListItem><FormLabel>off</FormLabel></ListItem> 
                            <ListItem><MUISwitch 
                              onChange={ (e) => setNewReportAllowCrossWalletSells(e.target.checked) }
                            /></ListItem>
                            <ListItem><FormLabel>on</FormLabel></ListItem>
                          </Box>
                        </Grid>
                      </Grid>
                    </Box>)
                  )
                }
              </Box>

              
            </DialogContent>
            <DialogActions>
              <Button onClick={ closeCreateReportDialog }>Cancel</Button>
              <Button onClick={ confirmCreateReport }>Create</Button>
            </DialogActions>
          </Dialog>
          {/* ========================================= */}
          <Dialog
            open={confirmReportDeleteOpen}
            TransitionComponent={Transition}
            keepMounted
            onClose={closeReportDeleteConfirm}
            aria-describedby="alert-dialog-slide-description"
          >
            <DialogTitle>{"Confirm Deleting Reports(s)"}</DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-slide-description">
                Your about to delete Reports of yours. Do you want to proceed?
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={closeReportDeleteConfirm}>Cancel</Button>
              <Button onClick={deleteSelectedReports}>Delete</Button>
            </DialogActions>
          </Dialog>
          {/* ========================================= */}
          <Dialog open={shareReportDialogOpen} onClose={closeShareReportDialog}>
            <DialogTitle>Share Report?</DialogTitle>
            <DialogContent>
              <DialogContentText>
                Do you really want to make this Report public by link access?
                Note that this operation cannot be revoked for now...
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={ closeShareReportDialog }>Cancel</Button>
              <Button onClick={ shareReport }>Share</Button>
            </DialogActions>
          </Dialog>
          {/* ========================================= */}
          <Dialog
            open={confirmTxsDeleteOpen}
            TransitionComponent={Transition}
            keepMounted
            onClose={closeTxsDeleteConfirm}
            aria-describedby="alert-dialog-slide-description"
          >
            <DialogTitle>{"Confirm Deleting Transaction(s)"}</DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-slide-description">
                Your about to delete Transactions of yours. Do you want to proceed?
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={closeTxsDeleteConfirm}>Cancel</Button>
              <Button onClick={deleteSelectedTxs}>Delete</Button>
            </DialogActions>
          </Dialog>
          {/* ========================================= */}
          <Dialog open={createTxDialogOpen} onClose={closeCreateTxDialog}>
            <DialogTitle>Create new Transaction</DialogTitle>
            <DialogContent>

            <ToggleButtonGroup
              color="primary"
              value={newTxType}
              exclusive
              onChange={ (e, newTxType) => setNewTxType(newTxType) }
            >
              <ToggleButton value="order" style={{width: 120}} >Order</ToggleButton>
              <ToggleButton value="deposit" style={{width: 120}} >Deposit</ToggleButton>
              <ToggleButton value="transfer" style={{width: 120}} >Transfer</ToggleButton>
            </ToggleButtonGroup>

            <Box mt={3}>
              <FormControl sx={{ mr: 1, width: '25ch' }} variant="standard">
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DateTimePicker
                    renderInput={(props) => <TextField {...props} />}
                    label="DateTimePicker *"
                    defaultValue={newTxDatetime}
                    onChange={ (newValue) => setNewTxDatetime(newValue) }
                  />
                </LocalizationProvider>
              </FormControl>
              {
                (newTxType === "order" || newTxType === "deposit") ? (
                  <FormControl sx={{ ml: 1, width: '25ch' }} variant="standard">
                    <TextField
                      required
                      fullWidth
                      type="text"
                      id="new-order-exchange"
                      label="Exchange / Wallet"
                      variant="outlined"
                      value={newTxExchange_to}
                      error={!stringIsEmpty(errorNewTxExchange_to)}
                      helperText={errorNewTxExchange_to}
                      onChange={ (e) => setNewTxExchange_to(e.target.value) }
                    />
                  </FormControl>
                ) : ""
              }
            </Box>
            
            {
              (newTxType === "transfer") ? (
                <Box pt={3}>
                  <FormControl sx={{ mr: 1, width: '25ch' }} variant="standard">
                    <TextField
                      required
                      fullWidth
                      type="text"
                      id="new-order-exchange-from"
                      label={"Exchange / Wallet (from)"}
                      variant="outlined"
                      value={newTransferExchangeFrom}
                      error={!stringIsEmpty(errorNewTransferExchangeFrom)}
                      helperText={errorNewTransferExchangeFrom}
                      onChange={ (e) => setNewTransferExchangeFrom(e.target.value) }
                    />
                  </FormControl>
                  <FormControl sx={{ ml: 1, width: '25ch' }} variant="standard">
                    <TextField
                      required
                      fullWidth
                      type="text"
                      id="new-order-exchange-to"
                      label={"Exchange / Wallet (to)"}
                      variant="outlined"
                      value={newTxExchange_to}
                      error={!stringIsEmpty(errorNewTxExchange_to)}
                      helperText={errorNewTxExchange_to}
                      onChange={ (e) => setNewTxExchange_to(e.target.value) }
                    />
                  </FormControl>
                </Box>
              ) : ""
            }
            
            <Box marginTop={3}>
              <FormControl sx={{ mr: 1, width: '30ch' }} variant="standard">
                <TextField
                  fullWidth
                  type="number"
                  id="new-tx-fee"
                  label="Tx fee"
                  variant="outlined"
                  value={newTxFee}
                  error={!stringIsEmpty(errornewTxFee)}
                  helperText={errornewTxFee}
                  onChange={ (e) => setNewTxFee(e.target.value) }
                />
              </FormControl>
              <FormControl sx={{ ml: 1, width: '20ch' }} variant="standard"
                error={!stringIsEmpty(errorNewTxFeeCurrency)}
                // TODO helpertext
              >
                <Box><Autocomplete
                  disablePortal
                  id="new-tx-fee-currency"
                  value={newTxFeeCurrency}
                  options={currencyListData.currency_tags}
                  onChange={ (_, newValue) => setNewTxFeeCurrency(newValue) }
                  renderInput={(params) => <TextField {...params} 
                    label="Fee Currency" 
                    onChange={ (e) => setNewTxFeeCurrency(e.target.value) }
                  />}
                /></Box>
              </FormControl>
            </Box>
            
            {
              (newTxType === "order") ? (
                <Box>
                  <Box pt={3}>
                    <FormControl sx={{ mr: 1, width: '30ch' }} variant="standard">
                    <TextField
                      required
                      fullWidth
                      type="number"
                      id="new-order-from-amount"
                      label="From amount"
                      value={newOrderFromAmount}
                      variant="outlined"
                      error={!stringIsEmpty(errorNewOrderFromAmount)}
                      helperText={errorNewOrderFromAmount}
                      onChange={ (e) => setNewOrderFromAmount(e.target.value) }
                    />
                  </FormControl>
                  <FormControl sx={{ ml: 1, width: '20ch' }} variant="standard"
                    error={!stringIsEmpty(errorNewOrderFromCurrency)}
                    // TODO helpertext
                  >
                    <Box><Autocomplete
                      disablePortal
                      id="new-order-from-currency"
                      options={currencyListData.currency_tags}
                      onChange={ (_, newValue) => setNewOrderFromCurrency(newValue) }
                      value={newOrderFromCurrency}
                      renderInput={(params) => <TextField {...params} 
                        label="From currency *" 
                        onChange={ (e) => setNewOrderFromCurrency(e.target.value) }
                      />}
                    /></Box>
                  </FormControl>
                  </Box>
                  <Box pt={3}>
                    <FormControl sx={{ mr: 1, width: '30ch' }} variant="standard">
                    <TextField
                      required
                      fullWidth
                      type="number"
                      id="new-order-to-amount"
                      label="To amount"
                      value={newOrderToAmount}
                      variant="outlined"
                      error={!stringIsEmpty(errorNewOrderToAmount)}
                      helperText={errorNewOrderToAmount}
                      onChange={ (e) => setNewOrderToAmount(e.target.value) }
                    />
                  </FormControl>
                  <FormControl sx={{ ml: 1, width: '20ch' }} variant="standard"
                    error={!stringIsEmpty(errorNewOrderToCurrency)}
                    // TODO helpertext
                  >
                    <Box><Autocomplete
                      disablePortal
                      id="new-order-to-currency"
                      options={currencyListData.currency_tags}
                      onChange={ (_, newValue) => setNewOrderToCurrency(newValue) }
                      value={newOrderToCurrency}
                      renderInput={(params) => <TextField {...params} 
                        label="To currency *" 
                        onChange={ (e) => setNewOrderToCurrency(e.target.value) }
                      />}
                    /></Box>
                  </FormControl>
                  </Box>
                </Box>
              ) : ""
            }
            
            {
              (newTxType === "deposit" || newTxType === "transfer") ? (
                <Box pt={3}>
                  <FormControl sx={{ mr: 1, width: '30ch' }} variant="standard">
                  <TextField
                    required
                    fullWidth
                    type="number"
                    id="new-deposit-transfer-amount"
                    label="Amount"
                    value={newDepositTransferAmount}
                    variant="outlined"
                    error={!stringIsEmpty(errorNewDepositTransferAmount)}
                    helperText={errorNewDepositTransferAmount}
                    onChange={ (e) => setNewDepositTransferAmount(e.target.value) }
                  />
                </FormControl>
                <FormControl sx={{ ml: 1, width: '20ch' }} variant="standard"
                  error={!stringIsEmpty(errorNewDepositTransferCurrency)}
                  // TODO helpertext
                >
                  <Box><Autocomplete
                    disablePortal
                    id="new-deposit-transfer-currency"
                    options={currencyListData.currency_tags}
                    onChange={ (_, newValue) => setNewDepositTransferCurrency(newValue) }
                    value={newDepositTransferCurrency}
                    renderInput={(params) => <TextField {...params} 
                      label="Currency *" 
                      onChange={ (e) => setNewDepositTransferCurrency(e.target.value) }
                    />}
                  /></Box>
                </FormControl>
                </Box>
              ) : ""
            }

            {
              (newTxType === "deposit") ? (
                <Box>
                  <Box pt={3}>
                    <FormControl sx={{ mr: 1, width: '25ch' }} variant="standard">
                      <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <DateTimePicker
                          clearable
                          renderInput={(props) => <TextField {...props} />}
                          label="DateTimePicker"
                          defaultValue={newDepositBuyDate}
                          onChange={(newValue) => setNewDepositBuyDate(newValue) }
                        />
                      </LocalizationProvider>
                    </FormControl>
                    <FormControl sx={{ ml: 1, width: '25ch' }} variant="standard">
                      <TextField
                        fullWidth
                        type="number"
                        label="Taxable percentage"
                        id="new-deposit-taxable"
                        variant="outlined"
                        value={newDepositTaxable}
                        error={!stringIsEmpty(errorNewDepositTaxable)}
                        helperText={errorNewDepositTaxable}
                        onChange={ (e) => setNewDepositTaxable(e.target.value) }
                        InputProps={{
                          endAdornment: "%",
                          classes: { adornedEnd: classes.adornedEnd }
                        }}
                      />
                    </FormControl>
                  </Box>
                  <Box pt={3}>
                    <FormControl sx={{ minWidth: 80 }}>
                      <InputLabel id="new-deposit-type-label">Deposit type</InputLabel>
                      <Select
                        id="new-deposit-type"
                        value={newDepositType}
                        onChange={ (e) => setNewDepositType(e.target.value) }
                        autoWidth
                        label="Deposit type"
                      >
                        <MenuItem value={'G'}>Default</MenuItem>
                        <MenuItem value={'POW'}>Mining (POW)</MenuItem>
                        <MenuItem value={'CI'}>Capital Interest</MenuItem>
                        <MenuItem value={'C'}>Custom Rate</MenuItem>
                      </Select>
                    </FormControl>
                  </Box>
                </Box>
              ) : ""
            }

            </DialogContent>
            <DialogActions>
              <Button onClick={ closeCreateTxDialog }>Cancel</Button>
              <Button onClick={ () => confirmCreateTx() }>Create</Button>
            </DialogActions>
          </Dialog>
          {/* ========================================= */}

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
            {
              inputsBlocked 
              ? loadingButtonReplacor
              : <div>
                  <Link
                    variant="contained"
                    style={{ 
                      backgroundColor: green[400],
                      color: "white",
                      textDecoration: 'none'
                    }}
                    href={link_portfolio_import(pid)}
                  >
                    <Button
                    variant="contained"
                    style={{ 
                      backgroundColor: green[400],
                      color: "white"
                    }}
                    startIcon={<Add />}
                    classes={{
                      endIcon: classes.endIcon,
                    }}
                  >
                    Import Txs
                  </Button>
                  </Link>
                  
                  <Button
                      sx={{ml: 2}}
                      variant="contained"
                      style={{ 
                        backgroundColor: green[400],
                        color: "white"
                      }}
                      startIcon={<Add />}
                      classes={{
                        endIcon: classes.endIcon,
                      }}
                      onClick={() => { openCreateTxDialog(); }}
                  >
                    New Tx
                  </Button>
                  <Button
                      sx={{ml: 2}}
                      variant="contained"
                      style={{ 
                        backgroundColor: red[400],
                        color: "white"
                      }}
                      startIcon={<Delete />}
                      classes={{
                        endIcon: classes.endIcon,
                      }}
                      onClick={() => { clickTxsDelete(); }}
                  >
                    Delete
                  </Button>
                </div>
            }
          </div>
          <div className={classes.toolbar}>
            <div> </div>
            {
              inputsBlocked 
              ? loadingButtonReplacor
              : <div>
                  <TransactionInfoDialog />
                  <Button
                      sx={{ml: 2}}
                      variant="contained"
                      style={{ 
                        backgroundColor: (transaction_page==0) ? blue[300] : blueGrey[300],
                        color: "white"
                      }}
                      startIcon={<ShoppingCart />}
                      classes={{
                        endIcon: classes.endIcon,
                      }}
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
                      classes={{
                        endIcon: classes.endIcon,
                      }}
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
                      classes={{
                        endIcon: classes.endIcon,
                      }}
                      onClick={() => switch_tt_tab(2)}
                  >
                    Transfer
                  </Button>
                </div>
            }
          </div>
        </Box>
        {datagrid_transaction}
      </Box>
    </Box>;
  }

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

export default PortfolioPage;
