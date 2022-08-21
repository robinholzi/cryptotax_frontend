
import React, { useEffect, useState } from 'react';

import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import { Navigate, useParams, useSearchParams } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import { insertUrlParam } from '../../../controller/util/url_util';
import { Alert, Box, Button, CircularProgress, Collapse, Container, FormControl, FormControlLabel, FormLabel, Grid, Link, Paper, Radio, RadioGroup, Slide, TextField, Typography } from '@mui/material';
import { PortfolioListData, portfolio_list_my } from '../../../api/portfolio/portfolio_api';

import FileUpload from "react-mui-fileuploader"
import { HoverSelectField } from '../../../components/forms/HoverSelectField';

import { useStyles_mainCard } from '../../../styles/general/main_card';
import { CryptoTaxBreadcrubs } from '../../../components/widgets/breadcrubs';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { link_portfolio, link_portfolio_import } from '../../../links/links';
import { Forward, Refresh } from '@mui/icons-material';
import { InvalidCsvInputError } from '../../../controller/parser/errors';
import { parseOrders } from '../../../controller/parser/order_parser';
import { portfolio_insert_deposits, portfolio_insert_orders, portfolio_insert_transfers } from '../../../api/portfolio/txs_api';
import { parseDeposits } from '../../../controller/parser/deposit_parser';
import { parseTransfers } from '../../../controller/parser/transfer_parser';


const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

// TODO FIND DUPLICATES

function TableLine({children}) {
  return (
    <Box
      component="span"
      sx={{
        display: 'block',
        p: 1,
        m: 1,
        bgcolor: (theme) => ('#101010'),
        color: (theme) => 'grey.400',
        // border: '1px solid',
        // borderColor: (theme) =>
        //   theme.palette.mode === 'dark' ? 'grey.800' : 'grey.300',
        borderRadius: 2,
        fontSize: '0.875rem',
        fontWeight: '700',
      }}
    >
      {children}
    </Box>
  )
}


function PageWrapper({children}) {
  return <Container>
      {children}
  </Container>
}

