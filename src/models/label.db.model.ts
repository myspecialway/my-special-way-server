export interface LabelDbModel {
  _id?: string;
  type: LabelType;
  text: string;
  index?: number;
}

export enum LabelType {
  CLASS_HOURS,
}
