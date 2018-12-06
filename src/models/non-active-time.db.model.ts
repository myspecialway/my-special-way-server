export interface NonActiveTimeDbModel {
  _id: string;
  title: string;
  isAllDayEvent: boolean;
  startDateTime: number;
  endDateTime: number;
  isAllClassesEvent: boolean;
  classesIds?: string[];
}
