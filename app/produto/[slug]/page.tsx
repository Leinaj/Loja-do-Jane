import { notFound } from 'next/navigation';
import CartProviderClient from '../../cart-provider';
import { getProduct } from '../../data/products';
import ProductClient from './product-client';

type PageProps = {
  params: { slug: string };
};

export default async function Page({ params }: PageProps) {
  const product = await getProduct(params.slug);
  if (!product) return notFound();

  return (
    <CartProviderClient>
      <ProductClient product={product} />
    </CartProviderClient>
  );
}