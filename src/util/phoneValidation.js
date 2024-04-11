export const isPhoneValid = (value, setPhoneError) => {
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

export const phoneRegExp =
  /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{3}\\)[ \\-]*)|(\\[0-9]{3})[ \\-]*)|[0-9]{3}?[ \\-]*[0-9]{3,5}?$/;
