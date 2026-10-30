/**
 * Indian Rupee & Architectural Unit Formatters
 */

const INR_SYMBOL = "\u20B9";

export function formatPrice(price: number): string {
  if (price >= 10000000) {
    const cr = price / 10000000;
    return `${INR_SYMBOL}${cr % 1 === 0 ? cr : Number(cr.toFixed(2))} Cr`;
  }
  if (price >= 100000) {
    const lakh = price / 100000;
    return `${INR_SYMBOL}${lakh % 1 === 0 ? lakh : Number(lakh.toFixed(2))} L`;
  }
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(price);
}

export function formatArea(sqFt: number): string {
  return `${new Intl.NumberFormat("en-IN").format(sqFt)} sq.ft`;
}

export function formatNumber(num: number): string {
  return new Intl.NumberFormat("en-IN").format(num);
}
