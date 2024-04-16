import React from "react";
import "./App.css";
import AppRoutes from "./routes/AppRoutes";
import { checkAuthStatus } from "./util/helpers";
import { useDispatch } from "react-redux";

export default React.memo(function App() {
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
  return <AppRoutes />;
});
