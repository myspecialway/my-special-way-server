/* istanbul ignore next */
export interface IFCMData {
  data?: { [key: string]: string };
}

export const PersonalDetailsFcmData: IFCMData = {
  data: {
    TYPE: 'Update',
    DATA: 'PERSONAL_DETAILS', // PERSONAL_DETAILS, SCHEDULE, REMINDERS, ROUTES, GENERAL_SETTINGS
  },
};

export const ScheduleFcmData: IFCMData = {
  data: {
    TYPE: 'Update',
    DATA: 'SCHEDULE', // PERSONAL_DETAILS, SCHEDULE, REMINDERS, ROUTES, GENERAL_SETTINGS
  },
};
