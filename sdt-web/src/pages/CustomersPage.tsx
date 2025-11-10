// src/pages/CustomersPage.tsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchCustomers } from "../lib/customers";
import type { CustomerDto } from "../types";
import CreateCustomerForm from "../components/CreateCustomerForm";

export default function CustomersPage() {
  const navigate = useNavigate();

  const [items, setItems] = useState<CustomerDto[]>([]);
  const [total, setTotal] = useState(0);
  const [pageIndex, setPageIndex] = useState(0);
  const [size] = useState(20);
  const [showCreate, setShowCreate] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let ignore = false;
    setLoading(true);
    setError(null);

    fetchCustomers({ page: pageIndex, size })
      .then(({ items, total }) => {
        if (!ignore) {
          setItems(items);
          setTotal(total);
        }
      })
      .catch((e) => !ignore && setError(e?.message || "Load failed"))
      .finally(() => !ignore && setLoading(false));

    return () => { ignore = true; };
  }, [pageIndex, size, reloadKey]);

  return (
    <div style={{ padding: 16 }}>

      <div style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        marginBottom: 12
      }}>
        <h2 style={{ margin: 0, flex: 1 }}>Customers</h2>

        <button onClick={() => navigate("/")} style={{ padding: "6px 12px" }}>
          Home
        </button>

        <button onClick={() => setShowCreate(s => !s)} style={{ padding: "6px 12px" }}>
          {showCreate ? "Close" : "New Customer"}
        </button>
      </div>

      {showCreate && (
        <div style={{ marginBottom: 16 }}>
          <CreateCustomerForm
            onCreated={() => {
              setReloadKey(k => k + 1);
              setShowCreate(false);
            }}
            onCancel={() => setShowCreate(false)}
          />
        </div>
      )}

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "crimson" }}>{error}</p>}

      {!loading && !error && (
        <>
          {items.length === 0 ? (
            <p>No customers.</p>
          ) : (
            <ul>
              {items.map(c => (
                <li key={c.id}>
                  {c.firstName} {c.lastName} — {c.email}
                </li>
              ))}
            </ul>
          )}

          <div style={{ marginTop: 8 }}>
            <button
              disabled={pageIndex === 0}
              onClick={() => setPageIndex(p => Math.max(0, p - 1))}
            >
              Prev
            </button>
            <span style={{ margin: "0 8px" }}>Total: {total}</span>
            <button onClick={() => setPageIndex(p => p + 1)}>Next</button>
          </div>
        </>
      )}
    </div>
  );
}
