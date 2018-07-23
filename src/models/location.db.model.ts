import Point from './point.db.model';
export default interface LocationDbModel {
    _id: string;
    name: string;
    disabled: boolean;
    position: Point;
}
