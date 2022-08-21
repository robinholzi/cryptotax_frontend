import styled from "@emotion/styled";
import { Launch } from "@mui/icons-material";
import { Box, LinearProgress, linearProgressClasses } from "@mui/material";
import { Link } from "react-router-dom";
import { link_report } from "../../links/links";

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

function CustomizedProgressBars({value}) {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <BorderLinearProgress variant="determinate" value={value} />
    </Box>
  );
}

export const report_columns = (pid) => [
  { 
    field: "id", headerName: "", width: 60, hide: false,
    renderCell: (elem) => {
      return (
        <Link to={link_report(pid, elem.row.id)}> 
          <Launch color='primary' />
        </Link>
      )
    }
  },
  {
      field: "title",
      headerName: "Title",
      type: "string",
      width: 190,
      editable: true,
      sortable: true,
      filterable: true,
  },
  {
      field: "created",
      headerName: "Date",
      type: "datetime",
      width: 190,
      editable: false,
      sortable: true,
      filterable: true,
  },
  {
      field: "mode",
      headerName: "State",
      type: "string",
      width: 65,
      editable: false,
      sortable: false,
      filterable: true,
  },
  {
      field: "algo",
      headerName: "Algo",
      type: "string",
      width: 70,
      editable: false,
      sortable: false,
      filterable: true,
  },
  {
      field: "transfer_algo",
      headerName: "Transfer Algo",
      type: "string",
      width: 120,
      editable: false,
      sortable: false,
      filterable: true,
      hide: true
  },
  {
      field: "base_currency",
      headerName: "🪙 Base",
      type: "string",
      width: 90,
      editable: false,
      sortable: true,
      filterable: true,
  },

  {
    field: "transactions",
    headerName: "#Txs",
    type: "number",
    width: 70,
    editable: false,
    sortable: false,
    filterable: false,
  },
  {
    field: "currencies",
    headerName: "#🪙",
    type: "number",
    width: 70,
    editable: false,
    sortable: false,
    filterable: false,
    hide: true
  },
  {
    field: "wallets",
    headerName: "#👛",
    type: "number",
    width: 70,
    editable: false,
    sortable: false,
    filterable: false,
    hide: true
  },
  {
      field: "tax_vs_realized_profit",
      headerName: "Tax/All Profit",
      type: "number",
      width: 150,
      editable: false,
      sortable: false,
      filterable: false,
      // TODO render: with base currency symbol
  },
  {
      field: "fee_sum",
      headerName: "Fees",
      type: "number",
      width: 80,
      editable: false,
      sortable: false,
      filterable: false,
      // TODO render: with base currency symbol
  },
  {
      field: "progress",
      headerName: "Progress",
      type: "number",
      width: 120,
      editable: false,
      sortable: false,
      filterable: false,
      renderCell: (elem) => (
        <CustomizedProgressBars value={elem.row.progress} />
      )
  },
  {
    field: "msg",
    headerName: "Hint",
    type: "string",
    width: 190,
    editable: false,
    sortable: true,
    filterable: true,
},
];

// tid	oid=id	from_currency	from_amount	to_currency	to_amount	datetime	
// exchange_wallet	fee_currency	fee

export const orders_columns = [
  { // tid
    field: "id", headerName: "", width: 40, hide: true,
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
      width: 200,
      editable: false,
      sortable: true,
      filterable: true,
  },
  {
      field: "from_amount",
      headerName: "from 🔢",
      type: "string",
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
      type: "string",
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

// tid	did=id buy_datetime	currency	amount	
// taxable	datetime	exchange_wallet	fee_currency_id	fee type

export const deposits_columns = [
  { // tid
    field: "id", headerName: "", width: 40, hide: true,
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
  {
    field: "type",
    headerName: "Type",
    type: "string",
    width: 70,
    editable: false,
    sortable: false,
    filterable: true,
  },
];

// taid	tfid=id	currency	amount	from_exchange_wallet	datetime	exchange_wallet	fee_currency_id	fee

export const transfers_columns = [
  { // tid
    field: "id", headerName: "", width: 40, hide: true,
  },
  {
    field: "tfid", headerName: "", width: 40, hide: true,
  },
  {
      field: "datetime",
      headerName: "Datetime",
      type: "datetime",
      width: 200,
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
