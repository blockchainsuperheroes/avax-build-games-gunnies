import { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';

// Validate environment variables
if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is not defined in environment variables');
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: `${process.env.STRIPE_API_VERSION}` as any, // Use latest API version
});

interface ShopItem {
  id: string;
  name: string;
  price: number;
  image: string;
  description: string;
  priceId: string;
  productId: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      // Fetch products from Stripe
      const products = await stripe.products.list({
        active: true,
        limit: 100, // Adjust limit as needed
      });

      // Fetch prices for all products
      const prices = await stripe.prices.list({
        active: true,
        limit: 100,
      });

      // Create a map of product ID to price
      const priceMap = new Map<string, Stripe.Price>();
      prices.data.forEach(price => {
        if (price.product && typeof price.product === 'string') {
          priceMap.set(price.product, price);
        }
      });

      // Transform Stripe products to shop items
      const shopItems: ShopItem[] = products.data
        .map(product => {
          const price = priceMap.get(product.id);
          if (!price || !price.unit_amount) {
            return null;
          }

          return {
            id: product.id,
            name: product.name,
            price: price.unit_amount / 100, // Convert from cents to dollars
            image: product.images?.[0] || '/images/shop/default-item.svg',
            description: product.description || '',
            priceId: price.id,
            productId: product.id,
          };
        })
        .filter((item): item is ShopItem => item !== null)
        .sort((a, b) => {
          // Priority products to show first
          const priorityProducts = [
            'Halloween Special Skin',
            'T-shirt',
            'T-Shirt ZERO CHILL',
            'T-Shirt HOP-RUN-BLAST',
            'T-Shirt BUN-ERGY',
          ];

          const aIsPriority = priorityProducts.includes(a.name);
          const bIsPriority = priorityProducts.includes(b.name);

          // If both are priority or both are not priority, sort by price
          if (aIsPriority === bIsPriority) {
            return a.price - b.price;
          }

          // Priority products come first
          return aIsPriority ? -1 : 1;
        });

      res.status(200).json({ items: shopItems });
    } catch (err) {
      console.error('Stripe products fetch error:', err);

      // Type-safe error handling
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';

      // Don't expose internal Stripe errors to client in production
      const clientErrorMessage =
        process.env.NODE_ENV === 'production' ? 'Failed to fetch products' : errorMessage;

      res.status(500).json({ error: clientErrorMessage });
    }
  } else {
    res.setHeader('Allow', 'GET');
    res.status(405).end('Method Not Allowed');
  }
}
