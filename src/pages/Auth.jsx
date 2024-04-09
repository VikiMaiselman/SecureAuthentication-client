import React from "react";
import { useNavigate } from "react-router-dom";
import { Box, Typography, Tabs } from "@mui/material";

import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/bootstrap.css";

import { composeDataForBackend } from "../util/helpers.js";
import emailValidationSchema from "../util/emailValidation.js";
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
import { useAuth } from "../contexts/Authentication.context.jsx";

const phoneRegExp =
  /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{3}\\)[ \\-]*)|(\\[0-9]{3})[ \\-]*)|[0-9]{3}?[ \\-]*[0-9]{3,5}?$/;

export default function Auth() {
  /* state and hooks */
  const [activeTab, setActiveTab] = React.useState(0);
  const [userData, setUserData] = React.useState({
    email: "",
    password: "",
    phone: "",
  });

  /* error state */
  const [isTwilioError, setIsTwilioError] = React.useState(false);
  const [emailError, setEmailError] = React.useState("");
  const [phoneError, setPhoneError] = React.useState("");
  const navigate = useNavigate();

  /* context */
  const { checkStatus, isBeingVerified, isApproved, signup } = useAuth();

  const handleChangeTab = (e, newValue) => {
    setActiveTab(() => newValue);
    checkStatus();
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

    const updaterFunc = (prevSt) => {
      return { ...prevSt, [name]: value };
    };
    setUserData(updaterFunc);
  };

  const handleEmailBlur = () => {
    const email = userData.email;
    emailValidationSchema.validate({ email }).catch((error) => setEmailError(error.message));
  };
  const checkPhoneValid = (value, country) => {
    if (value.length <= 3) {
      setPhoneError("");
      return true; // only dial code
    } else if (!value.match(phoneRegExp) || value.length !== 12) {
      setPhoneError("Invalid phone number");
      return false;
    } else {
      setPhoneError("");
      return true;
    }
  };

  const handleClick = async () => {
    const data = composeDataForBackend(userData, activeTab);
    const response = await signup(data);

    if (response === "pending") {
      isBeingVerified(response);
      return navigate("/verification", { state: data, replace: true });
    }

    // if twilio didn't work
    if (response === "isTwilioError") {
      setIsTwilioError(() => true);
    }
    // other error
    return navigate("/sign-up");
  };

  const handleClickNoTwilio = async () => {
    const data = composeDataForBackend(userData, activeTab, false);
    const response = await signup(data);

    if (response === "approved") {
      isApproved(response);
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
              isValid={checkPhoneValid}
              defaultErrorMessage={phoneError}
            />
          </>
        )}

        <StyledButton variant="contained" onClick={handleClick}>
          {activeTab === 0 ? "Sign Up" : "Sign In"}
        </StyledButton>
        {/* <PaleStyledButton variant="contained" size="small" onClick={handleClickNoTwilio} disabled={!isTwilioError}> */}
        <PaleStyledButton variant="contained" size="small" onClick={handleClickNoTwilio}>
          {activeTab === 0 ? "Sign Up (no Twilio)" : "Sign In (no Twilio)"}
        </PaleStyledButton>
      </AuthForm>
    </AuthPageContainer>
  );
}
