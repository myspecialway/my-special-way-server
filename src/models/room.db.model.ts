import Point from './point.db.model';
export default interface RoomDbModel {
    _id: string;
    name: string;
    disabled: boolean;
    position: Point;
}