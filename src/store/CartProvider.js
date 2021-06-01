//Cart provider is ultimately where we manage our cart data

import { useReducer } from "react";
import CartContext from "./cart-context";

const defaultCartState = {
  items: [],
  totalAmount: 0,
};

// useReducer always recieves a state & an action,
// the action is dispatched by you later in the code
// and returns a new state

const cartReducer = (state, action) => {
  // different behaviors depending on which type of function is dispatched

  if (action.type === "ADD") {
    // grab state.items (existing state array)
    // concat() returns a brand new array with the new item we are getting

    // const updatedItems = state.items.concat(action.item);

    // check if item is already part of the cart
    // findIndex() checks the index of the item in the array

    const existingCartItemIndex = state.items.findIndex(
      // does the item we are looking at have the same id
      // as the item we are receiving (if it exists)

      (item) => item.id === action.item.id
    );

    // if the item exists, existingCartItem is set to that item
    // if not, it will be set to 'null'

    const existingCartItem = state.items[existingCartItemIndex];

    // declare a new variable which will be set with our state array.

    let updatedItems;

    // if existingCartItem is truthy, create a new item copied from the existing item
    // with updated amount

    if (existingCartItem) {
      const updatedItem = {
        ...existingCartItem,
        amount: existingCartItem.amount + action.item.amount,
      };

      //set the variable to the existing array of items

      updatedItems = [...state.items];

      // overwrite the existingCartItemIndex with the updatedItem

      updatedItems[existingCartItemIndex] = updatedItem;
    }

    // if item is brand new, updatedItem is simply the action.item
    else {
      updatedItems = state.items.concat(action.item);
    }

    // updating price

    const updatedTotalAmount =
      state.totalAmount + action.item.price * action.item.amount;

    // return state where we set the values to the new variables we have created

    return {
      items: updatedItems,
      totalAmount: updatedTotalAmount,
    };
  }

  if (action.type === "REMOVE") {
    const existingCartItemIndex = state.items.findIndex(
      (item) => item.id === action.id
    );
    const existingItem = state.items[existingCartItemIndex];
    const updatedTotalAmount = state.totalAmount - existingItem.price;
    let updatedItems;
    if (existingItem.amount === 1) {
      //all items where ids do not match action id are kept in the array
      updatedItems = state.items.filter((item) => item.id !== action.id);
    } else {
        const updatedItem = {...existingItem, amount: existingItem.amount -1};
        updatedItems= [...state.items];
        updatedItems[existingCartItemIndex] = updatedItem;
    }
    return {
        items: updatedItems,
        totalAmount: updatedTotalAmount,
      };
  }

  return defaultCartState;
};

const CartProvider = (props) => {
  const [cartState, dispatchCartAction] = useReducer(
    cartReducer,
    defaultCartState
  );

  // these are the actions we dispatch
  const addItemToCartHandler = (item) => {
    dispatchCartAction({ type: "ADD", item: item });
  };

  const removeItemFromCartHandler = (id) => {
    dispatchCartAction({ type: "REMOVE", id: id });
  };

  const cartContext = {
    items: cartState.items,
    totalAmount: cartState.totalAmount,
    addItem: addItemToCartHandler,
    removeItem: removeItemFromCartHandler,
  };

  return (
    <CartContext.Provider value={cartContext}>
      {props.children}
    </CartContext.Provider>
  );
};

export default CartProvider;
