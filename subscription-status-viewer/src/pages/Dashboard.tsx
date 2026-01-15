import { Link } from "react-router-dom";

export default function Dashboard() {
  return (
    <>
      <h2>Dashboard</h2>
      <Link to="/subscription">View subscription</Link>
    </>
  );
}
