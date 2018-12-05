export interface NonActiveTimeDbModel {
  _id: string;
  title: string;
  isAllDayEvent: boolean;
  startDateTime: Date;
  endDateTime: Date;
  isAllClassesEvent: boolean;
  classes?: string[];
}
