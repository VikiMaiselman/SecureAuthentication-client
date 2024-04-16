import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { logout } from "../util/helpers";
import { useDispatch } from "react-redux";

export default function Logout() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const logOut = async () => {
      try {
        await logout();
        dispatch({
          type: "SET_USER",
          payload: { isAuthenticated: false },
        });
      } catch (error) {
        console.error(error);
      }
    };
    logOut();

    navigate("/sign-up", { replace: true });
  }, []);

  return <></>;
}
