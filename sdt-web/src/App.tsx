import { BrowserRouter, Routes, Route, Navigate, Link } from "react-router-dom";
import CouriersPage from "./pages/CouriersPage";
import CourierDetailsPage from "./pages/CourierDetailsPage";

export default function App() {
  return (
    <BrowserRouter>
      <div style={{maxWidth: 900, margin: "24px auto", padding: "0 16px"}}>
        <header style={{display:"flex", justifyContent:"space-between", marginBottom: 16}}>
          <h1>Smart Delivery Tracker — Web</h1>
          <nav><Link to="/couriers">Couriers</Link></nav>
        </header>

        <Routes>
          <Route path="/" element={<Navigate to="/couriers" replace />} />
          <Route path="/couriers" element={<CouriersPage />} />
          <Route path="/couriers/:id" element={<CourierDetailsPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
