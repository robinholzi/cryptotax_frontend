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

export const tripple_by_aggregate_columns = (tagName, base_currency) => [
  {
      field: "id",
      headerName: tagName,
      type: "string",
      width: 100,
      editable: false,
      filterable: true,
      sortable: true,
  },
  {
      field: "sum_taxable_profit",
      headerName: "Taxable profit",
      type: "number",
      width: 130,
      editable: false,
      sortable: true,
      filterable: true,
      valueFormatter: (params) => {
        if (params.value == null) return '';
        return `${params.value.toPrecision(5)} ${base_currency}`;
      },
  },
  {
      field: "sum_realized_profit",
      headerName: "Realized profit",
      type: "number",
      width: 130,
      editable: false,
      sortable: true,
      filterable: true,
      valueFormatter: (params) => {
        if (params.value == null) return '';
        return `${params.value.toPrecision(5)} ${base_currency}`;
      },
  },
];


export const tuple_by_aggregate_columns = (tagName, base_currency) => [
  {
      field: "id",
      headerName: tagName,
      type: "string",
      width: 100,
      editable: false,
      filterable: true,
      sortable: true,
  },
  {
      field: "fee_sum",
      headerName: "Taxable profit",
      type: "number",
      width: 130,
      editable: false,
      sortable: true,
      filterable: true,
      valueFormatter: (params) => {
        if (params.value == null) return '';
        return `${params.value.toPrecision(5)} ${base_currency}`;
      },
  },
];
