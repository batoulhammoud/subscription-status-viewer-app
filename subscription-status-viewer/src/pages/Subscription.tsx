import { useEffect, useState } from "react";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "../../amplify/data/resource";
// import { getCurrentUser } from "aws-amplify/auth";
import SubscriptionItem from "../components/SubscriptionItem";
import { useAuth } from "../contexts/AuthContext";

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

  const { user, loading: userLoading } = useAuth();
  const [subscriptions, setSubscriptions] = useState<SubscriptionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [portalLoading, setPortalLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchSubscription() {
      if (!user) return;
      try {
        // const user = await getCurrentUser();
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

    if (!userLoading) fetchSubscription();
  }, [user, userLoading]);

  if (userLoading || loading) return <p>Loading...</p>;





  

  /* ---------- Billing Portal ---------- */

  async function handleBillingPortal() {
    try {
      setPortalLoading(true);

      const result =
        await client.queries.createBillingPortal(
          {},
          { authMode: "userPool" }
        );
        
      console.log("Billing Portal Result:", result);

      if (!result.data?.url) {
        throw new Error("No portal URL returned");
      }

      // Redirect user to Stripe
      window.location.href = result.data.url;
    } catch (err: any) {
      alert(err.message || "Failed to open portal");
    } finally {
      setPortalLoading(false);
    }
  }


 
  /* ---------- UI ---------- */


  if (loading) return <p>Loading subscription...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!subscriptions.length) return <p>No subscriptions found</p>;

  return (
    <div>
      <h2>Your Subscriptions</h2>

      <SubscriptionItem subscriptions={subscriptions} />

      {/* Billing Portal Button */}
      <button
        onClick={handleBillingPortal}
        disabled={portalLoading}
        style={{
          marginTop: 20,
          padding: "10px 20px",
          background: "#635bff",
          color: "#fff",
          border: "none",
          borderRadius: 6,
          cursor: "pointer",
        }}
      >
        {portalLoading
          ? "Redirecting..."
          : "Manage Billing"}
      </button>
    </div>
  );
}
