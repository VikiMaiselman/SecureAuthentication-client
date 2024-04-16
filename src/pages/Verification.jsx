import React from "react";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";

import { CardActions, CardContent, Typography } from "@mui/material";

import { DigitSlot, StyledButton, StyledCard, StyledHeader, VerificationBackground } from "./VerificationStyles";
import { verifyUser } from "../util/helpers";

export default function Verification() {
  /* state, hooks */
  const [otpDigits, setOtpDigits] = React.useState(Array.from({ length: 6 }, () => ""));
  const inputRefs = React.useRef([]);

  /* location & navigation */
  const location = useLocation();
  const navigate = useNavigate();

  /* global-context */
  // const { isApproved, verify } = useAuth();
  const dispatch = useDispatch();

  /* event handlers */
  const handleChange = (idx, value) => {
    const updatedDigits = [...otpDigits];
    updatedDigits[idx] = value;
    setOtpDigits(updatedDigits);

    // Moves cursor to the next input (if not at the last slot)
    if (idx < 5 && value.length === 1) {
      inputRefs.current[idx + 1].focus();
    }
  };

  const handleMoveCursorOnBackspacePress = (key, idx, value) => {
    if (key === "Backspace" && idx > 0 && value.length === 0) {
      inputRefs.current[idx - 1].focus();
    }
  };

  const handleClickVerify = async (e) => {
    const data = location.state;
    const updatedData = { ...data, otp: otpDigits.join("") };
    const response = await verifyUser(updatedData);

    if (response === "approved") {
      dispatch({
        type: "SET_USER",
        payload: {
          isAuthenticated: true,
          isBeingVerified: false,
        },
      });
      return navigate("/");
    }
    // error case
    return navigate("/sign-up");
  };

  return (
    <>
      <VerificationBackground />
      <StyledCard>
        <CardContent>
          <StyledHeader variant="h5" gutterBottom>
            Two-Factor Authentication
          </StyledHeader>

          <Typography sx={{ mb: 1.5 }} color="text.secondary">
            Enter Two-factor <br /> Authentication Password
          </Typography>

          {React.Children.toArray(
            otpDigits.map((_, idx) => {
              return (
                <DigitSlot
                  inputRef={(ref) => (inputRefs.current[idx] = ref)}
                  onChange={(e) => handleChange(idx, e.target.value)}
                  onKeyDown={(e) => handleMoveCursorOnBackspacePress(e.key, idx, e.target.value)}
                  inputProps={{ maxLength: 1 }}
                />
              );
            })
          )}
        </CardContent>
        <CardActions>
          <StyledButton variant="contained" onClick={handleClickVerify}>
            Verify
          </StyledButton>
        </CardActions>
      </StyledCard>
    </>
  );
}
