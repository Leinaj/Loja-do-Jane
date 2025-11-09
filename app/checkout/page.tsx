import CartProviderClient from '../cart-provider';
import CheckoutClient from './CheckoutClient';

export default function CheckoutPage() {
  return (
    <CartProviderClient>
      <CheckoutClient />
    </CartProviderClient>
  );
}