function ImportTxsPage({ token }) {
  const classes = useStyles_mainCard();
  const { enqueueSnackbar } = useSnackbar();
  
  const [loading, setLoading] = useState(true);
  const [inputsBlocked, setInputsBlocked] = useState(false);
  const [portfolioListData, setPortfolioListData] = useState(new PortfolioListData())

  const [selectedFiles, setSelectedFiles] = useState([])

  // ui
  const [, updateState] = React.useState();
  const refresh = React.useCallback(() => updateState({}), []);

  const [expanded, setExpanded] = useState(false);
  const [successFiles, setSuccessFiles] = useState([]);
  const [failedFiles, setFailedFiles] = useState([]);

  // portfolio id
  const { id: initial_pid } = useParams();

  const [pid, setNewPid] = useState(initial_pid);

  const switchPortfolio = (new_pid) => {
    if (window.history.pushState) {
      let searchParams = new URLSearchParams(window.location.search);
      let newurl = window.location.protocol + "//" + window.location.host + link_portfolio_import(new_pid) + (
        searchParams.keys.length > 1 ? ('?' + searchParams.toString()) : ""
      );
      window.history.pushState({path: newurl}, '', newurl);
    }
    setNewPid(new_pid);
  }

  const re_load_data = async () => {
    await portfolio_list_my(token, portfolioListData);
    var new_rows = [];
    for (const pf of portfolioListData.dataList) {
      new_rows.push(
        { 
          id: pf.pid, title: pf.title, transactions: pf.transactions, 
          exchanges: pf.exchanges, reports: pf.reports, 
          latestReportProfit: pf.latest_report_profit + pf.latest_report_currency, 
          // latestReportState: pf.latest_report_currency, 
          latestReportDate: pf.latest_report_date 
        }
      );
    }

    const find_pid = new_rows.filter((v) => v.id == pid)
    if (find_pid.length < 1) {
      if (new_rows.length < 1) {
        switchPortfolio(null);
        enqueueSnackbar('No portfolio found! Create one first!', { variant: 'error', autoHideDuration: 10000 });
      } else {
        switchPortfolio(new_rows[0].id);
        enqueueSnackbar('Portfolio not found! Used another one as default!', { variant: 'error', autoHideDuration: 10000});
      }
    }
    setLoading(false);
  }

  useEffect(async () => {
    await re_load_data();
    return () => {}
  }, [])

  // transaction type (tt)
  const [searchParams, setSearchParams] = useSearchParams();
  const [type_page, setTypePage] = useState(searchParams.get("type") ?? 'order');
  var switch_type = async (type) => {
    insertUrlParam('type', type)
    setTypePage(type)
  }
  
  const handleFilesChange = (files) => {
    console.log("handleFilesChange: files");
    const withoutDuplicates = files.filter((elem, idx, self) => {
      // if for a file there is a file with smaller index and same name -> filter out
      // --> take first occurence for each name
      return idx === self.findIndex((f_val, _, __) => elem.name === f_val.name);
    })

    if (files.length !== withoutDuplicates.length) {
      enqueueSnackbar('You file list contains duplicates... We will only parse each file once!', { variant: 'warning'});
    }

    setSelectedFiles(withoutDuplicates);
  }
  const handleFileUploadError = (error) => {
    // TODO
    enqueueSnackbar('File failed to upload!', { variant: 'error' });
  }

  const readFile = (file) => {
    const stripped_encoded = file.path.replace("data:text/csv;base64,", "")
    const parsed = Buffer.from(stripped_encoded, 'base64')
    return parsed.toString();
  }

  const clickImport = async () => {
    if (selectedFiles.length < 1) {
      enqueueSnackbar('Please select a file first!', { variant: 'warning'});
      return;
    }
    const new_successFiles = [];
    const new_failedFiles = [];
    setSuccessFiles(new_successFiles);
    setFailedFiles(new_failedFiles);
    setInputsBlocked(true);

    let error = false;
    let parsedTxList = []; // {file, type, txs}

    for(const i in selectedFiles) {
      const file = selectedFiles[i];

      const fileName = String(file.name ?? "");
      let type;
      if (fileName.endsWith(".orders.csv")) {
        type = "o";
      } else if (fileName.endsWith(".deposits.csv")) {
        type = "d";
      } else if (fileName.endsWith(".transfers.csv")) {
        type = "t";
      } else {
        error = true;
        enqueueSnackbar(`File <${file.name}> does not end with either '.orders.csv', '.deposits.csv' or '.transfers.csv'`, { variant: 'error', autoHideDuration: 10000 });
        continue;
      }

      const fileContentString = readFile(file);
      try {
        let parsed;
        if (type == "o") {
          parsed = parseOrders(fileContentString);
        } else if (type == "d") {
          parsed = parseDeposits(fileContentString);
        } else if (type == "t") {
          parsed = parseTransfers(fileContentString);
        }
        parsedTxList.push({
          file: fileName,
          type: type,
          txs: parsed,
        });
      } catch (ex) {
        error = true;
        if (ex instanceof InvalidCsvInputError) {
          enqueueSnackbar(`Error within file <${file.name}>: ${ex.message}`, { variant: 'error', autoHideDuration: 10000 });
        } else {
          enqueueSnackbar(`Unknown error within file <${file.name}>`, { variant: 'error', autoHideDuration: 10000 });
          console.log("--> ex", ex);
        }
      }
    }

    if (error) {
      setInputsBlocked(false);
      return;
    }

    for (const i in parsedTxList) {
      const { file, type, txs } = parsedTxList.at(i);

      let result;
      if (type == "o") {
        result = await portfolio_insert_orders(token, pid, txs);
      } else if (type == "d") {
        result = await portfolio_insert_deposits(token, pid, txs);
      } else if (type == "t") {
        result = await portfolio_insert_transfers(token, pid, txs);
      } else {
        throw Error("UnknownError!")
      }

      if (result === "success") {
        new_successFiles.push(file);
        refresh();
        enqueueSnackbar(`imported txs from '${file}' successfully.`, { variant: 'success' });
      } else {
        new_failedFiles.push(file);
        refresh();
        enqueueSnackbar(`Unknown error within file <${file}>: ${result}`, { variant: 'error', autoHideDuration: 10000 });
      }
    }

    setInputsBlocked(false);
  }

  var content_card = ""
  if (loading){
    content_card = <center><Box p={7}><CircularProgress /></Box></center>
  }
  else if (portfolioListData.hasError()){
    content_card = <div>Error! {portfolioListData.error}</div>
  } else {
    content_card = <Box
      container
      spacing={0}
      direction="column"
      alignItems="center"
      justifyContent="center"
      // style={{ minHeight: '100vh' }}
    >
      {/* FORM ----------------------------- */}
      <Box pt={4}>
        <FormControl>
          <center><FormLabel id="demo-row-radio-buttons-group-label">Transaction Type</FormLabel></center>
          <RadioGroup
            row
            aria-labelledby="demo-row-radio-buttons-group-label"
            name="row-radio-buttons-group"
            onChange={(e) => {
              switch_type(e.target.value);
            }}
            value={type_page}
            defaultValue={'order'}
          >
            <FormControlLabel value="order" control={<Radio />} label="Order" />
            <FormControlLabel value="deposit" control={<Radio />} label="Deposit" />
            <FormControlLabel value="transfer" control={<Radio />} label="Transfer" />
          </RadioGroup>
        </FormControl>
      </Box>

      <Box pt={4}>
        <Typography 
          id="outlined-basic" label="Title" variant="outlined" 
          style={{ fontWeight: 600 }}
        >
          Portfolio
        </Typography>
        <Typography 
          pl={2}
          id="outlined-basic" label="Title" variant="outlined" 
        >
           (here the Txs will be added -> create one first)
        </Typography><br />
        <HoverSelectField
          displayValue={false} 
          marginTop={2}
          placeholder={portfolioListData.dataList.length > 0 
            ? portfolioListData.dataList[0].title 
            : "No portfolio found!"}
          options={
            portfolioListData.dataList.map(
              (val) => (
                {
                  label: val.title,
                  value: String(val.pid)
                }
              )
            )
          } 
          onElementSelect= { ((val) => {
            switchPortfolio(parseInt(val));
          }) }
        />
      </Box>

      <Box pt={4}>
        <Typography variant='h6'>
          Expected file format:
        </Typography>
        <Box component="span" sx={{ display: 'block' }}>(file must follow format exactly!)</Box>
        <Box component="span" sx={{ display: 'block' }}>Filename -> type:</Box>
        <Box component="span" sx={{ display: 'block' }}>
          {"<custom_name>.order.csv"}<br />
          {"<custom_name>.deposit.csv"}<br />
          {"<custom_name>.transfer.csv"}
        </Box>

        <Box component="span" pt={5} pb={2} sx={{ display: 'block' }}>
          Each type of csv file has own format:
        </Box>

        <Box pb={2}>
          <Button
            onClick={() => setExpanded(!expanded)}
          >Toggle more details!</Button>
          <Link href='https://cdn.nerotecs.com/cryptotax/files/samples/example_files.rar' style={{ textDecoration: 'none', marginLeft: "1.2rem" }}>
            <Button variant='contained' ml={2}>
              Download sample files
            </Button>
          </Link>
        </Box>
        

        <Collapse in={expanded}>
          <Box component="span" sx={{ display: 'block' }}>- ORDER</Box>
          <TableLine>
            date(utc),exchange_wallet,pair,direction,to_amount,from_amount,fee,remark<br/>
            12/10/2021 22:51,Binance,ADA/EUR,BUY,58.7000000000ADA,64.57000000EUR,0.0000971100BNB,
          </TableLine>

          <Box component="span" sx={{ display: 'block' }}>- DEPOSIT</Box>
          <TableLine>
            date(utc),exchange_wallet,type,buy_datetime (empty=same),amount,currency,taxable profit ratio (at deposit time),fee,remark<br/>
            2/14/2021 2:20,Binance Pool,,,0.00153485,ETH,1,,Pool Distribution
          </TableLine>

          <Box component="span" sx={{ display: 'block' }}>- TRANSFER</Box>
          <TableLine>
            date(utc),from_exchange_wallet,to_exchange_wallet,amount,currency,fee,remark<br/>
            5/19/2021 16:04,Binance Pool,Binance,0.12564426,ETH,,
          </TableLine>
        </Collapse>

      </Box>
      
      <Box pt={4}>
        <FileUpload
          multiFile={true}
          disabled={false}
          title="Upload files with transactions to import"
          header="select transactions CSV"
          leftLabel="or"
          rightLabel="to select files"
          buttonLabel="click here"
          maxFileSize={10}
          maxUploadFiles={0}
          maxFilesContainerHeight={357}
          errorSizeMessage={'fill it or move it to use the default error message'}
          allowedExtensions={['csv']}
          onFilesChange={handleFilesChange}
          onError={handleFileUploadError}
          imageSrc={'https://cdn.nerotecs.com/cryptotax/icon/wallet_bitcoin_padding.png'}
          disableImage={true}
          bannerProps={{ elevation: 0, variant: "outlined" }}
          containerProps={{ elevation: 0, variant: "outlined" }}
        />
      </Box>
      <Typography>
        Note: The clear and delete buttons do not work, please reload the site if you want to change the selected files.
      </Typography>
      
      {
        (successFiles.length >= 1)
        ? (
          <Box pt={3} children={
            successFiles.map((succFile) => {
              return <Alert key={succFile} variant="filled" severity="success" style={{marginTop: "1rem"}}>
                Imported: {succFile}
              </Alert>
            })
          } />
        ) : ""
      }
      
      {
        (failedFiles.length >= 1)
        ? (
          <Box pt={(successFiles.length >= 1) ? 0 : 3} children={
            failedFiles.map((succFile) => {
              return <Alert key={succFile} variant="filled" severity="error" style={{marginTop: "1rem"}}>
                Failed: {succFile}
              </Alert>
            })
          } />
        ) : ""
      }

      <Box pt={4}>
        {
          inputsBlocked
           ? (<center><CircularProgress /></center>) : (
            <Button
              fullWidth
              variant="contained"
              onClick={clickImport}
            >
              Import
            </Button>
          )
        }
      </Box>
      <Box pt={2}>
        <center>
          no checks for duplicates!
        </center>
      </Box>

      {/* ---------------------------------- */}
    </Box> 
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
          href: link_portfolio(pid), 
          icon: null
        },
        {
          title: "Import", 
          href: "", 
          icon: <CloudUploadIcon sx={{ mr: 0.5 }} fontSize="inherit" />
        },
      ]} />
      <Paper className={classes.content}>
        <Box
          component="main">
            <Grid container pl={1.5} spacing="1" alignItems="center">
              <AccountBalanceWalletIcon />
              <Box pl={2}>
                <Typography id="outlined-basic" label="Title" variant="outlined" 
                  style={{ fontWeight: 600 }}
                >
                  Import Transactions
                </Typography>
              </Box>
              <div style={{ width: "100%" }}>
                { content_card }
              </div>
            </Grid>
        </Box>
      </Paper>
    </PageWrapper>
  );

}

export default ImportTxsPage;
