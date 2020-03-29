import React, { ReactElement } from 'react';
import { useCookies } from 'react-cookie';

import CartItem from './CartItem';
import { DataProvider } from '../hocs/dataContext';

interface Props {}

function cart({}: Props): ReactElement {
  const [varioIds, setVarioIds] = React.useState([]);
  const { shopItems, shopItemsVariants } = React.useContext(DataProvider);
  const [cookies, setCookies, removeCookies] = useCookies();

  React.useEffect(() => {
    setVarioIds(cookies.parsCart || []);
  }, [cookies.parsCart]);

  const removeItem = varioId => {
    setCookies(
      'parsCart',
      cookies.parsCart.filter(x => x !== varioId)
    );
    // @ts-ignore
    window.updateDemandBadge();
  };

  return (
    <div className={`cart`}>
      {varioIds.length !== 0 ? (
        varioIds.map((varioId, i) => {
          const { dimensions, shopItemId } = shopItemsVariants.find(
            variant => variant.varioId === varioId
          );
          const { name } = shopItems.find(
            shopItem => shopItem.shopItemId === shopItemId
          );
          return (
            <CartItem
              header={name}
              key={varioId}
              index={i}
              shopItemId={varioId}
              perex={dimensions}
              removeItem={shopItemId => removeItem(shopItemId)}
              textInputs={[
                {
                  id: 'dimensions',
                  label: 'Rozměr [mm]',
                  name: 'dimensions',
                  badgeMessage: 'Lorem ipsum dolor sit amet',
                  intialValue: 3,
                  validate: value => !/^[0-9]/i.test(value),
                },
                {
                  id: 'itemNo',
                  label: 'Počet kusů',
                  name: 'itemNo',
                  intialValue: 1,
                  validate: value => !/^[0-9]/i.test(value),
                },
              ]}
            />
          );
        })
      ) : (
        <p>V košíku nejsou žádné položky.</p>
      )}
    </div>
  );
}

export default cart;
