
import React, { useEffect, useState } from 'react';
import {useQuery} from 'react-query'

import CreateNewFolder from '@mui/icons-material/CreateNewFolder';
import FolderDelete from '@mui/icons-material/FolderDelete';
import ModeEdit from '@mui/icons-material/ModeEdit';
import { AppBar, Avatar, Button, CircularProgress, Container, CssBaseline, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, getDividerUtilityClass, Icon, IconButton, Input, Link, Paper, Slide, styled, TextField, Toolbar, Typography } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { makeStyles } from '@mui/styles';
import { FeaturedPlayList, Info, InfoOutlined, InfoRounded, InfoSharp, Launch, Share } from '@mui/icons-material';
import styledEngine from '@mui/styled-engine';
import { blue, green, red } from '@mui/material/colors';
import { link_portfolio } from '../../links/links';
import { Box } from '@mui/system';
import { useSnackbar } from 'notistack';
import { stringIsEmpty } from "../../utils/string";
import { PortfolioListData, portfolio_create, portfolio_delete, portfolio_list_my } from '../../api/portfolio/portfolio_api';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const columns = [
  { 
    field: "id", headerName: "", width: 60, hide: false,
    renderCell: (val) => {
      return (
        // <Button variant="contained" href="#contained-buttons">
        //   <Launch />
        // </Button>
        // TODO: dynmaic value link
        <Link href={link_portfolio((val ?? {}).id ?? -1)}> 
          <Launch color='primary' />
        </Link>
      )
    }
  },
  {
      field: "title",
      headerName: "Title ✏️",
      width: 250,
      editable: true,
  },
  {
      field: "transactions",
      headerName: "Txs",
      width: 65,
      editable: false,
      sortable: false,
      filterable: false,
  },
  {
      field: "exchanges",
      headerName: "Exchgs",
      type: "number",
      width: 80,
      editable: false,
      sortable: false,
      filterable: false,
  },
  {
      field: "reports",
      headerName: "Reports",
      description: "This column has a value getter and is not sortable.",
      width: 80,
      editable: false,
      sortable: false,
      filterable: false,
  },
  {
      field: "latestReportProfit",
      headerName: "Latest report's profit",
      type: "number",
      width: 180,
      editable: false,
      sortable: false,
      filterable: false,
  },
  {
      field: "latestReportState",
      headerName: "State",
      type: "number",
      width: 80,
      editable: false,
      sortable: false,
      filterable: false,
      hide: true,
      renderCell: () => (
        <div>
          <Avatar sx={{ bgcolor: blue[400] }}> 
            <Info sx={{ color: 'white' }} />
          </Avatar>
        </div>
      )
      // <span class="badge bg-primary">Primary</span>
  },
  {
      field: "latestReportDate",
      headerName: "Latest report date",
      type: "number",
      width: 190,
      editable: false,
      filterable: false,
  },
];

function PageWrapper({children}) {
  return <Container>
      {children}
  </Container>
}
  
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

