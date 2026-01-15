import { defineFunction } from "@aws-amplify/backend";


//TODO: should i merge those two files under one index.ts file with two consts ??
export const getSubscription = defineFunction({
  entry: "./handler.ts", // points to your handler file
  name: "getSubscription",
  environment: { // These stay server-side only
    STRIPE_SECRET_KEY: "sk_test_51Soou9G3PTiWPNWGuUa42Chju9qhYYmQipBoQ4XIo7DyxinZigQ1uXMw7f694Xn7gpISRihKXu7QnwdtpLkScHcu00OR3750lM",
    STRIPE_CUSTOMER_ID: "cus_TnGgguRgIeyBHF"
  },
});

