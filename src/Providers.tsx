"use client";
import { Provider } from "react-redux";
import dynamic from "next/dynamic";
import { store, persistor } from "./redux-toolkit/store";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import type { PropsWithChildren } from "react"; // Import a helper type for children

// A simple loading component to show during rehydration
const ReduxLoading = () => {
    // You can style this to be a full-page spinner overlay
    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
            fontSize: '2rem',
            backgroundColor: '#111',
            color: 'white'
        }}>
            Loading...
        </div>
    );
};

// Use dynamic import with ssr: false for PersistGate as it depends on client-side localStorage.
const PersistGate = dynamic(
  () =>
    import("redux-persist/integration/react").then((mod) => mod.PersistGate),
  { 
    ssr: false,
    // Provide a loading component for a better user experience
    loading: () => <ReduxLoading />,
  }
);

/**
 * A central component to wrap the entire application with necessary providers:
 * - Redux Provider: Makes the Redux store available.
 * - PersistGate: Delays rendering until Redux state is rehydrated from storage.
 * - ToastContainer: Enables global notifications.
 */
const Providers = ({ children }: PropsWithChildren) => {
  return (
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        {/*
          The children (your actual application) will only render AFTER
          Redux state has been successfully loaded from localStorage.
        */}
        {children}
      </PersistGate>
      <ToastContainer
        position="bottom-right" // Often preferred over top-right
        autoClose={3000} // 3 seconds is a more standard duration
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored" // 'colored' uses toast.success/error colors
        style={{ fontSize: "1.6rem" }} // Use rem for accessibility
      />
    </Provider>
  );
};

export default Providers;
