"use client";
import StoreProvider from "./lib/redux/StoreProvider";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import type { PropsWithChildren } from "react";

/**
 * A central component to wrap the entire application with necessary providers:
 * - StoreProvider: Next.js App Router compatible Redux setup
 * - ToastContainer: Enables global notifications
 */
const Providers = ({ children }: PropsWithChildren) => {
  return (
    <StoreProvider>
      {children}
      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
        style={{ fontSize: "1.6rem" }}
      />
    </StoreProvider>
  );
};

export default Providers;
