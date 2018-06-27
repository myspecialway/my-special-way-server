import RoomDbModel from './room.db.model';
import { LessonDbModel } from './lesson.db.model';
// describes a single cell on the schedule spreadsheet
export interface Cell {
    pos: string; // (A1,A2...)
    lesson?: LessonDbModel;
    room?: RoomDbModel;
}