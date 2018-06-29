// Describes a single timeslot on the schedule
export interface TimeSlotDbModel {
    index: string; // (A1,A2...)
    lesson_id?: string;
    room_id?: string;
}