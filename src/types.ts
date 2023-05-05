export type ParsedCell = {
  essid?: string;
  id?: string;
  address?: string;
  frequency?: string;
  quality?: string;
};

export type Cell = {
  essid: string;
  frequency: number;
  quality: number;
  address: string;
  commands: string[];
  password?: string;
};
