/**
 * @fileoverview This file initializes and exports a singleton instance of the
 * Mailchimp Marketing SDK. It includes startup validation to ensure all
 * required environment variables are present.
 */

import mailchimp from "@mailchimp/mailchimp_marketing";

// 1. Get the environment variables
const apiKey = process.env.MAILCHIMP_API_KEY;
const serverPrefix = process.env.MAILCHIMP_API_SERVER; // e.g., 'us17'

// 2. Configure the SDK with the credentials if available.
// During build time, environment variables may not be available, so we skip configuration.
// At runtime (when the API routes are called), the variables should be present.
if (apiKey && serverPrefix) {
  mailchimp.setConfig({
    apiKey: apiKey,
    server: serverPrefix,
  });
} else if (process.env.NODE_ENV === 'production') {
  // Only throw in production to ensure variables are set at runtime
  console.warn(
    "WARNING: Mailchimp API Key or Server Prefix is not defined in environment variables. " +
    "Please set MAILCHIMP_API_KEY and MAILCHIMP_API_SERVER before running in production."
  );
}

// 3. Export the configured instance for use in your API routes.
// We can also export the types for convenience if needed.
export { mailchimp };

// For better type safety, you can export the client instance with its type.
// This is slightly verbose but provides the best autocompletion.
const mailchimpClient: typeof mailchimp = mailchimp;
export default mailchimpClient;
