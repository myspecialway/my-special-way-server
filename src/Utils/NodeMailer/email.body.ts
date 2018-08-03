export interface EmailBody {
    html: string;
    text: string;
  }

export const msg: EmailBody = {
    text: 'Hello world (text version)',
    html: '<P>Hello ✔ (HTML version)<P>',
};
