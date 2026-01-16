import { useEffect, useState } from "react";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "../../amplify/data/resource";

const client = generateClient<Schema>();

export type BillingInvoice = {
  id: string;
  date: string;
  amount: number;
  currency: string;
  status: string;
  receiptUrl?: string;
  pdfUrl?: string;
  number?: string;
};

export default function BillingHistory() {
  const [billingHistory, setBillingHistory] = useState<BillingInvoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchBillingHistory() {
      try {
        const result = await client.queries.getSubscription(
          {},
          { authMode: "userPool" }
        );

        const data = typeof result.data === "string"
          ? JSON.parse(result.data)
          : result.data;

        setBillingHistory(data.billingHistory || []);
      } catch (err: any) {
        setError(err.message || "Failed to load billing history");
      } finally {
        setLoading(false);
      }
    }

    fetchBillingHistory();
  }, []);

  if (loading) return <p>Loading billing history...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!billingHistory.length) return <p>No billing history found</p>;

  return (
    <div>
      <h2>Billing History</h2>
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
              <td style={{ border: "1px solid #ddd", padding: 8 }}>
                {invoice.amount.toFixed(2)}
              </td>
              <td style={{ border: "1px solid #ddd", padding: 8 }}>{invoice.currency}</td>
              <td style={{ border: "1px solid #ddd", padding: 8 }}>{invoice.status}</td>
              <td style={{ border: "1px solid #ddd", padding: 8 }}>
                {invoice.receiptUrl && (
                  <a href={invoice.receiptUrl} target="_blank" rel="noopener noreferrer">
                    View
                  </a>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
