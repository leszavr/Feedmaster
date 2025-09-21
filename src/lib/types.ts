

export type Bot = {
  id: string;
  name: string;
  token: string;
  channelId: string;
  status: 'active' | 'inactive' | 'error' | 'stopped';
  lastScan?: Date | string;
};

export type Source = {
  id: string;
  name: string;
  type: 'RSS' | 'Telegram' | 'Web';
  url: string;
  botId: string;
  keywords: string;
  filterLogic: 'AND' | 'OR';
  blacklist: string;
  fetchInterval: number; // in minutes
  status: 'active' | 'paused';
  lastRun: Date | string;
};

export type Post = {
  id: string;
  title: string;
  content: string;
  summary?: string;
  link: string;
  source: {
    id: string;
    name: string;
    type: Source['type'];
  };
  fetchedAt: Date | string;
  status: 'pending' | 'approved' | 'rejected';
  keywords: string[];
};

export type User = {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: 'admin' | 'moderator';
  status: 'Active' | 'Suspended';
  suspendedUntil?: Date | string | null;
  suspensionReason?: string;
}

export type AuditLog = {
    id: number;
    user: string;
    action: string;
    bot?: string;
    timestamp: Date;
}
