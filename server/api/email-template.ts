import allowCors from '../helpers/allowCors';
import pug from 'pug';
import path from 'path';

const dummyFormData = {
  name: 'Jan Novák',
  company: 'Firma',
  street: 'Obilní trh 4',
  city: 'Brno',
  postal_code: '602 00',
  email: 'novak@firma.cz',
  phone: '+420 775 337 604',
  ico: '12367890',
  dic: '12345890',
  note: 'Lorem ipsum dolor sit amet',
};
const templateData = (
  product_name = 'name',
  product_perex = 'perex',
  product_no_items = '10',
  customer_name = 'Dominik Tomčík',
  customer_data = [
    'STEEZY s.r.o.\nVlhká 26, Brno 602 00',
    'IČO 123 45 678\nDIČ CZ 123 45 678',
    '+420 775 456 789\nnovak@firma.cz',
  ],
  customer_note = 'note'
) => ({
  header: 'Nová objednávka\nna PARS Shop',
  perex:
    'Brzy vás budeme kontaktovat s bližšími informacemi o vaší objednávce.',
  body_header: 'Vaše objednávka',
  product_name,
  product_perex,
  product_no_items,
  customer_name,
  customer_note,
  customer_data,
});

function template(req, res, next) {
  const compiledTemplate = pug.compileFile(
    path.join(__dirname, '..', '/templates/template.pug'),
    { basedir: path.join(__dirname, `..`, `templates`) }
  );

  const stringTemplate = compiledTemplate(templateData());

  res.send(stringTemplate);
}

module.exports = allowCors(template);
