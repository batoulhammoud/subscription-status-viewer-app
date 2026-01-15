import stripe from 'stripe';
import type { AppSyncResolverHandler, AppSyncIdentityCognito } from 'aws-lambda';

// Define the shape of the data we expect to return



export const handler: AppSyncResolverHandler<any, any> = async (event) => {
  try {
    // 1. Cast the identity to Cognito to access 'sub' and 'claims'
    const identity = event.identity as AppSyncIdentityCognito;
    const userId = identity?.sub;
    
    if (!userId) {
      throw new Error('Unauthorized: No user identity found');
    }

    // --- MAPPING LOGIC ---
    const stripeCustomerId = process.env.STRIPE_CUSTOMER_ID!; 

    // 2. Initialize Stripe
    // Note: It's best practice to use environment variables for keys!
    const stripeClient = new stripe(process.env.STRIPE_SECRET_KEY!);

    // 3. Fetch subscriptions
    const subscriptions = await stripeClient.subscriptions.list({
      customer: stripeCustomerId,   
      status: 'active', //TODO: status can be dynamic based on requirements
    });


    

    // 4. Return data directly (matching your GraphQL schema expectation)
    return {
      userId,
      stripeCustomerId,
      subscriptions: subscriptions.data.map(sub => ({
        id: sub.id,
        status: sub.status,
        items: sub.items.data.map(item => item.price.product),
      })),
    };

  } catch (error: any) {
    console.error('Stripe API error:', error);
    throw new Error(error.message || 'Failed to fetch subscription status');
  }
};

