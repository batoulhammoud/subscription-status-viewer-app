import { defineFunction, secret } from "@aws-amplify/backend";

export const createBillingPortal = defineFunction({
  entry: "./handler.ts", 
  name: "createBillingPortal",
  environment: { // These stay server-side only
    STRIPE_SECRET_KEY: secret("STRIPE_SECRET_KEY"),
    STRIPE_CUSTOMER_ID: secret("STRIPE_CUSTOMER_ID")
  },
});

