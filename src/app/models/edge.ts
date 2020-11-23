export interface Edge {
  id: number;
  to: number;
  from: number;
  dashes: boolean;
  color: {
    color: string,
    inherit: boolean
  };
}
