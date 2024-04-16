import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import CircularProgress from "@mui/material/CircularProgress";
import Layout from "../layouts/Layout";
import LayoutMain from "../layouts/LayoutMain";
import Transactions from "../pages/Transactions";
import Auth from "../pages/Auth";
import Verification from "../pages/Verification";
import Logout from "../pages/Logout";
import TransactionForm from "../pages/TransactionForm";

import { useAuth } from "../contexts/Authentication.context";
import { Typography, Box } from "@mui/material";

export default React.memo(function AppRoutes() {
  const user = useSelector((state) => state.user);

  return user.isAuthenticated === null ? (
    <Box height={"100vh"} display="flex" alignItems="center" justifyContent="center" gap={4}>
      <Typography variant="h4">Loading</Typography>
      <CircularProgress />
    </Box>
  ) : (
    <Routes>
      <Route path="/" index element={<LayoutMain />} />
      <Route
        path="/dashboard"
        index
        element={
          user.isAuthenticated ? (
            <LayoutMain>
              <Transactions />
            </LayoutMain>
          ) : (
            <Navigate to="/" />
          )
        }
      />
      <Route
        path="/create-transaction"
        index
        element={
          user.isAuthenticated ? (
            <LayoutMain>
              <TransactionForm />
            </LayoutMain>
          ) : (
            <Navigate to="/" />
          )
        }
      />
      <Route
        path="/sign-up"
        element={
          <Layout>
            <Auth />
          </Layout>
        }
      />
      <Route
        path="/verification"
        element={
          user.isBeingVerified ? (
            <Layout>
              <Verification />
            </Layout>
          ) : (
            <Navigate to="/" />
          )
        }
      />
      <Route
        path="/logout"
        element={
          <Layout>
            <Logout />
          </Layout>
        }
      />
      <Route path="*" element={<Navigate to="/sign-up" />} />
    </Routes>
  );
});
