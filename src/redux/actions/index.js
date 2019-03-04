import * as types from './type';

export const addCart = (brandTitle, productImage, productTitle, productId, groupTitle, groupId, daysTitle, groupPrice, tariffId, count, lockProducts, minOrderd, maxOrdered) => ({
  type: types.ADD_CART,
  brandTitle,
  productImage,
  productTitle,
  productId,
  groupTitle,
  groupId,
  daysTitle,
  groupPrice,
  tariffId,
  count,
  lockProducts,
  minOrderd,
  maxOrdered,
});

export const removeCart = (productId, groupId, tariffId, count) => ({
  type: types.REMOVE_CART,
  productId,
  groupId,
  tariffId,
  count,
});

export const removeHoleCart = () => ({
  type: types.REMOVE_HOLE_CART,
});
