/**
 * @fileoverview This file initializes and exports a singleton instance of the
 * Mailchimp Marketing SDK. It includes startup validation to ensure all
 * required environment variables are present.
 */

import mailchimp from "@mailchimp/mailchimp_marketing";

// 1. Get the environment variables
const apiKey = process.env.MAILCHIMP_API_KEY;
const serverPrefix = process.env.MAILCHIMP_API_SERVER; // e.g., 'us17'

// 2. "Fail-Fast" Validation: Check for required variables at initialization.
// This will crash the server on startup if the configuration is missing,
// which is a good thing as it prevents runtime errors.
if (!apiKey || !serverPrefix) {
  throw new Error(
    "FATAL ERROR: Mailchimp API Key or Server Prefix is not defined in environment variables."
  );
}

// 3. Configure the SDK with the validated credentials.
mailchimp.setConfig({
  apiKey: apiKey,
  server: serverPrefix,
});

// 4. Export the configured instance for use in your API routes.
// We can also export the types for convenience if needed.
export { mailchimp };

// For better type safety, you can export the client instance with its type.
// This is slightly verbose but provides the best autocompletion.
const mailchimpClient: typeof mailchimp = mailchimp;
export default mailchimpClient;
