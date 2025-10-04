import { Size } from './size';

export interface Inventory {
  id: number;
  quantity: number;
  sold: number;
  size: Size;
}
