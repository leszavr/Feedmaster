
export type Bot = {
  id: string;
  name: string;
  token: string;
  channelId: string;
  status: 'active' | 'inactive' | 'error';
};

export type Source = {
  id: string;
  name: string;
  type: 'RSS' | 'Telegram' | 'Web';
  url: string;
  keywords: string;
  filterLogic: 'AND' | 'OR';
  blacklist: string;
  fetchInterval: number; // in minutes
  status: 'active' | 'paused';
  lastRun: Date;
};

export type Post = {
  id: string;
  title: string;
  content: string;
  summary?: string;
  link: string;
  source: {
    name: string;
    type: Source['type'];
  };
  fetchedAt: Date;
  status: 'pending' | 'approved' | 'rejected';
  keywords: string[];
};

export type User = {
  name: string;
  email: string;
  avatar: string;
}
