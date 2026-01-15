import { type SubscriptionItem } from "../pages/Subscription";


export type SubscriptionItemProps = {
    subscriptions: SubscriptionItem[];
}

export default function SubscriptionItem({ subscriptions }: SubscriptionItemProps) {
console.log("-------- SUBSCRIPTION ITEMS:", subscriptions); 
    return(
        <>
      {subscriptions.map((sub) => (
        <div
          key={sub.id}
          style={{
            border: "1px solid #ddd",
            padding: 12,
            marginBottom: 10,
            borderRadius: 6,
          }}
        >
          <p>
            <strong>ID:</strong> {sub.id}
          </p>

          <p>
            <strong>Status:</strong>{" "}
            <span
              style={{
                color: sub.status === "active" ? "green" : "orange",
              }}
            >
              {sub.status}
            </span>
          </p>

          <p>
            <strong>Products:</strong>
          </p>
          <ul>
            {sub.items.map((productId) => (
              <li key={productId}>{productId}</li>
            ))}
          </ul>

          <p>
            <strong>Renewal date:</strong>{" "}
            {sub.renewalDate
              ? new Date(sub.renewalDate).toLocaleDateString()
              : "N/A"}
          </p>
        </div>
      ))}
      </>
    )
}