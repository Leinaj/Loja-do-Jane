import { notFound } from 'next/navigation';
import ProductView from './parts/ProductView';
import { products } from '@/lib/products';

type Params = { params: { slug: string } };

export default function Page({ params }: Params) {
  const product = products.find((p) => p.slug === params.slug);

  if (!product) {
    notFound();
  }

  // Server component pode passar props para um Client component sem problemas
  return <ProductView product={product!} />;
}