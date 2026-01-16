# Subscription Status Viewer

A minimal full-stack application to view user subscriptions and billing history using **AWS Amplify**, **React**, and **Stripe API**.  

---

## Architecture Decisions

- **Frontend**  
  - React + TypeScript for type safety and modular components.  
  - **React Router** for page navigation (`Dashboard` & `Subscription` pages).  
  - **Context API (`useAuth`)** to store and share user authentication state globally.  
  - Components like `SubscriptionItem` for reusability and separation of concerns.

- **Backend**  
  - **AWS Amplify Gen 2** for GraphQL API + Lambda resolvers.  
  - **Stripe API** for subscription & invoice data.  
  - Lambda handlers fetch subscriptions, invoice history, and generate Stripe billing portal URLs.  
  - Used **environment variables** for secure API keys.

- **Data Flow**  
  1. User logs in → `useAuth` stores user info.  
  2. Frontend queries Amplify GraphQL API → Lambda resolver fetches data from Stripe.  
  3. Returns structured data: subscriptions + billing history → UI displays in a table and card layout.  

- **UI Decisions**  
  - Card-style subscription display.  
  - Buttons for **Manage Billing** and **View Billing History**.  
  - Billing history displayed in a table with invoice details and links to receipts.

- **Analytics**  
  - Track user interactions (viewing subscriptions, clicking “Manage Billing”) with Amplitude.

---

## Assumptions

- Each user maps to **one Stripe customer**, stored via an environment variable (`STRIPE_CUSTOMER_ID`).  
- Billing portal and invoice data are fetched **on-demand**, not persisted locally.  
- All users are authenticated via **Cognito user pools**, allowing safe API calls.  
- Subscription items map to product names using Stripe’s products API.  

---

## Potential Improvements (Given More Time)

- **Dynamic user → Stripe customer mapping**  
  - Persist mapping in a database instead of environment variables.  

- **Webhooks**  
  - Listen to Stripe events (`invoice.paid`, `subscription.updated`) to update subscription state in real-time.  

- **Enhanced UI/UX**  
  - Subscription timeline visualizing renewal dates and status.  
  - Responsive and polished dashboard with icons, metrics, and multiple subscription plans.  

- **Caching / Performance**  
  - Cache product names and invoices to reduce repeated Stripe API calls.  

- **Testing**  
  - Increase unit and integration test coverage

---

## How to Run

1. Clone the repository and install dependencies:  
```bash
git clone <repo-url>
cd subscription-status-viewer
npm install



