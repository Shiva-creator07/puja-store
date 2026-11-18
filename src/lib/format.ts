export function formatPrice(paise: number): string {
  return (
    "₹" +
    (paise / 100).toLocaleString("en-IN", { maximumFractionDigits: 2 })
  );
}

export function discountPercent(
  pricePaise: number,
  mrpPaise: number | null,
): number | null {
  if (!mrpPaise || mrpPaise <= pricePaise) return null;
  return Math.round(((mrpPaise - pricePaise) / mrpPaise) * 100);
}
