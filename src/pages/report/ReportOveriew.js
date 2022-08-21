

/*
        "portfolio_id": 3,
        "ana_id": 94,
        "title": "Analysis 1",
        "created": "2022-04-23T11:28:58.584282Z",
        "mode": "F",
        "failed": false,
        "algo": "FIFO",
        "transfer_algo": "FIFO",
        "base_currency": "EUR",
        "mining_tax_method": "D&G",
        "mining_deposit_profit_rate": 0.0025,
        "taxable_period_days": 1000000,
        "txs": 124,
        "taxable_profit": 893.309002694389,
        "realized_profit": 1498.58017702274,
        "fee_sum": 4.27117432835063,
        "progress": 1.0,
        "msg": null,

*/

import { Grid } from "@mui/material";
import { SmallPlainInfoCard } from "../../components/cards/infocard";

export const ReportOverviewBar = ({txs=0, 
  tax_sum=0, profit_sum=0, deposit_profit=0, sell_profit=0, 
  fee_sum=0, base_currency="", currencies=0, wallets=0}) => {
  return (
    <Grid
        container
        spacing={3}
      >
        <Grid item lg={2} sm={3} xl={2} xs={3}>
          <SmallPlainInfoCard title="Txs" value={txs} />
        </Grid>
        <Grid item lg={2} sm={3} xl={2} xs={3}>
          <SmallPlainInfoCard title="Tax- / Total Realized Profit" value={`${tax_sum.toPrecision(5)} / ${profit_sum.toPrecision(5)} ${base_currency}`} />
        </Grid>
        <Grid item lg={2} sm={3} xl={2} xs={3}>
          <SmallPlainInfoCard title="Deposit- / Sell Profit" value={`${deposit_profit.toPrecision(5)} / ${sell_profit.toPrecision(5)} ${base_currency}`} />
        </Grid>
        <Grid item lg={2} sm={3} xl={2} xs={3}>
          <SmallPlainInfoCard title="Fee sum" value={`${fee_sum.toPrecision(4)} ${base_currency}`} />
        </Grid>
        <Grid item lg={2} sm={3} xl={2} xs={3}>
          <SmallPlainInfoCard title="#Currencies" value={currencies} />
        </Grid>
        <Grid item lg={2} sm={3} xl={2} xs={3}>
          <SmallPlainInfoCard title="#Wallets / Exchanges" value={wallets} />
        </Grid>
      </Grid>
  );
}
