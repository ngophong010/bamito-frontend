"use client";
import {
  PayPalScriptProvider,
  PayPalButtons,
  usePayPalScriptReducer,
  ReactPayPalScriptOptions,
} from "@paypal/react-paypal-js";
import { toast } from 'react-toastify';
import { FC, useEffect } from "react";
// --- 1. Define Typed Props ---
// Props for the main Paypal component
interface PaypalButtonProps {
  amount: string; // The PayPal API expects the amount as a string
  currency: string; // e.g., "USD"
  onPaymentSuccess: (details: any) => void; // A callback for successful payment
  onPaymentError?: (error: any) => void; // Optional callback for errors
}
// Props for the internal ButtonWrapper
interface ButtonWrapperProps extends Omit<PaypalButtonProps, 'onPaymentError'> {
  showSpinner: boolean;
}
// --- 2. Create the Typed Button Wrapper ---
const ButtonWrapper: FC<ButtonWrapperProps> = ({ currency, showSpinner, amount, onPaymentSuccess }) => {
  const [{ isPending, options }, dispatch] = usePayPalScriptReducer();
  // This effect ensures that if the currency prop changes dynamically,
  // the PayPal SDK is updated.
  useEffect(() => {
    dispatch({
      type: "resetOptions",
      value: {
        ...options,
        currency: currency,
      },
    });
  }, [currency, dispatch, options]);
  // This function is called when the user clicks the PayPal button
  const createOrder = (data: Record<string, unknown>, actions: any) => {
    return actions.order.create({
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
  // This function is called after the user approves the payment on the PayPal site
  const onApprove = (data: OnApproveData, actions: OnApproveActions) => {
    // 3. Add robust error handling
    return actions.order!.capture().then((details) => {
      // This is where you call the function passed from your Cart page
      onPaymentSuccess(details);
    }).catch(err => {
      console.error("PayPal capture error:", err);
      toast.error("An error occurred while processing your PayPal payment.");
    });
  };
  return (
    <>
      {showSpinner && isPending && <div className="spinner" />}
      <PayPalButtons
        style={{ layout: "vertical" }}
        disabled={false}
        // forceReRender is used to update the button if props like amount change
        forceReRender={[amount, currency]}
        fundingSource={undefined}
        createOrder={createOrder}
        onApprove={onApprove}
        onError={(err) => {
          console.error("PayPal Button Error:", err);
          toast.error("Unable to load PayPal buttons. Please try again.");
        }}
      />
    </>
  );
};
// --- 3. The Main Exported Component ---
const Paypal: FC<PaypalButtonProps> = ({ amount, currency, onPaymentSuccess, onPaymentError }) => {
  const initialOptions: ReactPayPalScriptOptions = {
    clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || "test", // Use "test" as a fallback
    components: "buttons",
    currency: currency,
    intent: "capture", // Standard for immediate payment
  };
  return (
    // 4. Removed the unnecessary div wrapper. The parent can add one if needed.
    <div className="paypal-button-container">
      <PayPalScriptProvider options={initialOptions}>
        <ButtonWrapper
          showSpinner={false}
          amount={amount}
          currency={currency}
          onPaymentSuccess={onPaymentSuccess}
        />
      </PayPalScriptProvider>
    </div>
  );
};
export default Paypal;
