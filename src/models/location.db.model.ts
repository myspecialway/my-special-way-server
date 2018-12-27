import Point from './point.db.model';
export default interface LocationDbModel {
  _id: string;
  name: string;
  location_id: string;
  position: Point;
  icon: string;
  type: string;
}
