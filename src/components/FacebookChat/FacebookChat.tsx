"use client";
import Image from "next/image";
import Link from "next/link"; // Import the Link component
import "./FacebookChat.scss";

const FacebookChat = () => {
  // Get the Facebook Page ID from environment variables
  const facebookPageId = process.env.NEXT_PUBLIC_FB_ID;

  // 1. Don't render the component at all if the ID is not configured.
  // This prevents a dead button from showing up in production.
  if (!facebookPageId) {
    return null;
  }

  // Construct the Messenger URL
  const messengerUrl = `https://m.me/${facebookPageId}`;

  return (
    // 2. Use a Next.js <Link> component wrapping an <a> tag.
    // This is the semantically correct and SEO-friendly way to create a link.
    <Link href={messengerUrl} passHref legacyBehavior>
      <a
        className="Facebook-chat-container"
        target="_blank" // Open in a new tab
        rel="noopener noreferrer" // Security best practice for target="_blank"
        aria-label="Chat with us on Facebook Messenger" // Accessibility label
      >
        <Image
          src="/images/facebook-messenger.webp"
          alt="Facebook Messenger Chat" // 3. Add descriptive alt text
          height={50}
          width={50}
          unoptimized // Optional: Prevents Next.js from trying to optimize this small, static icon
        />
      </a>
    </Link>
  );
};

export default FacebookChat;
