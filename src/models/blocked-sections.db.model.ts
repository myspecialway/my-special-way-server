export default interface BlockedSectionsDbModel {
  _id: string;
  reason: string;
  from: string;
  to: string;
}
