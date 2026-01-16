import { useEffect, useState } from "react";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "../../amplify/data/resource";
import { useAuth } from "../contexts/AuthContext";
import SubscriptionItem from "../components/SubscriptionItem";

const client = generateClient<Schema>();

/* ---------- Types ---------- */
export type SubscriptionItem = {
  id: string;
  status: string;
  items: string[];
  renewalDate?: string | null;
  amount: number;
  currency: string;
};

export type Invoice = {
  id: string;
  number: string;
  date: string;
  amount: number;
  currency: string;
  status: string;
  pdfUrl: string | null;
};

export type ApiResponse = {
  userId: string;
  stripeCustomerId: string;
  subscriptions: SubscriptionItem[];
  billingHistory: Invoice[];
};

/* ---------- Component ---------- */
export default function Subscription() {
  const { user, loading: userLoading } = useAuth();

  const [subscriptions, setSubscriptions] = useState<SubscriptionItem[]>([]);
  const [billingHistory, setBillingHistory] = useState<Invoice[]>([]);

  const [loading, setLoading] = useState(true);
  const [portalLoading, setPortalLoading] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /* ---------- Fetch Subscriptions ---------- */
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

        if (result.errors) throw new Error("GraphQL error");
        if (!result.data) throw new Error("No data returned");

        const parsed: ApiResponse =
          typeof result.data === "string" ? JSON.parse(result.data) : result.data;

        setSubscriptions(parsed.subscriptions);
      } catch (err: any) {
        setError(err.message || "Failed to load subscription");
      } finally {
        setLoading(false);
      }
    }

    if (!userLoading) fetchSubscription();
  }, [user, userLoading]);

  /* ---------- Manage Billing Portal ---------- */
  async function handleBillingPortal() {
    try {
      setPortalLoading(true);

      const result = await client.queries.createBillingPortal({}, { authMode: "userPool" });
      const parsed = typeof result.data === "string" ? JSON.parse(result.data) : result.data;

      if (!parsed?.url) throw new Error("No portal URL returned");

      window.location.href = parsed.url;
    } catch (err: any) {
      alert(err.message || "Failed to open billing portal");
    } finally {
      setPortalLoading(false);
    }
  }

  /* ---------- View Billing History ---------- */
  async function handleBillingHistory() {
    try {
      setHistoryLoading(true);

      const result = await client.queries.getSubscription(
        { email: user?.signInDetails?.loginId },
        { authMode: "userPool" }
      );

      const parsed: ApiResponse =
        typeof result.data === "string" ? JSON.parse(result.data) : result.data;

      if (!parsed?.billingHistory || parsed.billingHistory.length === 0) {
        throw new Error("No billing history returned");
      }

      setBillingHistory(parsed.billingHistory);
    } catch (err: any) {
      alert(err.message || "Failed to fetch billing history");
    } finally {
      setHistoryLoading(false);
    }
  }

  /* ---------- UI ---------- */
  if (userLoading || loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!subscriptions.length) return <p>No subscriptions found</p>;

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: 20 }}>
      <h2 style={{ marginBottom: 20 }}>Your Subscriptions</h2>

      <SubscriptionItem subscriptions={subscriptions} />

      {/* Action Buttons */}
      <div style={{ display: "flex", gap: 15, marginTop: 30 }}>
        <button
          onClick={handleBillingPortal}
          disabled={portalLoading}
          style={{
            padding: "10px 20px",
            background: "#635bff",
            color: "#fff",
            border: "none",
            borderRadius: 6,
            cursor: "pointer",
            flex: 1,
          }}
        >
          {portalLoading ? "Redirecting..." : "Manage Billing"}
        </button>

        <button
          onClick={handleBillingHistory}
          disabled={historyLoading}
          style={{
            padding: "10px 20px",
            backgroundColor: "#4CAF50",
            color: "#fff",
            border: "none",
            borderRadius: 6,
            cursor: "pointer",
            flex: 1,
          }}
        >
          {historyLoading ? "Loading..." : "View Billing History"}
        </button>
      </div>

      {/* Billing History Table */}
      {billingHistory.length > 0 && (
        <div style={{ marginTop: 40 }}>
          <h3>Billing History</h3>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th style={{ border: "1px solid #ddd", padding: 8 }}>Invoice #</th>
                <th style={{ border: "1px solid #ddd", padding: 8 }}>Date</th>
                <th style={{ border: "1px solid #ddd", padding: 8 }}>Amount</th>
                <th style={{ border: "1px solid #ddd", padding: 8 }}>Currency</th>
                <th style={{ border: "1px solid #ddd", padding: 8 }}>Status</th>
                <th style={{ border: "1px solid #ddd", padding: 8 }}>Receipt</th>
              </tr>
            </thead>
            <tbody>
              {billingHistory.map((invoice) => (
                <tr key={invoice.id}>
                  <td style={{ border: "1px solid #ddd", padding: 8 }}>{invoice.number}</td>
                  <td style={{ border: "1px solid #ddd", padding: 8 }}>
                    {new Date(invoice.date).toLocaleDateString()}
                  </td>
                  <td style={{ border: "1px solid #ddd", padding: 8 }}>{invoice.amount.toFixed(2)}</td>
                  <td style={{ border: "1px solid #ddd", padding: 8 }}>{invoice.currency}</td>
                  <td style={{ border: "1px solid #ddd", padding: 8 }}>{invoice.status}</td>
                  <td style={{ border: "1px solid #ddd", padding: 8 }}>
                    {invoice.pdfUrl && (
                      <a href={invoice.pdfUrl} target="_blank" rel="noopener noreferrer">
                        PDF
                      </a>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
