// import { type SubscriptionItem } from "../pages/Subscription";


// export type SubscriptionItemProps = {
//     subscriptions: SubscriptionItem[];
// }

// export default function SubscriptionItem({ subscriptions }: SubscriptionItemProps) {
// console.log("-------- SUBSCRIPTION ITEMS:", subscriptions); 
//     return(
//         <>
//       {subscriptions.map((sub) => (
//         <div
//           key={sub.id}
//           style={{
//             border: "1px solid #ddd",
//             padding: 12,
//             marginBottom: 10,
//             borderRadius: 6,
//           }}
//         >
//           <p>
//             <strong>ID:</strong> {sub.id}
//           </p>

//           <p>
//             <strong>Status:</strong>{" "}
//             <span
//               style={{
//                 color: sub.status === "active" ? "green" : "orange",
//               }}
//             >
//               {sub.status}
//             </span>
//           </p>

//           <p>
//             <strong>Products:</strong>
//           </p>
//           <ul>
//             {sub.items.map((productId) => (
//               <li key={productId}>{productId}</li>
//             ))}
//           </ul>

//           <p>
//             <strong>Next payment due:</strong>{" "}
//             {sub.renewalDate
//               ? new Date(sub.renewalDate).toLocaleDateString()
//               : "N/A"}
//           </p>
//         </div>
//       ))}
//       </>
//     )
// }

import { type SubscriptionItem } from "../pages/Subscription";

export type SubscriptionItemProps = {
  subscriptions: SubscriptionItem[];
};

export default function SubscriptionItem({ subscriptions }: SubscriptionItemProps) {
  console.log("-------- SUBSCRIPTION ITEMS:", subscriptions);

  return (
    <>
      {subscriptions.map((sub) => (
        <div
          key={sub.id}
          style={{
            border: "1px solid #e2e8f0",
            padding: "20px",
            marginBottom: "16px",
            borderRadius: "8px",
            backgroundColor: "#fff",
            boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
          }}
        >
          {/* Header Section: ID and Price */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
            <span style={{ fontSize: "0.875rem", color: "#64748b", fontWeight: 500 }}>
              ID: {sub.id}
            </span>
            <span style={{ fontSize: "1.125rem", fontWeight: "bold", color: "#1e293b" }}>
              {new Intl.NumberFormat('en-US', { style: 'currency', currency: sub.currency || 'USD' }).format(sub.amount)}
              <span style={{ fontSize: "0.875rem", color: "#64748b", fontWeight: "normal" }}> / mo</span>
            </span>
          </div>

          <hr style={{ border: "0", borderTop: "1px solid #f1f5f9", marginBottom: "12px" }} />

          {/* Status Badge */}
          <p style={{ margin: "8px 0" }}>
            <strong>Status:</strong>{" "}
            <span
              style={{
                display: "inline-block",
                padding: "2px 8px",
                borderRadius: "9999px",
                fontSize: "0.75rem",
                fontWeight: "bold",
                textTransform: "uppercase",
                backgroundColor: sub.status === "active" ? "#dcfce7" : "#fee2e2",
                color: sub.status === "active" ? "#166534" : "#991b1b",
              }}
            >
              {sub.status}
            </span>
          </p>

          {/* Products List */}
          <p style={{ margin: "8px 0", fontWeight: "bold" }}>Plan Details:</p>
          <ul style={{ paddingLeft: "20px", margin: "4px 0", color: "#475569" }}>
            {sub.items.map((productName, index) => (
              <li key={index} style={{ marginBottom: "2px" }}>{productName}</li>
            ))}
          </ul>

          {/* Date Information */}
          <p style={{ marginTop: "16px", fontSize: "0.9rem", color: "#475569" }}>
            <strong>
              {sub.status === "active" ? "Next renewal date:" : "Access until:"}
            </strong>{" "}
            {sub.renewalDate
              ? new Date(sub.renewalDate).toLocaleDateString(undefined, {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })
              : "N/A"}
          </p>
        </div>
      ))}
    </>
  );
}