import path from 'path';
import pug from 'pug';
import allowCors from '../helpers/allowCors';
import { sendEmail } from '../helpers/sendEmail';
import { genCSV } from '../mailer/genCSV';

const sender = async (req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (!req.body.values) return next(new Error('No values provided'));

  const {
    company,
    dic,
    email,
    ico,
    items,
    name,
    note,
    phone,
  } = req.body.values;

  const paragon_id = `NAB-${Date.now()}`;

  try {
    const compiledTemplate = pug.compileFile(
      path.join(__dirname, '..', '/templates/order.pug'),
      { basedir: path.join(__dirname, `/templates`) }
    );

    const stringTemplate = compiledTemplate({
      name,
      company,
      phone,
      email,
      note,
      dic,
      ico,
    });

    // TODO: extract emails to env vars
    const sgres = await sendEmail({
      to: [`vesely@parsdecin.cz`, `dominik.tomcik23@gmail.com`],
      subject: `Nová objednávka z PARS Shop`,
      html: stringTemplate,
      attachments: [
        genCSV(
          [
            {
              CISLO_DOKLADU: paragon_id,
              DATUM: new Date().toLocaleString(`cs-cz`, {
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
    });

    // console.log(sgres);
    res.json({ status: 202 });
  } catch (err) {
    console.log(err);
  }
};
module.exports = allowCors(sender);
