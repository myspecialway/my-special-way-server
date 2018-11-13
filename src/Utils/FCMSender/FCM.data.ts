/* istanbul ignore next */
export interface FCMData {
    data?: {[key: string]: string};
  }

/* istanbul ignore next */
export const DATA: FCMData = {
    data : {
        TYPE : 'Update',
        DATA : 'PERSONAL_DETAILS', // PERSONAL_DETAILS, SCHEDULE, REMINDERS, ROUTES, GENERAL_SETTINGS
    },
};
