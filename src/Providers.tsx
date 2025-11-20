"use client";

import type { PropsWithChildren } from "react";
import { ThemeProvider, CssBaseline } from "@mui/material";
import { theme } from "./config/theme";

import StoreProvider from "./lib/redux/StoreProvider";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

/**
 * Global component to wrap the entire application with necessary providers:
 * - StoreProvider: Next.js App Router compatible Redux setup
 * - MUI ThemeProvider
 * - ToastContainer: Enables global notifications
 */
const Providers = ({ children }: PropsWithChildren) => {
  return (
    <StoreProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />

        {children}

        <ToastContainer
          position="bottom-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored"
          style={{ fontSize: "1.6rem" }}
        />
      </ThemeProvider>
    </StoreProvider>
  );
};

export default Providers;
