// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';

import { ethers, JsonRpcProvider } from 'ethers';

import dotenv from 'dotenv';
dotenv.config();

type Data = {
  number: number;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  const body = req.body;

  // Avalanche C-Chain RPC
  const rpcUrl = process.env.AVAX_RPC_URL || 'https://api.avax.network/ext/bc/C/rpc';
  const provider = new JsonRpcProvider(rpcUrl);

  const PRIVATE_KEY = process.env.PRIVATE_KEY;
  if (!PRIVATE_KEY) {
    throw new Error('PRIVATE_KEY is not defined in the environment variables.');
  }

  const balanceInWei = await provider.getBalance(body.address);

  const fairEstimate = 4454200000;

  // If low on AVAX gas, send some
  if (parseInt(balanceInWei.toString()) < fairEstimate) {
    const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
    try {
      await wallet.sendTransaction({
        to: body.address,
        value: fairEstimate * 20,
      });
    } catch (error: any) {
      console.error('Error sending transaction:', error);
      return res.status(500).json({ number: error });
    }

    return res.status(200).json(body);
  }

  return res.status(500).json(body);
}
