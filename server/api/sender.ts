import path from 'path';
import pug from 'pug';
import allowCors from '../helpers/allowCors';
import createMailer from '../helpers/sendEmail';
import { genCSV } from '../mailer/genCSV';

const compiledTemplate = pug.compileFile(
  path.join(__dirname, '..', '/templates/template.pug'),
  { basedir: path.join(__dirname, `..`, `templates`) }
);

const customerStrings = {
  header: 'Potvrzení objednávky\nna PARS Shop',
  perex:
    'Brzy vás budeme kontaktovat s bližšími informacemi o vaší objednávce.',
  body_header: 'Vaše objednávka',
  customer_header: `Vaše údaje`,
  displayFooter: true,
};

const date = new Date();
const parsStrings = {
  header: 'Nová objednávka\nna PARS Shop',
  perex: `Nová objednávka ze dne ${date.toLocaleDateString(
    `cs-cz`
  )} z ${date.toLocaleTimeString(`cs-cz`)}`,
  body_header: 'Objednávka',
  customer_header: `Údaje zákazníka`,
  displayFooter: false,
};

const Sender = async (req, res, next) => {
  const {
    name,
    company,
    street,
    city,
    postal_code,
    ico,
    dic,
    phone,
    email,
    note,
    items,
  } = req.body.values;

  const customerMessage = {
    from: 'eshop@pars-sklad.cz',
    to: <string>email,
    subject: `Potvrzení objednávky na PARS Shop`,
    html: <string>compiledTemplate({
      customer_name: name,
      customer_data: [
        `${company}\n${street}, ${city}, ${postal_code}`,
        `${ico}\n${dic}`,
        `${phone}\n${email}`,
      ],
      customer_note: note,
      product_data: items,
      ...customerStrings,
    }),
  };

  const paragon_id = `NAB-${Date.now()}`;
  const parsMessage = {
    from: 'eshop@pars-sklad.cz',
    to: `dominik.tomcik23@gmail.com, vesely@parsdecin.cz`,
    subject: `Nová objednávka na PARS Shop`,
    html: <string>compiledTemplate({
      customer_name: name,
      customer_data: [
        `${company}\n${street}, ${city}, ${postal_code}`,
        `${ico}\n${dic}`,
        `${phone}\n${email}`,
      ],
      customer_note: note,
      product_data: items,
      ...parsStrings,
    }),
    attachments: [
      genCSV(
        [
          {
            CISLO_DOKLADU: paragon_id,
            DATUM: date.toLocaleString(`cs-cz`, {
              day: `numeric`,
              month: `numeric`,
              year: `numeric`,
            }),
            NAZEV: name,
            ADRESA: company,
            ICO: ico,
            DIC: dic,
            TELEFON: phone,
            EMAIL: email,
          },
        ],
        `_hlavicka.csv`
      ),
      genCSV(
        items.map(({ varioId, dimensions, no, unit }) => ({
          CISLO_DOKLADU: paragon_id,
          PRODUKT: varioId,
          MNOZSTVI: no,
          ROZMER: dimensions,
          JEDNOTKY: unit,
        })),
        `_polozky.csv`
      ),
    ],
  };

  try {
    const sendEmails = await Promise.all([
      createMailer(customerMessage),
      createMailer(parsMessage),
    ]);
    res.json(sendEmails);
  } catch (e) {
    res.json(e);
  }
};

module.exports = allowCors(Sender);
