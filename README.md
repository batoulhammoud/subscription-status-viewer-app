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

- **Analytics (Stretch Goal)**  
  - Track user interactions (viewing subscriptions, clicking “Manage Billing”) with Amplitude.
  > Screenshot: Amplitude event stream showing tracked events inside (assets/screenshots/amplitude_events.png)

- **UI Polish (Stretch Goal)** 
  - Added a **“View Billing History”** button that reveals a table populated with **Stripe invoice data**.


---

## Assumptions

- Each user maps to **one Stripe customer**.  
- Stripe credentials and customer IDs are securely stored in **AWS Secrets Manager** instead of environment variables. (server-side)
- Backend functions retrieve secrets at runtime, ensuring no sensitive data is exposed to the frontend or committed to version control.
- Billing portal and invoice data are fetched **on-demand** from backend Lambda, not persisted locally.  
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
  - Filter subscriptions by status (active, trialing, canceled, etc.)  
  - Sort subscriptions by expiry/renewal date    

- **Caching / Performance**  
  - Cache product names and invoices to reduce repeated Stripe API calls.  

- **Testing**  
  - Increase unit and integration test coverage

- **Responsiveness**  
  - Implement a fully responsive layout to support mobile, tablet, and desktop screens  
  - Optimize spacing, typography, and touch targets for mobile users  
  - Perform cross-device testing to ensure a seamless user experience


---

## How to Run

1. Clone the repository and install dependencies:  
```bash
git clone <repo-url>
cd subscription-status-viewer
npm install
```
2. Set Up Environment Variables:
  - Create a `.env` file in the same directory as `.env.example`.  
  - Copy the contents from `.env.example` and paste the values provided via email.  

3. Amplify Configuration:
  - Download the `amplify_outputs.json` file shared via email.  
  - Place it in the root of the `subscription-status-viewer` folder.  
    Example path:  
    `C:\Users\batoul\OneDrive\Desktop\CPOS Assignment\subscription-status-viewer\amplify_outputs.json`


4. Run the App:
```bash
npm run dev
```

5. Sign In / Register:
  - On first open, click Create Account to register with your email and password.
  - Enter the verification code sent to your inbox to activate your account.
  - Once verified, you can sign in directly with your credentials.