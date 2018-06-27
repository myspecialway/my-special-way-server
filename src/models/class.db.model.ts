import { Cell } from './cell.model';

export interface ClassDbModel {
  _id: string;
  name: string;
  level: number;
  number: number;
  schedule?: Cell[];
}
