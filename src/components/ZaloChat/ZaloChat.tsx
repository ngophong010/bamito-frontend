"use client";
import Script from "next/script";
import "./ZaloChat.scss"; // Renamed from ZaloZhat.scss for consistency

// 1. Add types for the global window object to make TypeScript aware of ZaloChatWidget.
// This is a best practice for integrating third-party scripts.
declare global {
  interface Window {
    ZaloChatWidget?: {
      render: () => void;
    };
  }
}

const ZaloChat = () => {
  // Get the Zalo OA ID from environment variables
  const zaloOaId = process.env.NEXT_PUBLIC_ZALO_ID;

  // 2. Don't render the component at all if the ID is not configured.
  // This prevents errors and an empty div from rendering in production.
  if (!zaloOaId) {
    return null;
  }
  
  // The 'onLoad' callback for the Next.js Script component.
  // This function will ONLY run after the Zalo SDK script has successfully
  // downloaded and executed.
  const handleScriptLoad = () => {
    // 3. Safely initialize the widget.
    // This is more robust than using a useEffect hook.
    if (window.ZaloChatWidget) {
      window.ZaloChatWidget.render();
    }
  };

  return (
    <>
      {/* 
        This is the placeholder div that the Zalo script will target.
        All configuration is done via data attributes.
      */}
      <div
        className="zalo-chat-widget"
        data-oaid={zaloOaId}
        data-welcome-message="Rất vui khi được hỗ trợ bạn!"
        data-autopopup="0" // Set to 0 to prevent it from popping up automatically
        data-width=""
        data-height=""
      ></div>

      {/* 
        4. Use the Next.js Script component for optimized loading.
           - `strategy="lazyOnload"`: Waits until the browser is idle to load the script.
           - `onLoad`: A callback function that runs after the script is loaded.
      */}
      <Script
        id="zalo-chat-sdk" // Add a unique ID for the script
        strategy="lazyOnload"
        src="https://sp.zalo.me/plugins/sdk.js"
        onLoad={handleScriptLoad}
      />
    </>
  );
};

export default ZaloChat;
