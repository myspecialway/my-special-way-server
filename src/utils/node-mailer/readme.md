(#Requires the installtion of nodemailer:
npm install nodemailer --save

# HowTo:

## Configuration:

Setup the SMTP settings in smtp.config under 'Utils/NodeMailer/'.
When using GMail, make sure you set it up (https://myaccount.google.com/lesssecureapps) to allow non secure applications access.
Additional information can be found here: https://community.nodemailer.com/using-gmail/

## Implementation:

import sendmail from 'Utils/NodeMailer/email.client'
Call sendemail command with these parameters:
(-) from (email address or name and email for better display)
(-) to (email address or name and email for better display)
(-) subject
(-) email body in the format of html
(-) email body in the format of text (optional)

# Example:

import { sendemail } from 'Utils/NodeMailer/email.client'
import { msg } from './Utils/nodeMailer/email.body';

let email = sendemail('"My Special Way" <mmyspecialway@gmail.com>', '"Eran Leiser (AT&T)" <el091q@intl.att.com>', 'Hello World!', msg.html,msg.text);
