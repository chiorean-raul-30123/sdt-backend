import { BrowserRouter, Routes, Route, Navigate, Link } from "react-router-dom";
import CouriersPage from "./pages/CouriersPage";
import CourierDetailsPage from "./pages/CourierDetailsPage";
import CustomerDetailsPage from "./pages/CustomerDetailsPage";
import CustomersPage from "./pages/CustomersPage";
import 'leaflet/dist/leaflet.css';
import { fixLeafletIcons } from "./leaflet-icons";
fixLeafletIcons();

function Home() {
  return (
    <div style={{ padding: 16 }}>
      <h2>Smart Delivery Tracker</h2>
      <nav style={{ display: "flex", gap: 12 }}>
        <Link to="/customers">Customers</Link>
        <Link to="/couriers">Couriers</Link>
      </nav>
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/customers" element={<CustomersPage />} />
      <Route path="/customers/:id" element={<CustomerDetailsPage />} />
      <Route path="/couriers" element={<CouriersPage />}/>
      <Route path="/couriers/:id" element={<CourierDetailsPage />} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

