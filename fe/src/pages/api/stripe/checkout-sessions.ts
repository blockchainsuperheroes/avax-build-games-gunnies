import { NextApiRequest, NextApiResponse } from 'next';

import Stripe from 'stripe';

const ALL_ALLOWED_COUNTRIES: Stripe.Checkout.SessionCreateParams.ShippingAddressCollection.AllowedCountry[] =
  [
    'AC',
    'AD',
    'AE',
    'AF',
    'AG',
    'AI',
    'AL',
    'AM',
    'AO',
    'AQ',
    'AR',
    'AT',
    'AU',
    'AW',
    'AX',
    'AZ',
    'BA',
    'BB',
    'BD',
    'BE',
    'BF',
    'BG',
    'BH',
    'BI',
    'BJ',
    'BL',
    'BM',
    'BN',
    'BO',
    'BQ',
    'BR',
    'BS',
    'BT',
    'BV',
    'BW',
    'BY',
    'BZ',
    'CA',
    'CD',
    'CF',
    'CG',
    'CH',
    'CI',
    'CK',
    'CL',
    'CM',
    'CN',
    'CO',
    'CR',
    'CV',
    'CW',
    'CY',
    'CZ',
    'DE',
    'DJ',
    'DK',
    'DM',
    'DO',
    'DZ',
    'EC',
    'EE',
    'EG',
    'EH',
    'ER',
    'ES',
    'ET',
    'FI',
    'FJ',
    'FK',
    'FO',
    'FR',
    'GA',
    'GB',
    'GD',
    'GE',
    'GF',
    'GG',
    'GH',
    'GI',
    'GL',
    'GM',
    'GN',
    'GP',
    'GQ',
    'GR',
    'GS',
    'GT',
    'GU',
    'GW',
    'GY',
    'HK',
    'HN',
    'HR',
    'HT',
    'HU',
    'ID',
    'IE',
    'IL',
    'IM',
    'IN',
    'IO',
    'IQ',
    'IS',
    'IT',
    'JE',
    'JM',
    'JO',
    'JP',
    'KE',
    'KG',
    'KH',
    'KI',
    'KM',
    'KN',
    'KR',
    'KW',
    'KY',
    'KZ',
    'LA',
    'LB',
    'LC',
    'LI',
    'LK',
    'LR',
    'LS',
    'LT',
    'LU',
    'LV',
    'LY',
    'MA',
    'MC',
    'MD',
    'ME',
    'MF',
    'MG',
    'MK',
    'ML',
    'MM',
    'MN',
    'MO',
    'MQ',
    'MR',
    'MS',
    'MT',
    'MU',
    'MV',
    'MW',
    'MX',
    'MY',
    'MZ',
    'NA',
    'NC',
    'NE',
    'NG',
    'NI',
    'NL',
    'NO',
    'NP',
    'NR',
    'NU',
    'NZ',
    'OM',
    'PA',
    'PE',
    'PF',
    'PG',
    'PH',
    'PK',
    'PL',
    'PM',
    'PN',
    'PR',
    'PS',
    'PT',
    'PY',
    'QA',
    'RE',
    'RO',
    'RS',
    'RU',
    'RW',
    'SA',
    'SB',
    'SC',
    'SD',
    'SE',
    'SG',
    'SH',
    'SI',
    'SJ',
    'SK',
    'SL',
    'SM',
    'SN',
    'SO',
    'SR',
    'SS',
    'ST',
    'SV',
    'SX',
    'SZ',
    'TA',
    'TC',
    'TD',
    'TF',
    'TG',
    'TH',
    'TK',
    'TL',
    'TM',
    'TN',
    'TO',
    'TR',
    'TT',
    'TV',
    'TW',
    'TZ',
    'UA',
    'UG',
    'US',
    'UY',
    'UZ',
    'VA',
    'VC',
    'VE',
    'VG',
    'VN',
    'VU',
    'WF',
    'WS',
    'XK',
    'YE',
    'YT',
    'ZA',
    'ZM',
    'ZW',
  ];

// Validate environment variables
if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is not defined in environment variables');
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: `${process.env.STRIPE_API_VERSION}` as any, // Use latest API version
});

// ...imports and Stripe client as you already have...

interface LineItem {
  name: string;
  unitAmount: number; // in smallest currency unit (e.g. cents)
  quantity: number;
  priceId?: string;
}

interface CheckoutSessionRequest {
  lineItems: LineItem[];
  currency?: string; // only used when building price_data on the fly
  customer_id?: string;
  wallet_id?: string;
  player_id?: string;

