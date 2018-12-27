export interface NonActiveTimeDbModel {
  _id?: string;
  title: string;
  isAllDayEvent: boolean;
  startDateTime: string;
  endDateTime: string;
  isAllClassesEvent: boolean;
  classesIds?: string[];
}
