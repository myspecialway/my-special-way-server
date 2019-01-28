import Point from './point.db.model';
import { ObjectId } from 'mongodb';
export default interface LocationDbModel {
  _id: string;
  name: string;
  location_id: string;
  position: Point;
  icon: string;
  type: string;
  image_id: string | ObjectId;
}
