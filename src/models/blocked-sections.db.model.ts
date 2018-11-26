import Location from './location.db.model';

export default interface BlockedSectionsDbModel {
  _id: string;
  reason: string;
  fromLocation: Location;
  toLocation: Location;
}
