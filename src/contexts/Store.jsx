import { configureStore } from "@reduxjs/toolkit";
import { Provider } from "react-redux";
import React from "react";

const initialState = {
  user: {
    username: "",
    isAuthenticated: null,
    isBeingVerified: "",
    id: ",",
  },
  balance: null,
  txs: null,
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case "SET_USER":
      return { ...state, user: action.payload };
    case "SET_BALANCE":
      return { ...state, balance: action.payload };
    case "SET_TXS":
      return { ...state, txs: action.payload };
    default:
      return state;
  }
};

const store = configureStore({ reducer: reducer });

export default function AuthProvider({ children }) {
  // ... rest of your code here, replacing React.useState and React.useEffect with Redux actions and middleware
  return <Provider store={store}>{children}</Provider>;
}
