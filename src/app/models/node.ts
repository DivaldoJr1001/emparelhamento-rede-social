export interface Node {
  id: number;
  label: string;
  shape?: string;
  color?: {
    background: string,
    border: string
    highlight?: {
      border: string;
      background: string;
    }
  };
  font?: {
    color: string;
  };
  x?: number;
  y?: number;
}
