export const gunniesKillerAbi = [
  {
    anonymous: false,
    inputs: [
      { indexed: false, internalType: 'string', name: 'matchId', type: 'string' },
      { indexed: false, internalType: 'address', name: 'from', type: 'address' },
      { indexed: false, internalType: 'address', name: 'to', type: 'address' },
    ],
    name: 'Kill',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: false, internalType: 'string', name: 'matchId', type: 'string' },
      { indexed: false, internalType: 'address', name: 'from', type: 'address' },
      { indexed: false, internalType: 'address', name: 'to', type: 'address' },
      { indexed: false, internalType: 'uint256', name: 'totalKill', type: 'uint256' },
    ],
    name: 'KillTotal',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: false, internalType: 'address', name: 'from', type: 'address' },
      { indexed: false, internalType: 'uint256', name: 'totalKill', type: 'uint256' },
      { indexed: false, internalType: 'uint256', name: 'lastUpdate', type: 'uint256' },
    ],
    name: 'TotalKill',
    type: 'event',
  },
  {
    inputs: [{ internalType: 'address', name: '', type: 'address' }],
    name: 'whitelisted',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'view',
    type: 'function',
  },
] as const;