  // NEW (optional) — turn on shipping collection:
  requireShipping?: boolean; // set true for physical goods (e.g. t-shirt)
  shippingCountries?: string[]; // ISO country codes (e.g. ['US','CA','GB','FR','VN'])
  shippingRates?: string[]; // existing Shipping Rate IDs (shr_...) if you created them in dashboard
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).end('Method Not Allowed');
  }

  try {
    const {
      lineItems = [],
      currency = 'usd',
      customer_id,
      wallet_id,
      player_id,
      requireShipping = false,
      shippingCountries = ALL_ALLOWED_COUNTRIES,
      shippingRates = [], // dashboard-created shipping rate IDs (optional)
    }: CheckoutSessionRequest = req.body || {};

    if (!req.headers.origin) return res.status(400).json({ error: 'Origin header is required' });
    if (!lineItems.length) return res.status(400).json({ error: 'Line items are required' });

    // Detect recurring prices (your existing logic)
    let hasRecurringPrices = false;
    const priceLookups: Promise<Stripe.Price>[] = [];
    for (const item of lineItems) {
      if (!item.name) return res.status(400).json({ error: 'Each line item must have a name' });
      if (!item.priceId && (!item.unitAmount || item.unitAmount <= 0)) {
        return res.status(400).json({ error: 'unitAmount required when priceId is not provided' });
      }
      if (!item.quantity || item.quantity <= 0) {
        return res.status(400).json({ error: 'Each line item must have a valid quantity' });
      }
      if (item.priceId) priceLookups.push(stripe.prices.retrieve(item.priceId));
    }
    if (priceLookups.length) {
      const prices = await Promise.all(priceLookups);
      hasRecurringPrices = prices.some(p => p.type === 'recurring');
    }
    const mode: 'payment' | 'subscription' = hasRecurringPrices ? 'subscription' : 'payment';

    // If using existing prices, figure out the session currency for inline shipping rates
    let sessionCurrency = currency.toLowerCase();
    if (lineItems[0]?.priceId) {
      const firstPrice = await stripe.prices.retrieve(lineItems[0].priceId!);
      sessionCurrency = firstPrice.currency;
    }

    // Build shipping options
    const shippingOptions: Stripe.Checkout.SessionCreateParams.ShippingOption[] = [];

    // 1) Use dashboard Shipping Rates if provided
    for (const rateId of shippingRates) shippingOptions.push({ shipping_rate: rateId });

    // 2) Or create inline rates on the fly (examples)
    if (shippingOptions.length === 0 && requireShipping) {
      shippingOptions.push(
        {
          shipping_rate_data: {
            type: 'fixed_amount',
            fixed_amount: { amount: 500, currency: sessionCurrency }, // 5.00
            display_name: 'Standard Shipping',
            delivery_estimate: {
              minimum: { unit: 'business_day', value: 5 },
              maximum: { unit: 'business_day', value: 10 },
            },
          },
        },
        {
          shipping_rate_data: {
            type: 'fixed_amount',
            fixed_amount: { amount: 1500, currency: sessionCurrency }, // 15.00
            display_name: 'Express Shipping',
            delivery_estimate: {
              minimum: { unit: 'business_day', value: 1 },
              maximum: { unit: 'business_day', value: 3 },
            },
          },
        }
      );
    }

    const session = await stripe.checkout.sessions.create({
      mode,
      payment_method_types: ['card'],

      // 🔑 Collect shipping address for physical goods
      ...(requireShipping && {
        shipping_address_collection: {
          allowed_countries:
            shippingCountries as Stripe.Checkout.SessionCreateParams.ShippingAddressCollection.AllowedCountry[],
        },
        shipping_options: shippingOptions,
        phone_number_collection: { enabled: true }, // optional, useful for couriers
        customer_update: { shipping: 'auto' }, // save shipping on the Customer if provided
      }),

      line_items: lineItems.map(item =>
        item.priceId
          ? { price: item.priceId, quantity: item.quantity }
          : {
              price_data: {
                currency: sessionCurrency, // keep consistent with shipping rates
                product_data: { name: item.name },
                unit_amount: item.unitAmount,
              },
              quantity: item.quantity,
            }
      ),

      customer: customer_id,
      success_url: `${req.headers.origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.origin}/cancel`,
      metadata: {
        platform: 'website',
        playerId: player_id || '',
        walletId: wallet_id || '',
        priceData: JSON.stringify(
          lineItems.map(i => ({ priceId: i.priceId || '', quantity: i.quantity }))
        ),
      },

      ...(mode === 'subscription'
        ? {
            subscription_data: {
              metadata: {
                platform: 'website',
                playerId: player_id || '',
                walletId: wallet_id || '',
              },
            },
          }
        : {
            payment_intent_data: {
              metadata: {
                platform: 'website',
                playerId: player_id || '',
                walletId: wallet_id || '',
                priceData: JSON.stringify(
                  lineItems.map(i => ({ priceId: i.priceId || '', quantity: i.quantity }))
                ),
              },
            },
          }),
    });

    return res.status(200).json({ sessionId: session.id, url: session.url });
  } catch (err) {
    console.error('Stripe checkout session creation error:', err);
    const message = err instanceof Error ? err.message : 'An unexpected error occurred';
    return res.status(500).json({
      error: process.env.NODE_ENV === 'production' ? 'Payment session creation failed' : message,
    });
  }
}
