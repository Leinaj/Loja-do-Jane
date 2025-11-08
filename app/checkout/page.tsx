export const dynamic = "force-dynamic"; // evita prerender estático que quebra o hook

import CheckoutClient from "@/components/checkout/CheckoutClient";

export default function CheckoutPage() {
  return <CheckoutClient />;
}