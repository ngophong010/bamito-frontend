"use client";

import {
  PayPalScriptProvider,
  PayPalButtons,
  usePayPalScriptReducer,
  ReactPayPalScriptOptions,
  DISPATCH_ACTION,
} from "@paypal/react-paypal-js";
import type {
  CreateOrderData,
  CreateOrderActions,
  OnApproveData as PayPalOnApproveData,
  OnApproveActions as PayPalOnApproveActions,
  OrderResponseBody,
} from "@paypal/paypal-js";
import { toast } from 'react-toastify';
import { FC, useEffect } from "react";

// --- Props remain the same ---
interface PaypalButtonProps {
  amount: string;
  currency: string;
  onPaymentSuccess: (details: OrderResponseBody) => void; // Use the specific type for details
  onPaymentError?: (error: any) => void;
}

interface ButtonWrapperProps extends PaypalButtonProps {
  showSpinner: boolean;
}

// --- The Typed Button Wrapper with all fixes ---
const ButtonWrapper: FC<ButtonWrapperProps> = ({ currency, showSpinner, amount, onPaymentSuccess, onPaymentError }) => {
  const [{ isPending, options }, dispatch] = usePayPalScriptReducer();

  useEffect(() => {
    dispatch({
      // FIX 2: Use the DISPATCH_ACTION enum for the type property.
      // The library now uses an enum for type safety instead of raw strings.
      type: DISPATCH_ACTION.RESET_OPTIONS,
      value: {
        ...options,
        currency: currency,
      },
    });
  }, [currency, dispatch, options]);

  // FIX 3: Apply the correct types to the createOrder function parameters.
  const createOrder = (data: CreateOrderData, actions: CreateOrderActions) => {
    return actions.order.create({
      intent: "CAPTURE",
      purchase_units: [
        {
          amount: {
            currency_code: currency,
            value: amount,
          },
        },
      ],
    }).then((orderId: string) => {
      // Your code here after create the order
      return orderId;
    });
  };

  // FIX 4: Apply the correct types to the onApprove function parameters.
  const onApprove = (data: PayPalOnApproveData, actions: PayPalOnApproveActions) => {
    // Ensure the actions.order is not null before capturing
    if (!actions.order) {
        toast.error("An unexpected error occurred with the PayPal order.");
        return Promise.reject(new Error("PayPal actions.order is undefined."));
    }

    return actions.order.capture().then((details: OrderResponseBody) => {
      // The 'details' object is now strongly typed as OrderResponseBody
      onPaymentSuccess(details);
    }).catch((err: any) => {
      console.error("PayPal capture error:", err);
      toast.error("An error occurred while processing your PayPal payment.");
      // Propagate the error for optional parent handling
      throw err;
    });
  };

  return (
    <>
      {showSpinner && isPending && <div className="spinner" />}
      <PayPalButtons
        style={{ layout: "vertical" }}
        disabled={isPending} // Disable buttons while SDK is loading
        forceReRender={[amount, currency]}
        fundingSource={undefined}
        createOrder={createOrder}
        onApprove={onApprove}
        onError={(err: any) => {
          console.error("PayPal Button Error:", err);
          toast.error("Unable to process payment. Please try again later.");
          // Also call the optional error handler from the parent
          if (onPaymentError) {
            onPaymentError(err);
          }
        }}
      />
    </>
  );
};

// --- The Main Exported Component (Largely the same, but with updated types) ---
const Paypal: FC<PaypalButtonProps> = ({ amount, currency, onPaymentSuccess, onPaymentError }) => {
  const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;

  if (!clientId) {
    console.error("FATAL: PayPal Client ID is not configured in environment variables.");
    // In a real-world app, you might want to render a user-friendly error message here
    return <div className="paypal-error">Payment provider is not configured.</div>;
  }
  
  const initialOptions: ReactPayPalScriptOptions = {
    clientId: clientId,
    components: "buttons",
    currency: currency,
    intent: "capture",
  };

  return (
    <div className="paypal-button-container">
      <PayPalScriptProvider options={initialOptions}>
        <ButtonWrapper
          showSpinner={true}
          amount={amount}
          currency={currency}
          onPaymentSuccess={onPaymentSuccess}
          onPaymentError={onPaymentError}
        />
      </PayPalScriptProvider>
    </div>
  );
};

export default Paypal;
