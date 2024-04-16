import React from "react";
import { useDispatch, useSelector } from "react-redux";

import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined.js";
import SidebarMain from "../components/SidebarMain.jsx";

import { checkAuthStatus } from "../util/helpers.js";
import { DRAWER_WIDTH } from "../util/config.js";
import { LinkToLogout, StyledContainer, StyledSubheader, StyledUserData } from "./LayoutMainStyles.js";

export default function LayoutMain({ children }) {
  const user = useSelector((state) => state.user);
  const balance = useSelector((state) => state.balance);
  const dispatch = useDispatch();

  React.useEffect(() => {
    const updUserStatus = async () => {
      try {
        const result = await checkAuthStatus();
        dispatch({
          type: "SET_USER",
          payload: {
            username: result.user ? result.user.username : "",
            isAuthenticated: result.isAuthenticated,
            id: result.user ? result.user._id : "",
          },
        });
        dispatch({
          type: "SET_BALANCE",
          payload: result.user ? result.user.balance : "",
        });
      } catch (error) {
        console.error(error);
      }
    };
    updUserStatus();
  }, []);

  return (
    <>
      <SidebarMain user={user} balance={balance} />

      <StyledContainer marginLeft={`${DRAWER_WIDTH}px`}>
        {user.isAuthenticated && (
          <StyledUserData>
            <StyledSubheader variant="body1">Hello, {user.username}</StyledSubheader>
            <LinkToLogout to="/logout">
              <AccountCircleOutlinedIcon />
              Log Out
            </LinkToLogout>
          </StyledUserData>
        )}
        {children}
      </StyledContainer>
    </>
  );
}
