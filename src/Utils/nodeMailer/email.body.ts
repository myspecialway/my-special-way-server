export interface EmailBody {
  html: string;
  text: string;
}

/* istanbul ignore next */
export const msg: EmailBody = {
  text: 'Hello world (text version)',
  html: '<P>Hello ✔ (HTML version)<P>',
};
