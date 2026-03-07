// pages/api/early-access.js
import type { NextApiRequest, NextApiResponse } from 'next';

type ResponseData = {
  message: string;
};

// In-memory storage for demo purposes (replace with your preferred storage solution)
const registeredEmails = new Set<string>();

export default async function handler(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
  if (req.method === 'POST') {
    const { email } = req.body;

    if (!email || typeof email !== 'string') {
      res.status(400).json({ message: 'Invalid email' });
      return;
    }

    try {
      // Check if the email already exists
      if (registeredEmails.has(email)) {
        res.status(409).json({ message: 'Email already registered' });
        return;
      }

      // Add the email to the in-memory storage
      registeredEmails.add(email);

      console.log(`Email registered: ${email} at ${new Date().toISOString()}`);

      res.status(200).json({ message: 'Email registered' });
    } catch (error) {
      console.error('Failed to register email:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  } else {
    // Handle any other HTTP method
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
