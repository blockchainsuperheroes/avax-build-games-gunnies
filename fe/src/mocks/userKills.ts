export interface KillLog {
  chain_id: number;
  tx_hash: string;
  status: string;
  created_at: string;
  explorer_link: string;
}

export interface KillItem {
  id: number;
  match_id: string;
  count: number;
  created_at: string;
  to_user_username: string;
  logs: KillLog[];
}

export interface UserKillsResult {
  total_kills: number;
  items: KillItem[];
  total_item: number;
  total_page: number;
}

export interface UserKillsResponse {
  success: boolean;
  result: UserKillsResult;
}