function PortfoliosPage({token}) {
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();

  const [loading, setLoading] = useState(true);
  const [inputsBlocked, setInputsBlocked] = useState(false);
  const [portfolioListData, setPortfolioListData] = useState(new PortfolioListData())
  const [rows, setRows] = useState([])

  const re_load_data = async () => {
    var delayInMilliseconds = 10;
    setTimeout(async () => {
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

      setRows(new_rows)
      setLoading(false);
    }, delayInMilliseconds);
  }

  useEffect(async () => {
    await re_load_data();
    return () => {}
  }, [])

  const [createDialogOpen, setCreateDialogOpen] = React.useState(false);
  const [newPortfolioName, setNewPortfolioName] = React.useState("");
  const openCreateDialog = async () => {
    setNewPortfolioName("");
    setCreateDialogOpen(true);
  };
  const closeCreateDialog = async () => setCreateDialogOpen(false);
  const confirmCreatePortfolio = async () => {
    if (stringIsEmpty(newPortfolioName) || newPortfolioName.length < 4) {
      enqueueSnackbar('Portfolio name has to be at least 4 characters long!', { variant: 'error'});
      return;
    }
    closeCreateDialog();
    setLoading(true);
    
    // API CALL
    const res = await portfolio_create(token, newPortfolioName);
    if (res==="success") {
      enqueueSnackbar('Created portfolio!', { variant: 'success'});

      setTimeout(async () => {
        await re_load_data();
        setLoading(true);
      }, 100);
    } else {
      enqueueSnackbar('Creating portfolio failed: ' + res, { variant: 'error'});
      setLoading(false);
    }

    return;
  }

  const [selectionModel, setSelectionModel] = useState([]);

  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const clickDelete = async () => {
    
    if (selectionModel.length < 1) {
      enqueueSnackbar('You have to select a portfolio first!', { variant: 'error'});
      return;
    }
    setConfirmDeleteOpen(true);

    return;
  }
  const closeDeleteConfirm = async () => {
    setConfirmDeleteOpen(false);
    return;
  }
  const deleteSelectedPortfolios = async () => {
    setConfirmDeleteOpen(false);
    setInputsBlocked(true);
    const selected = selectionModel;
    const res = await portfolio_delete(token, selected.toString());
    if (res==="success") {
      enqueueSnackbar('Deleted portfolios!', { variant: 'success'});
      const newRows = rows.filter((value, index) => 
        (value != null && !selected.some((val) => val===value.id) )
      );
      setRows(newRows);
    } else {
      enqueueSnackbar('Deleting portfolios failed: ' + res, { variant: 'error'});
    }
    setInputsBlocked(false);
    return;
  }

  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const clickShare = async () => {
    console.log("selectionModel: ", selectionModel);
    if (selectionModel.length < 1) {
      enqueueSnackbar('You have to select a portfolio first!', { variant: 'error'});
      return;
    }
    if (selectionModel.length > 1) {
      enqueueSnackbar('You can only share 1 portfolio at a time!', { variant: 'error'});
      return;
    }
    setShareDialogOpen(true);
    return;
  }
  const closeShareDialog = async () => {
    setShareDialogOpen(false);
    return;
  }
  const sharePortfolio = async () => {
    if (selectionModel.length < 1) {
      setShareDialogOpen(false);
      return;
    }
    const pid = selectionModel[0];
    console.log("share!, pid:", pid);
    enqueueSnackbar('This feature is not implemented, yet!', { variant: 'warning'}); // TODO
    setShareDialogOpen(false);
    return;
  }

  const [editRowsModel, setEditRowsModel] = React.useState({});
  const handleEditRowsModelChange = React.useCallback((model) => {
    // for (const attr of model) {
    //   console.log("handleEditRowsModelChange -> ", attr)
    // }
    // enqueueSnackbar('handleEditRowsModelChange!', { variant: 'info'});
    setEditRowsModel(model);
  }, []);
  const handleRowEditCommit = React.useCallback((pid, event) => {
    // TODO update
    // TODO update
    // TODO
    // TODO
    enqueueSnackbar('handleRowEditCommit!', { variant: 'info'});
  }, []);


  var datagrid = ""
  if (loading){
    datagrid = <center><Box p={7}><CircularProgress /></Box></center>
  }
  else if (portfolioListData.hasError()){
    datagrid = <div>Error! {portfolioListData.error}</div>
  }
  else {
    datagrid = (
      <DataGrid rows={rows} columns={columns} 
        checkboxSelection hideFooterPagination // TODO
        onSelectionModelChange={ (newSelection) => { 
          setSelectionModel(newSelection);
        } }
        selectionModel={selectionModel} 
        editRowsModel={editRowsModel}
        editMode="row"
        onEditRowsModelChange={handleEditRowsModelChange}
        onRowEditCommit={handleRowEditCommit}
      />
    )  
  }

  const loadingButtonReplacor = <span style={{marginRight: 10}}><CircularProgress size={30} /></span>

  return (
    <PageWrapper>
      <Paper className={classes.content}>
        <div className={classes.toolbar}>
          <Typography variant="h6" component="h2" color="primary">
              Your Portfolios
          </Typography>
          {
            inputsBlocked 
            ? loadingButtonReplacor
            : 
              <div>
                <Button
                  variant="contained"
                  style={{ 
                    backgroundColor: green[400],
                    color: "white"
                  }}
                  startIcon={<CreateNewFolder />}
                  onClick={ openCreateDialog }
                >
                    New Portfolio
                </Button>
                <Button
                    sx={{ml: 2}}
                    variant="contained"
                    style={{ 
                      backgroundColor: red[400],
                      color: "white"
                    }}
                    startIcon={<FolderDelete />}
                    onClick={clickDelete}
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
                    onClick={clickShare}
                >
                  Share
                </Button>
              </div>
          }
        </div>
        <div style={{ height: 400, width: "100%" }}>
          { datagrid }
        </div>

        {/* ========================================= */}
        <Dialog open={createDialogOpen} onClose={closeCreateDialog}>
          <DialogTitle>Create new Portfolio</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Do you really want to make this Portfolio public by link access?
              Note that this operation cannot be revoked for now...
            </DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              id="title"
              label="Portfolio title"
              type="text"
              fullWidth
              variant="standard"
              onChange={ (e) => setNewPortfolioName(e.target.value) }
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={ closeCreateDialog }>Cancel</Button>
            <Button onClick={ confirmCreatePortfolio }>Create</Button>
          </DialogActions>
        </Dialog>
        {/* ========================================= */}
        <Dialog
          open={confirmDeleteOpen}
          TransitionComponent={Transition}
          keepMounted
          onClose={closeDeleteConfirm}
          aria-describedby="alert-dialog-slide-description"
        >
          <DialogTitle>{"Confirm Deleting Portfolio(s)"}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-slide-description">
              Your about to delete Portfolios of yours. Do you want to proceed?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={closeDeleteConfirm}>Cancel</Button>
            <Button onClick={deleteSelectedPortfolios}>Delete</Button>
          </DialogActions>
        </Dialog>
        {/* ========================================= */}
        <Dialog open={shareDialogOpen} onClose={closeShareDialog}>
          <DialogTitle>Share Portfolio?</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Do you really want to make this Portfolio public by link access?
              Note that this operation cannot be revoked for now...
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={ closeShareDialog }>Cancel</Button>
            <Button onClick={ sharePortfolio }>Share</Button>
          </DialogActions>
        </Dialog>
        {/* ========================================= */}
        

        {/* <div style={{ height: 400, width: '100%' }}>
          <DataGridPro {...data} />
        </div> */}
      </Paper>
    </PageWrapper>
  );

}

export default PortfoliosPage;