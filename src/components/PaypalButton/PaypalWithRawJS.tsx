"use client";
import { FC, useEffect, useRef, useState } from "react";
import { loadScript, PayPalNamespace } from "@paypal/paypal-js";
import { toast } from 'react-toastify';
import type { OnApproveData, OrderResponseBody } from "@paypal/paypal-js";

// The props remain the same, which is good for creating a drop-in replacement.
interface PaypalButtonProps {
  amount: string;
  currency: string;
  onPaymentSuccess: (details: OrderResponseBody) => void;
  onPaymentError?: (error: any) => void;
}

const PaypalWithRawJS: FC<PaypalButtonProps> = ({ amount, currency, onPaymentSuccess, onPaymentError }) => {
  // We need a ref to a DOM element where PayPal will render its buttons.
  const paypalContainerRef = useRef<HTMLDivElement>(null);
  
  // We need to manually manage the loading and error states.
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // This effect will run when the component mounts or when key props change.
    let paypal: PayPalNamespace | null = null;
    let buttons: any = null; // To hold the rendered button instance for cleanup

    const renderPaypalButtons = async () => {
      // Ensure we have a DOM element to render into.
      if (!paypalContainerRef.current) {
        setError("PayPal container element not found.");
        return;
      }
      
      // Clear any existing buttons from a previous render
      paypalContainerRef.current.innerHTML = "";

      try {
        // 1. Manually load the PayPal script.
        paypal = await loadScript({
          clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || "test",
          currency: currency,
          intent: "capture",
        });
        setIsLoading(false);

        // 2. Check if the script loaded and the 'Buttons' component is available.
        if (paypal?.Buttons) {
          buttons = paypal.Buttons({
            // 3. Define the createOrder and onApprove functions (same logic as before).
            createOrder: (data, actions) => {
              return actions.order.create({
                intent: "CAPTURE",
                purchase_units: [{ amount: { value: amount, currency_code: currency } }],
              });
            },
            onApprove: async (data: OnApproveData, actions: any) => {
              try {
                const details: OrderResponseBody = await actions.order.capture();
                onPaymentSuccess(details);
              } catch (err) {
                console.error("PayPal capture error:", err);
                toast.error("An error occurred while processing your payment.");
                if (onPaymentError) onPaymentError(err);
              }
            },
            onError: (err) => {
              console.error("PayPal Button Error:", err);
              toast.error("An error occurred with the PayPal buttons.");
              if (onPaymentError) onPaymentError(err);
              setError("PayPal Error.");
            },
          });

          // 4. Manually render the buttons into our ref'd div.
          await buttons.render(paypalContainerRef.current);
        } else {
            setError("PayPal SDK did not load correctly.");
        }
      } catch (err) {
        console.error("Failed to load PayPal script:", err);
        setError("Could not load payment provider.");
        setIsLoading(false);
      }
    };

    renderPaypalButtons();

    // 5. CRITICAL: Implement the cleanup function.
    // This runs when the component unmounts to prevent memory leaks.
    return () => {
      if (buttons) {
        buttons.close(); // This is the official PayPal SDK method to clean up buttons.
      }
    };
  // Re-run this effect if amount or currency changes.
  }, [amount, currency, onPaymentSuccess, onPaymentError]);

  // Render the container div and any loading/error states.
  return (
    <div className="paypal-button-container">
      {isLoading && <div className="spinner"></div> /* Your spinner component */}
      {error && <div className="paypal-error">{error}</div>}
      <div ref={paypalContainerRef}></div>
    </div>
  );
};

export default PaypalWithRawJS;
