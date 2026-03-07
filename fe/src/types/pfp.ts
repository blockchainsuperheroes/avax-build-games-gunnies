export type PFPDisplayStatus = 'mint' | 'sbt' | 'nft';

export interface AvalancheNftItem {
  token_id: string;
  name: string;
  type?: string;
  image?: string;
  desc?: string;
  file_type?: string;
  owner?: string;
  upgraded?: boolean;
  transferable?: boolean;
  metadata?: Array<{ trait_type: string; value: string }>;
}

export interface AvalancheNftsResponse {
  success: boolean;
  result: {
    items: AvalancheNftItem[];
    total_item: number;
    total_page: number;
  };
}

export interface PFPDisplayItem {
  id: number;
  name: string;
  image: string;
  status: PFPDisplayStatus;
  price?: string;
  isFreeMint?: boolean;
}
