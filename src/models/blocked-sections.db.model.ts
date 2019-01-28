import { ObjectId } from 'mongodb';

export default interface BlockedSectionsDbModel {
  _id: string;
  reason: string;
  from: string | ObjectId;
  to: string | ObjectId;
}
