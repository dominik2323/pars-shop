import React from 'react';

import View from '../components/View';
import TextInput, { Props as TextInputProps } from '../components/TextInput';
import Checkbox, { Props as CheckboxProps } from '../components/Checkbox';
import Form from '../components/Form';
import FormGroup from '../components/FormGroup';
import Link from '../components/Link';
import Button from '../components/Button';
import Cart from '../components/Cart';

interface Props {}

const formConfig = [
  {
    component: 'TextInput',
    className: '',
    id: 'name',
    name: 'name',
    label: 'Jméno',
    badgeMessage: '',
    isOptional: false,
    validate: value => !/^[a-z ,.'-]+$/i.test(value),
  },
  {
    component: 'TextInput',
    className: '',
    id: 'companyName',
    name: 'companyName',
    label: 'Firma',
    badgeMessage: '',
    isOptional: false,
    validate: value => !/^[a-z0-9 ,.-]+$/i.test(value),
  },
  {
    component: 'TextInput',
    className: 'half',
    id: 'phone',
    name: 'phone',
    label: 'Telefon',
    badgeMessage: '',
    isOptional: false,
    validate: value => !/^[0-9 ]/i.test(value),
  },
  {
    component: 'TextInput',
    className: 'half half--no-left-border',
    id: 'email',
    name: 'email',
    label: 'E-mail',
    badgeMessage: '',
    isOptional: false,
    validate: value =>
      !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(value),
  },
  {
    component: 'TextInput',
    className: 'half',
    id: 'ico',
    name: 'ico',
    label: 'IČO',
    badgeMessage: '',
    isOptional: true,
    validate: value => !/^[0-9]/i.test(value),
  },
  {
    component: 'TextInput',
    className: 'half half--no-left-border',
    id: 'dic',
    name: 'dic',
    label: 'DIČ',
    badgeMessage: 'Lorem ipsum',
    isOptional: true,
    validate: value => !/^[0-9]/i.test(value),
  },
  {
    component: 'TextInput',
    className: '',
    id: 'note',
    name: 'note',
    label: 'Poznámka',
    badgeMessage: '',
    multiline: true,
    isOptional: true,
    validate: () => false,
  },
  {
    component: 'Checkbox',
    id: 'terms',
    name: 'terms',
    isRequired: true,
    label: (
      <span>
        Souhlasím se zpracováním <Link url=''>osobních údajů</Link> a{' '}
        <Link url=''>obchodními podmínkami</Link>.
      </span>
    ),
  },
];

const Demand: React.FC<Props> = () => {
  const renderForm = formItem => {
    if (formItem.component === 'TextInput') {
      return (
        <div key={formItem.id} className={`form-item ${formItem.className}`}>
          <TextInput
            id={formItem.id}
            name={formItem.name}
            label={formItem.label}
            badgeMessage={formItem.badgeMessage}
            isOptional={formItem.isOptional}
            validate={formItem.validate}
            multiline={formItem.multiline}
          />
        </div>
      );
    } else if (formItem.component === 'Checkbox') {
      return (
        <div key={formItem.id} className='form-item'>
          <Checkbox
            id={formItem.id}
            label={formItem.label}
            name={formItem.name}
            isRequired={formItem.isRequired}
          />
        </div>
      );
    }
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
          <div className={`demand-container__content__cart`}></div>
          <div className={`demand-container__content__personal-info`}>
            <Form className={``}>
              <FormGroup header={`Produkty`}>
                <Cart />
              </FormGroup>
              <FormGroup header={`Osobní údaje`}>
                {formConfig.map(formItem => renderForm(formItem))}
              </FormGroup>
              <Button type={`submit`} className={`btn--primary`}>
                odeslat poptávku
              </Button>
            </Form>
          </div>
        </div>
      </div>
    </View>
  );
};

export default Demand;
