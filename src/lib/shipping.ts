import { SITE } from "@/lib/site";

// Delivery charge in paise for an order with this subtotal.
export function shippingFor(subtotalPaise: number): number {
  if (subtotalPaise <= 0) return 0;
  if (
    SITE.freeShippingOverPaise > 0 &&
    subtotalPaise >= SITE.freeShippingOverPaise
  ) {
    return 0;
  }
  return SITE.shippingFlatPaise;
}