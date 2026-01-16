import Stripe from "stripe";
import type {
  AppSyncResolverHandler,
  AppSyncIdentityCognito,
} from "aws-lambda";

export const handler: AppSyncResolverHandler<any, any> = async (event) => {
  try {
    const identity = event.identity as AppSyncIdentityCognito;
    const userId = identity?.sub;

    if (!userId) {
      throw new Error("Unauthorized: No user identity found");
    }

    const stripeCustomerId = process.env.STRIPE_CUSTOMER_ID!;
    const stripeClient = new Stripe(process.env.STRIPE_SECRET_KEY!);

    // 1. Fetch Subscriptions and Invoices in parallel for speed
    const [subscriptions, invoices] = await Promise.all([
      stripeClient.subscriptions.list({
        customer: stripeCustomerId,
        status: "all",
        expand: ["data.items.data.price"],
      }),
      stripeClient.invoices.list({
        customer: stripeCustomerId,
        limit: 12, // Last 12 months of history
      })
    ]);

    // 2. Fetch Product Names for the Subscription Items
    const productIds = new Set<string>();
    subscriptions.data.forEach(sub => {
      sub.items.data.forEach(item => {
        productIds.add(item.price.product as string);
      });
    });

    const products = await Promise.all(
      [...productIds].map(id => stripeClient.products.retrieve(id))
    );

    const productMap = products.reduce((acc, product) => {
      acc[product.id] = product.name;
      return acc;
    }, {} as Record<string, string>);

    // 3. Polish Billing History (Timeline Data)
    const billingHistory = invoices.data.map(invoice => ({
      id: invoice.id,
      date: new Date(invoice.created * 1000).toISOString(),
      amount: invoice.total / 100, // Stripe uses cents
      currency: invoice.currency.toUpperCase(),
      status: invoice.status, // paid, open, void
      receiptUrl: invoice.hosted_invoice_url, // Link to Stripe's hosted receipt page
      pdfUrl: invoice.invoice_pdf,           // Direct link to download PDF
      number: invoice.number,                // e.g., "INV-1234"
    }));

    // 4. Polish Subscription Data
    const subscriptionDetails = subscriptions.data.map(sub => {
      const isActive = sub.status === 'active';
      
      // Attempt to find the next billing date from upcoming/past logic
      // Fallback to current_period_end if active
      const renewalDate = isActive 
        ? new Date(sub.items.data[0].current_period_end * 1000).toISOString()
        : null;

      return {
        id: sub.id,
        status: sub.status,
        renewalDate,
        amount: sub.items.data[0]?.price.unit_amount ? sub.items.data[0].price.unit_amount / 100 : 0,
        currency: sub.currency.toUpperCase(),
        items: sub.items.data.map(item => {
          const productId = item.price.product as string;
          return productMap[productId] || "Unknown Product";
        }),
      };
    });

    return {
      userId,
      stripeCustomerId,
      subscriptions: subscriptionDetails,
      billingHistory: billingHistory, // Send this to your new UI table
    };

  } catch (error: any) {
    console.error("Stripe API error:", error);
    throw new Error(error.message || "Failed to fetch data");
  }
};
