import { type ClientSchema, a, defineData } from '@aws-amplify/backend';
import { getSubscription } from '../functions/getSubscription/resource';
// amplify/data/resource.ts

const schema = a.schema({
  // Define your custom query here
  getSubscription: a.query()
    .arguments({
      email: a.string(),
    })
    .returns(a.json()) // Adjust based on your actual return type
    .handler(a.handler.function(getSubscription))
    // FIX: Explicitly allow authenticated users to call this query
    .authorization(allow => [allow.authenticated()]),



  
});

export type Schema = ClientSchema<typeof schema>;
export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: 'userPool', // Ensure this is set for logged-in users
  },
});
