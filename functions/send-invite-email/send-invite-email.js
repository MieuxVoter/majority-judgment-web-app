const fs = require("fs");
const Mailgun = require("mailgun.js");
const formData = require("form-data");
const dotenv = require("dotenv");
const i18next = require("i18next");
const Backend = require("i18next-chained-backend");
const FSBackend = require("i18next-fs-backend");
const HttpApi = require("i18next-http-backend");
const Handlebars = require("handlebars");

dotenv.config();
const {
  MAILGUN_API_KEY,
  MAILGUN_DOMAIN,
  MAILGUN_URL,
  FROM_EMAIL_ADDRESS,
  CONTACT_TO_EMAIL_ADDRESS,
} = process.env;

const mailgun = new Mailgun(formData);
const mg = mailgun.client({
  username: "api",
  key: MAILGUN_API_KEY,
  url: "https://api.eu.mailgun.net",
});

const success = {
  statusCode: 200,
  body: "Your message was sent successfully! We'll be in touch.",
};
const err = {
  statusCode: 422,
  body: "Can't send message",
};

// setup i18n
i18next.use(Backend).init({
  lng: "en",
  ns: ["emailInvite", "common"],
  defaultNS: "emailInvite",
  fallbackNS: "common",
  debug: false,
  fallbackLng: ["en", "fr"],
  backend: {
    backends: [FSBackend, HttpApi],
    backendOptions: [{ loadPath: "/public/locales/{{lng}}/{{ns}}.json" }, {}],
  },
});

// setup the template engine
// See https://github.com/UUDigitalHumanitieslab/handlebars-i18next
function extend(target, ...sources) {
  sources.forEach((source) => {
    if (source)
      for (let key in source) {
        target[key] = source[key];
      }
  });
  return target;
}
Handlebars.registerHelper("i18n", function (key, { hash, data, fn }) {
  let parsed = {};
  const jsonKeys = [
    "lngs",
    "fallbackLng",
    "ns",
    "postProcess",
    "interpolation",
  ];
  jsonKeys.forEach((key) => {
    if (hash[key]) {
      parsed[key] = JSON.parse(hash[key]);
      delete hash[key];
    }
  });
  let options = extend({}, data.root.i18next, hash, parsed, {
    returnObjects: false,
  });
  let replace = (options.replace = extend({}, this, options.replace, hash));
  delete replace.i18next; // may creep in if this === data.root
  if (fn) options.defaultValue = fn(replace);
  return new Handlebars.SafeString(i18next.t(key, options));
});
const txtStr = fs.readFileSync(__dirname + "/invite.txt").toString();
const txtTemplate = Handlebars.compile(txtStr);
const htmlStr = fs.readFileSync(__dirname + "/invite.html").toString();
const htmlTemplate = Handlebars.compile(htmlStr);

const sendMail = async (event) => {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: "Method Not Allowed",
      headers: { Allow: "POST" },
    };
  }

  const data = JSON.parse(event.body);
  if (!data.recipientVariables || !data.title) {
    return {
      statusCode: 422,
      body: "Recipient variables and title are required.",
    };
  }

  i18next.changeLanguage(data.locale || "en");
  const templateData = {
    title: data.title,
  };

  const mailgunData = {
    from: `${i18next.t("Mieux Voter")} <mailgun@mg.app.mieuxvoter.fr>`,
    to: Object.keys(data.recipientVariables),
    text: txtTemplate(templateData),
    html: htmlTemplate(templateData),
    subject: data.title,
    "h:Reply-To": "app@mieuxvoter.fr",
    "recipient-variables": JSON.stringify(data.recipientVariables),
  };

  const res = mg.messages
    .create("mg.app.mieuxvoter.fr", mailgunData)
    .then((msg) => {
      console.log(msg);
      return success;
    }) // logs response data
    .catch((err) => {
      console.log(err);
      return success;
    }); // logs any error

  return res;
};

exports.handler = sendMail;
