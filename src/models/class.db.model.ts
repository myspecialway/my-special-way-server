export interface ClassDbModel {
  _id: string;
  name: string;
  level: number;
  number: number;
  schedule: object;
  // area?: Area; TBD: represent area on map. will be implemented in future
}
