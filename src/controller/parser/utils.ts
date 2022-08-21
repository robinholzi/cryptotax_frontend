
export function cvt_amount_from_str(str: string): number {
  if ((str + "") === (null + "")  || str.length < 1) return 0;
  let stripped_str = str.replace(/[^0-9.-]/g, '');
  if ((stripped_str + "") === (null + "") || stripped_str.length < 1) return 0;
  return Number.parseFloat(stripped_str);  // only keep digits and .
}

export function cvt_currency_from_amount_str(str: string, def: string="EUR"): string {
  if ((str + "") === (null + "")  || str.length < 1) return def;
  let stripped_str = str.replace(/[0-9,.-]/g, '')
  if ((stripped_str + "") === (null + "") || stripped_str.length < 1) return def;
  return stripped_str; // only keep digits and .
}
