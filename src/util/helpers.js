import axios from "axios";

import { URL, HEADERS } from "./config.js";
import Swal from "sweetalert2";
import { darkBlue, middleBlue } from "../global-styles/Colors.js";

export function composeDataForBackend(userData, activeTab, useTwilio = true) {
  return {
    ...userData,
    username: userData.email,
    phone: `+${userData.phone}`,
    action: `${activeTab === 0 ? "signup" : "login"}`,
    useTwilio: useTwilio,
  };
}

export function getDateLabel(transactionDate) {
  const calcDaysPassed = (date1, date2) => Math.trunc(Math.abs(date2 - date1) / (24 * 3600 * 1000));
  const daysPassed = calcDaysPassed(new Date(), transactionDate);

  if (daysPassed === 0) return "Today";
  if (daysPassed === 1) return "Yesterday";
  if (daysPassed <= 7) return `${daysPassed} days ago`;
  return `${daysPassed.getDate()}`.padStart(2, 0);
}

export async function signUp(data) {
  try {
    const result = await axios.post(`${URL}/sign-up`, data, { withCredentials: true }, HEADERS);
    console.log(result);
    return result.data;
  } catch (error) {
    console.error(error);
    let cancelText = "Try again.";
    if (error.response?.data?.message?.startsWith?.("TWILIO:") || error.response?.data?.startsWith?.("TWILIO:")) {
      cancelText = "Authenticate w/o OTP (this will still be safe)";
    }
    Swal.fire({
      title: "Ooops...",
      text: error.response.data.message || error.response.data,
      icon: "error",
      confirmButtonText: cancelText,
      confirmButtonColor: middleBlue,
      color: darkBlue,
      iconColor: "red",
    }).then(() => {
      isTwilioError = true;
    });
    return "isTwilioError";
  }
}

export async function verifyUser(fullData) {
  try {
    const result = await axios.post(`${URL}/verification`, fullData, { withCredentials: true }, HEADERS);
    return result.data;
  } catch (error) {
    console.error(error);
    Swal.fire({
      title: "Ooops...",
      text: error.response.data,
      icon: "error",
      confirmButtonText: "Please, try again.",
      confirmButtonColor: middleBlue,
      color: darkBlue,
      iconColor: "red",
    });
  }
}

export async function logout() {
  try {
    await axios.get(`${URL}/logout`, { withCredentials: true }, HEADERS);
  } catch (error) {
    console.error(error);
    Swal.fire({
      title: "Ooops...",
      text: "We could not log you out.",
      icon: "error",
      confirmButtonText: "Please, return to home page and try again.",
      confirmButtonColor: middleBlue,
      color: darkBlue,
      iconColor: "red",
    });
  }
}

export async function checkAuthStatus() {
  try {
    const result = await axios.get(`${URL}/auth-status`, { withCredentials: true }, HEADERS);
    return result.data;
  } catch (error) {
    console.error(error);
    // createErrorAlert("We could not check your authentication status.");
    Swal.fire({
      title: "Ooops...",
      text: "We could not check your authentication status.",
      icon: "error",
      confirmButtonText: "Please, try again.",
      confirmButtonColor: middleBlue,
      color: darkBlue,
      iconColor: "red",
    });
  }
}

export async function getTransactions() {
  try {
    const result = await axios.get(`${URL}/transactions`, { withCredentials: true }, HEADERS);
    return result.data;
  } catch (error) {
    console.error(error);
    Swal.fire({
      title: "Ooops...",
      text: error.response.data,
      icon: "error",
      confirmButtonText: "Please, try again.",
      confirmButtonColor: middleBlue,
      color: darkBlue,
      iconColor: "red",
    });
  }
}

export async function createTransaction(txData) {
  try {
    const result = await axios.post(`${URL}/transactions`, txData, { withCredentials: true }, HEADERS);
    Swal.fire({
      title: "Success!",
      text: result.data,
      icon: "success",
      confirmButtonText: "Okay",
      confirmButtonColor: middleBlue,
      color: darkBlue,
    });
    return result.data;
  } catch (error) {
    console.error(error);
    Swal.fire({
      title: "Ooops...",
      text: error.response.data,
      icon: "error",
      confirmButtonText: "Please, try again.",
      confirmButtonColor: middleBlue,
      color: darkBlue,
      iconColor: "red",
    });
  }
}

export async function getUserBalance() {
  try {
    const result = await axios.get(`${URL}/balance`, { withCredentials: true }, HEADERS);
    return result.data.balance;
  } catch (error) {
    console.error(error);
    Swal.fire({
      title: "Ooops...",
      text: error.response.data,
      icon: "error",
      confirmButtonText: "Please, try again.",
      confirmButtonColor: middleBlue,
      color: darkBlue,
      iconColor: "red",
    });
  }
}

const createErrorAlert = (text) => {
  return Swal.fire({
    title: "Ooops...",
    text: text,
    icon: "error",
    confirmButtonText: "Please, try again.",
    confirmButtonColor: middleBlue,
    color: darkBlue,
    iconColor: "red",
  });
};
