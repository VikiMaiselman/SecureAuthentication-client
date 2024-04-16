import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Box, List, ListItemButton, ListItemIcon } from "@mui/material";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";

import { getDateLabel, getTransactions, getUserBalance } from "../util/helpers";
import {
  StyledListItem,
  StyledListItemText,
  StyledSpan,
  StyledSubheader,
  StyledTransaction,
} from "./TransactionsStyles";

export default function Transactions() {
  const dispatch = useDispatch();

  React.useEffect(() => {
    const getTxsToDisplay = async () => {
      try {
        const balance = await getUserBalance();
        const txs = await getTransactions();

        dispatch({
          type: "SET_BALANCE",
          payload: balance,
        });

        dispatch({
          type: "SET_TXS",
          payload: txs,
        });
      } catch (error) {
        console.error(error);
      }
    };
    getTxsToDisplay();
  }, []);

  const user = useSelector((state) => state.user);
  const txs = useSelector((state) => state.txs);

  return (
    <Box minWidth={"100%"} height={"95vh"} my={4}>
      <StyledSubheader variant="h6">
        Recent Transactions From: <StyledSpan>Today</StyledSpan>
      </StyledSubheader>
      <List style={{ height: "90vh", overflow: "scroll" }}>
        {React.Children.toArray(
          txs?.map((tx) => {
            const amountTodisplay = tx.to._id === user.id ? `+${tx.amount}` : `-${tx.amount}`;
            const colorOfMoney = tx.to._id === user.id ? "green" : "red";
            const dateLabel = getDateLabel(new Date(tx.when));
            const toOrFromWhom = tx.to._id === user.id ? `From ${tx.from.username}` : `To ${tx.to.username}`;

            return (
              <StyledListItem>
                <ListItemButton>
                  <ListItemIcon>
                    <ReceiptLongIcon />
                  </ListItemIcon>
                  <StyledTransaction>
                    <StyledListItemText primary={tx.name} />
                    <StyledListItemText sx={{ color: colorOfMoney }} primary={`${amountTodisplay} $`} />
                    <StyledListItemText primary={toOrFromWhom} />
                    <StyledListItemText primary={dateLabel} />
                  </StyledTransaction>
                </ListItemButton>
              </StyledListItem>
            );
          })
        )}
      </List>
    </Box>
  );
}
