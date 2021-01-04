import axios from 'axios';
import { Field, Form, Formik } from 'formik';
import React from 'react';
import { useCookies } from 'react-cookie';
import { absoluteUrl } from '../../helpers/absoluteUrl';
import { getShopItemByVarioId } from '../../helpers/getShopItemByVarioId';
import strings from '../../helpers/strings';
import Button from '../components/Button';
import Cart from '../components/Cart';
import FieldGroup from '../components/FieldGroup';
import Link from '../components/Link';
import TextInput from '../components/TextInput';
import View from '../components/View';
import { DataProvider } from '../hocs/dataContext';

interface Props {}

function validate(values) {
  const errors = {};
  const {
    name,
    companyName,
    dic,
    generic,
    email,
    ico,
    phone,
    street,
    city,
    postal_code,
  } = strings.demandForm.errors;
  // name validation
  if (values.name.length === 0) {
    errors['name'] = name;
  }

  // company name validation
  if (values.company.length === 0) {
    errors['company'] = companyName;
  }

  // email & phone validation
  if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,6})+$/.test(values.email)) {
    errors['email'] = email;
  }
  if (
    !/^(?:\+\d{1,3}|0\d{1,3}|00\d{1,2})?(?:\s?\(\d+\))?(?:[-\/\s.]|\d)+$/i.test(
      values.phone
    )
  ) {
    errors['phone'] = phone;
  }

  // ico & dic validation
  if (!/^[0-9]{8,12}$/i.test(values.ico)) {
    errors['ico'] = ico;
  }

  if (!/^[A-Za-z]{2}[0-9]{8,12}$/i.test(values.dic)) {
    errors['dic'] = dic;
  }

  if (!/\d{3} ?\d{2}/.test(values.postal_code)) {
    errors['postal_code'] = postal_code;
  }

  if (
    !/^(.*[^0-9]+) (([1-9][0-9]*)\/)?([1-9][0-9]*[a-cA-C]?)$/.test(
      values.street
    )
  ) {
    errors['street'] = street;
  }

  if (!/^[^0-9]*$/i.test(values.city)) {
    errors['city'] = city;
  }

  // check cart items for errors
  for (const item in values.items) {
    const curr = values.items[item];
    if (
      isNaN(curr.dimensions) ||
      curr.dimensions < 0 ||
      isNaN(curr.no) ||
      curr.no < 0
    ) {
      errors['items'] = {
        // @ts-ignore
        ...errors.items,
        [item]: {
          dimensions: generic,
          no: generic,
        },
      };
    }
  }

  return errors;
}

