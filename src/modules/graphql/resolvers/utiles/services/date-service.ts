import * as moment from 'moment';
import { Injectable } from '@nestjs/common';
@Injectable()
export class DateUtilesService {
  isExpired(expired: string | Date) {
    if (
      moment()
        .utc()
        .isAfter(expired)
    ) {
      return true;
    }
  }
}
