import { stringFromMiningTaxMethod, miningTaxMethodLongFromString, transferAlgoFromString, TransferAlgo, stringFromTransferAlgo, MiningTaxMethod, stringFromMiningTaxMethodLong } from "../../api/portfolio/portfolio_api";
import { stringIsEmpty } from "../../utils/string";

export const str = ""
// TODO convert per cent to normalized float

export class ReportSanitizationError extends Error {
  severity: string;
  msg: string;
  constructor(severity: string, msg: string) {
      super(msg);
      this.severity=severity;
      this.msg=msg;
  }
}

/**
 * Throws string exception and severity if some inputs are invalid
 * @param reportName 
 * @param baseCurrencyTag 
 * @param analysisAlgorithm 
 * @param transferAlgorithm 
 * @param untaxedAllowance 
 * @param taxablePeriodDays 
 * @param miningTaxMethod 
 * @param miningDepositProfitRate 
 * @param allowCrossWalletSells 
 */
export const sanitize_report = (
  coin_tag_list: string[],
  reportName: string,
  baseCurrencyTag: string,
  analysisAlgorithm: string,
  transferAlgorithm: string,
  untaxedAllowance: number,
  taxablePeriodDays: number,
  miningTaxMethod: string,
  miningDepositProfitRate: number,
  allowCrossWalletSells: boolean
) => {
  if (stringIsEmpty(reportName) || reportName.length < 4) {
    throw new ReportSanitizationError('error', 'Report name has to be at least 4 characters long!');
  }
  if (stringIsEmpty(baseCurrencyTag)) {
    throw new ReportSanitizationError('error', 'Base currency tag may not be empty!');
  }
  if (coin_tag_list.find((cur) => cur=baseCurrencyTag) === undefined) {
    throw new ReportSanitizationError('error', 'Base currency tag not valid/available!');
  }
  if (analysisAlgorithm == null) analysisAlgorithm = stringFromTransferAlgo(TransferAlgo.ALGO_FIFO);
  try {
    transferAlgoFromString(analysisAlgorithm);
  } catch {
    throw new ReportSanitizationError('error', 'Analysis algrithm not available!');
  }
  if (transferAlgorithm == null) transferAlgorithm = stringFromTransferAlgo(TransferAlgo.ALGO_FIFO);
  try {
    transferAlgoFromString(transferAlgorithm);
  } catch {
    throw new ReportSanitizationError('error', 'Transfer algrithm not available!');
  }
  if (untaxedAllowance < 0)
    throw new ReportSanitizationError('error', 'Untaxed allowance may not be negative!');
  
  
  if (miningTaxMethod == null) miningTaxMethod = stringFromMiningTaxMethodLong(MiningTaxMethod.ON_DEPOSIT_AND_GAINS);
  try {
    miningTaxMethodLongFromString(miningTaxMethod)
  } catch {
    throw new ReportSanitizationError('error', 'Mining tax method not available!');
  }

  if (miningDepositProfitRate < 0 || miningDepositProfitRate > 100) 
    throw new ReportSanitizationError('error', 'Mining deposit profit rate must lie between 0 and 100 [%]!');

    const res = {
      reportName,
      baseCurrencyTag,
      analysisAlgorithm,
      transferAlgorithm,
      untaxedAllowance,
      taxablePeriodDays: ((taxablePeriodDays < 0) ? 1000000 : Math.floor(taxablePeriodDays)),
      miningTaxMethod: stringFromMiningTaxMethod(miningTaxMethodLongFromString(miningTaxMethod)),
      miningDepositProfitRate: miningDepositProfitRate / 100.0,
      allowCrossWalletSells
    }
    return res
}
