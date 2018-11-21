export interface EmailBody {
  html: string;
  text: string;
}

/* istanbul ignore next */
export const msg: EmailBody = {
  text: 'Hello world (text version)',
  html: '<P>Hello ✔ (HTML version)<P>',
};

export const restoreTemplate: string = `
<div class="email-content" style="text-align: right">
  <h1>שחזור ססמא למערכת בדרכי שלי </h1>
  <p>שלום שם פרטי שם משפחה>,</p>
  <p>אנו שולחים לך לינק חדש לכניסה למערכת.</p>
  <p>על מנת להתחיל להשתמש במערכת, יש ללחוץ על הלינק הבא ולהגדיר את סיסמתך:</p>
  <a href="#">http://www.example.com</a>
  <p>תודה!</p>
</div>
`;
