import { DateUtilesService } from './date-service';
import * as moment from 'moment';

describe('Date Utiles Service', () => {
  const dus = new DateUtilesService();

  it('should return true for expire date from week ago', async () => {
    const weekAgo = moment()
      .utc()
      .subtract(1, 'week');
    const isExpired = dus.isExpired(weekAgo.toISOString());
    expect(isExpired).toBeTruthy();
  });

  it('should return false for expire date in the future', async () => {
    const weekAgo = moment()
      .utc()
      .add(2, 'week');
    const isExpired = dus.isExpired(weekAgo.toISOString());
    expect(isExpired).toBeFalsy();
  });
});
