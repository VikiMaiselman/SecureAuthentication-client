import React from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { Typography } from "@mui/material";

import { createTransaction, getTransactions } from "../util/helpers.js";

import { StyledButton, StyledContainer, StyledTextField } from "./TransactionFormStyled";

export default function TransactionForm() {
  /* state */
  const [tx, setTx] = React.useState({
    name: "",
    amount: "",
    to: "",
  });
  const [errAmount, setErrAmount] = React.useState("");
  const [errReceiver, setErrReceiver] = React.useState("");

  /* global state */
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const balance = useSelector((state) => state.balance);

  /* navigation */
  const navigate = useNavigate();


  const validate = (inputName, inputValue) => {
    if (inputName === "amount") {
      if (isNaN(inputValue)) {
        setErrAmount(() => "Please, enter a valid number");
        return false;
      }
      if (balance < inputValue) {
        setErrAmount(() => "You do not have enough money to proceed with the transaction");
      } else setErrAmount(() => "");
    }

    if (inputName === "to") {
      if (user.username === inputValue) {
        setErrReceiver(() => "The emails of the sender and the reciever must be different");
      } else setErrReceiver(() => "");
    }

    return true;
  };

  const handleChange = (e) => {
    let { name, value } = e.target;

    const isValid = validate(name, value);
    if (!isValid) return;
    if (name === "amount") value = +value;
    setTx((prevSt) => {
      return { ...prevSt, [name]: value };
    });
  };

  const handleTransfer = async () => {
    await createTransaction(tx);
    const transactions = await getTransactions();
    dispatch({
      type: "SET_TXS",
      payload: transactions,
    });
    setTx(() => ({
      name: "",
      amount: "",
      to: "",
    }));

    navigate("/dashboard");
  };

  return (
    <StyledContainer>
      <Typography variant="h6" sx={{ marginBottom: "1em" }}>
        Create New Transaction:
      </Typography>
      <StyledTextField
        id="name"
        name="name"
        placeholder="Enter transaction name/purpose..."
        value={tx.name}
        onChange={handleChange}
      />
      <StyledTextField
        id="amount"
        name="amount"
        placeholder="Enter amount..."
        value={tx.amount}
        onChange={handleChange}
        error={errAmount !== ""}
        helperText={errAmount}
      />
      <StyledTextField
        id="to"
        name="to"
        value={tx.to}
        onChange={handleChange}
        error={errReceiver !== ""}
        helperText={errReceiver}
        placeholder="Enter the email of the recepient"
      />
      <StyledButton onClick={handleTransfer} disabled={errAmount || errReceiver || !tx.name || !tx.amount || !tx.to}>
        Transfer Money
      </StyledButton>
    </StyledContainer>
  );
}
