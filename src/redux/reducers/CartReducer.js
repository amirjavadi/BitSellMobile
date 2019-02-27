import {ADD_CART, REMOVE_CART, REMOVE_HOLE_CART} from '../actions/type';

const initialState = [];

export default function(state = initialState, action = {}) {

  let {brandTitle, productImage, productTitle, productId, groupTitle, groupId, daysTitle, groupPrice, tariffId, count, lockProducts} = action;
  switch (action.type) {
    case ADD_CART:
      let newState = [];

       let index = state.findIndex((item) => (
          item.productId === productId && item.groupId === groupId && item.tariffId === tariffId
        ));
       if (index < 0) {
         newState = [...state, {brandTitle: brandTitle, productImage: productImage, productTitle: productTitle, productId: productId, groupTitle: groupTitle, groupId: groupId, daysTitle: daysTitle, groupPrice: groupPrice, tariffId: tariffId, count: parseInt(count), lockProducts}];
       } else {
         newState = state;
       }
      return newState;
    case REMOVE_CART:
      let newState1 = state.filter((item, index) => item.productId !== productId || item.groupId !== groupId || item.tariffId !== tariffId || item.count !== count);
      return newState1;
    case REMOVE_HOLE_CART:
      let newState2 = [];
      return newState2;
    default:
      return state;
  }
}
