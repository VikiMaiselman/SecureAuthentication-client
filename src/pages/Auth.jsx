import React from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Box, Typography, Tabs } from "@mui/material";

import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/bootstrap.css";

import { composeDataForBackend, signUp } from "../util/helpers.js";
import emailValidationSchema from "../util/emailValidation.js";
import { isPhoneValid } from "../util/phoneValidation.js";

import {
  AuthBackground,
  AuthForm,
  AuthPageContainer,
  Overlay,
  PageHeaderText,
  PaleStyledButton,
  StyledButton,
  StyledFormLabel,
  StyledTab,
  StyledTextField,
} from "./AuthStyles.js";

export default function Auth() {
  /* state and hooks */
  const [activeTab, setActiveTab] = React.useState(0);
  const [userData, setUserData] = React.useState({
    email: "",
    password: "",
    phone: "",
  });

  const user = useSelector((state) => state.user);
  const balance = useSelector((state) => state.balance);
  const dispatch = useDispatch();

  /* error state */
  const [isTwilioError, setIsTwilioError] = React.useState(false);
  const [emailError, setEmailError] = React.useState("");
  const [phoneError, setPhoneError] = React.useState("");
  const navigate = useNavigate();

  /* computed values */
  const shouldDisableButton =
    !userData.email ||
    (activeTab === 0 && !userData.phone) ||
    !userData.password ||
    Boolean(emailError) ||
    Boolean(phoneError);

  /* event handlers for onChange */
  const handleChangeTab = (e, newValue) => {
    setActiveTab(() => newValue);
  };

  const handleChangeUserData = (e) => {
    let name, value;
    setEmailError("");
    setPhoneError("");

    if (typeof e === "object") {
      name = e.target.name;
      value = e.target.value;
    }
    if (typeof e === "string") {
      name = "phone";
      value = e;
    }

    setUserData((prevSt) => {
      return { ...prevSt, [name]: value };
    });
  };

  /* event handlers for validation */
  const handleEmailBlur = () => {
    const email = userData.email;
    emailValidationSchema.validate({ email }).catch((error) => setEmailError(error.message));
  };

  /* event handlers for onClick */
  const handleClick = async () => {
    const data = composeDataForBackend(userData, activeTab);
    const response = await signUp(data);

    if (response === "pending") {
      dispatch({
        type: "SET_USER",
        payload: {
          isBeingVerified: true,
        },
      });
      return navigate("/verification", { state: data, replace: true });
    }
    if (response === "isTwilioError") setIsTwilioError(true);

    // other error
    return navigate("/sign-up");
  };

  const handleClickNoTwilio = async () => {
    const data = composeDataForBackend(userData, activeTab, false);
    const response = await signUp(data);

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
    return navigate("/sign-up");
  };

  return (
    <AuthPageContainer>
      <Overlay />
      <AuthBackground src="images/bg-family-saving-money.png" />

      <div style={{ display: "flex", flexDirection: "column", justifyContent: "flex-start", alignItems: "start" }}>
        <PageHeaderText variant="h3">Experience the</PageHeaderText>
        <PageHeaderText variant="h3">Future of Banking</PageHeaderText>
      </div>

      <AuthForm>
        <Typography variant="h3" sx={{ color: "#1A3496", alignSelf: "center" }}>
          Let's Get Started
        </Typography>

        <Box sx={{ borderBottom: 1, borderColor: "divider", alignSelf: "center" }}>
          <Tabs value={activeTab} onChange={handleChangeTab}>
            <StyledTab id="signup" label="Sign Up" />
            <StyledTab id="signin" label="Sign In" />
          </Tabs>
        </Box>

        <StyledFormLabel htmlFor="email">Email</StyledFormLabel>
        <StyledTextField
          id="email"
          onChange={handleChangeUserData}
          name="email"
          value={userData.email}
          onBlur={handleEmailBlur}
          error={Boolean(emailError)}
          helperText={emailError}
        />

        <StyledFormLabel htmlFor="password">Password</StyledFormLabel>
        <StyledTextField
          id="password"
          type="password"
          sx={{ marginBottom: `${activeTab === 0 ? "1em" : "2em"}` }}
          onChange={handleChangeUserData}
          name="password"
          value={userData.password}
        />

        {!activeTab && (
          <>
            <StyledFormLabel htmlFor="phone">Phone Number</StyledFormLabel>
            <PhoneInput
              id="phone"
              country={"il"}
              inputStyle={{ width: "100%" }}
              style={{ marginBottom: "2em" }}
              onChange={handleChangeUserData}
              name="phone"
              value={userData.phone}
              isValid={(value) => isPhoneValid(value, setPhoneError)}
              defaultErrorMessage={phoneError}
            />
          </>
        )}

        <StyledButton variant="contained" onClick={handleClick} disabled={shouldDisableButton}>
          {activeTab === 0 ? "Sign Up" : "Sign In"}
        </StyledButton>
        {/* <PaleStyledButton variant="contained" size="small" onClick={handleClickNoTwilio} disabled={!isTwilioError}> */}
        <PaleStyledButton variant="contained" size="small" onClick={handleClickNoTwilio} disabled={shouldDisableButton}>
          {activeTab === 0 ? "Sign Up (no Twilio)" : "Sign In (no Twilio)"}
        </PaleStyledButton>
      </AuthForm>
    </AuthPageContainer>
  );
}
