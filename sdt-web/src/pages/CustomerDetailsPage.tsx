import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getCustomer } from "../lib/customers";
import { fetchPackagesBySenderCustomerId } from "../lib/packages";
import type { CustomerDto, PackageDto } from "../types";

export default function CustomerDetailsPage() {
  const { id } = useParams();
  const customerId = Number(id);

  const [customer, setCustomer] = useState<CustomerDto | null>(null);
  const [packages, setPackages] = useState<PackageDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  async function load() {
    try {
      setLoading(true);
      const [c, pkgs] = await Promise.all([
        getCustomer(customerId),
        fetchPackagesBySenderCustomerId(customerId)
      ]);
      setCustomer(c);
      setPackages(pkgs);
    } catch (e: any) {
      setErr(e?.message || "Failed to load");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { if (!Number.isNaN(customerId)) load(); }, [customerId]);

  if (Number.isNaN(customerId)) return <p>Invalid customer id</p>;
  if (loading) return <p>Loading…</p>;
  if (err) return <p style={{color:"crimson"}}>{err}</p>;
  if (!customer) return <p>Not found</p>;

  return (
    <div>
      <h2>Customer: {customer.name}</h2>
      <p>{customer.email || "-"}</p>
      <p>{customer.phone || "-"}</p>
      <p>{customer.address || "-"}</p>

      <h3>Packages created by this customer</h3>
      {packages.length === 0 ? <p>No packages</p> : (
        <ul>
          {packages.map(p => (
            <li key={p.id}>
              <strong>{p.trackingCode}</strong> — {p.status}
              {p.courierId ? <> (courier #{p.courierId})</> : null}
            </li>
          ))}
        </ul>
      )}

      <div style={{marginTop:12}}>
        <Link to="/customers">← Back to customers</Link>
      </div>
    </div>
  );
}