const Demand: React.FC<Props> = () => {
  const [varioIds, setVarioIds] = React.useState([]);
  const { shopItemsVariants, shopItems } = React.useContext(DataProvider);
  const [cookies, setCookies, removeCookies] = useCookies();

  React.useEffect(() => {
    setVarioIds(cookies.parsCart || []);
  }, [cookies.parsCart]);

  const removeItem = (varioId) => {
    setCookies(
      'parsCart',
      cookies.parsCart.filter((x) => x !== varioId)
    );
    // @ts-ignore
    window.updateDemandBadge();
  };

  console.log({ shopItems });

  const dummyFormData = {
    name: 'Jan Novák',
    company: 'Firma',
    street: 'Obilní trh 4',
    city: 'Brno',
    postal_code: '602 00',
    email: 'dominik.tomcik23@gmail.com',
    phone: '+420 775 337 604',
    ico: '12367890',
    dic: 'CZ12345890',
    note: 'Lorem ipsum dolor sit amet',
  };

  return (
    <View className={`demand-view`}>
      <div className={`demand-container`}>
        <div className={`demand-container__intro`}>
          <h1>Poptávka</h1>
          <p>
            Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam
            nonummy nibh euis. Lorem ipsum dolor sit amet, consectetuer
            adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet
            dolore magna aliquam erat volutpat.
          </p>
        </div>
        <div className={`demand-container__content`}>
          {varioIds.length !== 0 ? (
            <Formik
              // key={JSON.stringify(varioIds)}
              validate={validate}
              initialValues={{
                ...dummyFormData, // name: '',
                // company: '',
                // email: '',
                // phone: '',
                // ico: '',
                // dic: '',
                // note: '',
                items: varioIds.reduce((acc, curr) => {
                  return {
                    ...acc,
                    [curr]: {
                      dimensions: 0,
                      no: 0,
                    },
                  };
                }, []),
              }}
              onSubmit={(values, actions) => {
                const apiUrl = absoluteUrl(`localhost:3000`);
                actions.setSubmitting(true)
                axios
                  .post(
                    `${apiUrl}/api/sender`,
                    Object.assign(
                      {},
                      {
                        values: {
                          ...values,
                          items: Object.keys(values.items).map((varioId) => {
                            const {
                              unit,
                              shopItemId: shopItemIdFromVariants,
                              dimensions,
                            } = getShopItemByVarioId(
                              shopItemsVariants,
                              varioId
                            );
                            const { name } = shopItems.find(
                              ({ shopItemId }) =>
                                shopItemId === shopItemIdFromVariants
                            );
                            return {
                              dimensions: values.items[varioId].dimensions,
                              no: values.items[varioId].no,
                              varioId: varioId,
                              unit: unit,
                              product_name: name,
                              product_perex: dimensions,
                            };
                          }),
                        },
                      }
                    )
                  )
                  .then((res) => {
                    if (res.status === 200) {
                      actions.resetForm();
                      actions.setSubmitting(false)
                      removeCookies('parsCart');
                      // @ts-ignore
                      window.updateDemandBadge();
                      window.scrollTo(0, 0);
                    }
                  });
              }}
            >
              {({isSubmitting}) => (
                <Form className={`form`}>
                  {/* <h2>Produkty</h2> */}
                  <Cart varioIds={varioIds} removeItem={removeItem} />
                  <h2>Osobní údaje</h2>
                  <FieldGroup>
                    <Field
                      label={`Jméno`}
                      name={'name'}
                      hint={`Lorem ipsum dolor sit amet`}
                      as={TextInput}
                    />
                  </FieldGroup>
                  <FieldGroup>
                    <Field label={`Firma`} name={'company'} as={TextInput} />
                  </FieldGroup>
                  <FieldGroup>
                    <Field
                      label={`Ulice a č.p.`}
                      name={`street`}
                      as={TextInput}
                    />
                    <Field label={`Město`} name={`city`} as={TextInput} />
                    <Field label={`PSČ`} name={`postal_code`} as={TextInput} />
                  </FieldGroup>
                  <FieldGroup>
                    <Field label={`E-mail`} name={'email'} as={TextInput} />
                    <Field label={`Telefon`} name={'phone'} as={TextInput} />
                  </FieldGroup>
                  <FieldGroup>
                    <Field
                      label={`IČO`}
                      required={false}
                      name={'ico'}
                      as={TextInput}
                    />
                    <Field
                      label={`DIČ`}
                      required={false}
                      name={'dic'}
                      as={TextInput}
                    />
                  </FieldGroup>
                  <FieldGroup>
                    <Field
                      label={`Poznámka`}
                      name={`note`}
                      multiline={true}
                      as={TextInput}
                    />
                  </FieldGroup>
                  <Button type={`submit`} className={`btn--primary`}>
                    {isSubmitting ? `Odesílání` : `Odeslat`}
                  </Button>
                </Form>
              )}
            </Formik>
          ) : (
            <p>
              V košíku nejsou žádné položky.{' '}
              <Link target={`_self`} url={`/products`}>
                Přejít na produkty
              </Link>
            </p>
          )}
        </div>
      </div>
    </View>
  );
};

export default Demand;
