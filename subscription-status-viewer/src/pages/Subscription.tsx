import { useEffect, useState } from "react";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "../../amplify/data/resource";
import { getCurrentUser } from "aws-amplify/auth";
import SubscriptionItem from "../components/SubscriptionItem";

const client = generateClient<Schema>();

/* ---------- Types ---------- */

export type SubscriptionItem = {
  id: string;
  status: string;
  items: string[];
  renewalDate?: string;
};

export type ApiResponse = {
  userId: string;
  stripeCustomerId: string;
  subscriptions: SubscriptionItem[];
};

/* ---------- Component ---------- */

export default function Subscription() {
  const [subscriptions, setSubscriptions] = useState<SubscriptionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchSubscription() {
      try {
        const user = await getCurrentUser();
        const email = user?.signInDetails?.loginId;

        const result = await client.queries.getSubscription(
          { email },
          { authMode: "userPool" }
        );

        if (result.errors) {
          throw new Error("GraphQL error");
        }

        if (!result.data) {
          throw new Error("No data returned");
        }

        const parsed: ApiResponse =
          typeof result.data === "string"
            ? JSON.parse(result.data)
            : result.data;

        setSubscriptions(parsed.subscriptions);
      } catch (err: any) {
        setError(err.message || "Failed to load subscription");
      } finally {
        setLoading(false);
      }
    }

    fetchSubscription();
  }, []);

 
  /* ---------- UI ---------- */

  if (loading) return <p>Loading subscription...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!subscriptions.length) return <p>No subscriptions found</p>;

  return (
    <div>
        <h2>Your Subscriptions</h2>
        <SubscriptionItem subscriptions={subscriptions} />
    </div>
    );
}
