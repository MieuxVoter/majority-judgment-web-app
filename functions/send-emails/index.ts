import fs from 'fs';
import {Handler} from "@netlify/functions";
import formData from 'form-data';
import Mailgun from 'mailgun.js';
import Handlebars from 'handlebars';
import {i18n} from '../../next-i18next.config.js';
import i18next from 'i18next';
import {MailgunMessageData} from "mailgun.js/interfaces/Messages.js";


const {
  MAILGUN_API_KEY,
  MAILGUN_DOMAIN,
  MAILGUN_URL,
  FROM_EMAIL_ADDRESS,
  REPLY_TO_EMAIL_ADDRESS,
} = process.env;

const mailgun = new Mailgun(formData);
const mg = mailgun.client({
  username: 'api',
  key: MAILGUN_API_KEY,
  url: MAILGUN_URL
});

const txtStr = fs.readFileSync(__dirname + "/invite.txt").toString()


i18next.init({
  fallbackLng: 'en',
  ns: ['file1', 'file2'],
  defaultNS: 'file1',
  debug: true
}, (err, t) => {
  if (err) return console.log('something went wrong loading', err);
  t("foo");
});


Handlebars.registerHelper('i18n',
  (str: string): string => {
    return (i18next != undefined ? i18next.t(str) : str);
  }
);


interface RequestPayload {
  recipients: {[email: string]: {[key: string]: string}};
  options: any;
  locale: string;
  action: "invite" | "admin";
}

const handler: Handler = async (event) => {
  /**
   * Send a mail using Mailgun
   */
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: 'Method Not Allowed',
      headers: {Allow: 'POST'},
    };
  }

  const {recipients, options, action, locale} = JSON.parse(event.body) as RequestPayload;

  if (!recipients) {
    return {
      statusCode: 422,
      body: 'The list of recipients is missing.',
    };
  }

  if (!action || !["invite", "admin"].includes(action)) {
    return {
      statusCode: 422,
      body: 'Unknown action.',
    };
  }

  if (!locale || !["fr", "gb"].includes(locale)) {
    return {
      statusCode: 422,
      body: 'Unknown locale.',
    };
  }

  // TODO setup locale

  const htmlTemplate = "FOO"; //fs.readFileSync(`${__dirname}/${action}.txt`).toString();
  const htmlContent = Handlebars.compile(htmlTemplate);

  const payload: MailgunMessageData = {
    // from: `${i18next.t("Mieux Voter")} <mailgun@mg.app.mieuxvoter.fr>`,
    from: FROM_EMAIL_ADDRESS || '"Mieux Voter" <postmaster@mg.app.mieuxvoter.fr>',
    to: Object.keys(recipients),
    subject: i18next.t(`emails.subject-${action}`),
    html: htmlContent({}),
    'h:Reply-To': REPLY_TO_EMAIL_ADDRESS || 'app@mieuxvoter.fr',
    'o:tag': action,
    'o:require-tls': true,
    'o:dkim': true,
    'recipient-variables': JSON.stringify(recipients),
  };
  console.log(payload)

  try {
    const res = await mg.messages.create(MAILGUN_DOMAIN, payload)
    return {
      statusCode: 200,
      body: JSON.stringify(
        {
          ...res,
          "status": `${recipients.length} emails were sent.`,
        }
      )
    }
  } catch {
    return {
      statusCode: 422,
      body: JSON.stringify(
        {
          "status": "can not send the message"
        }
      )
    }
  };

};

export {handler};
