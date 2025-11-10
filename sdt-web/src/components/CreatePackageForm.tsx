
import type { PackageCreateDto } from "../types";
import { createPackage } from "../lib/packages";
import { fetchCustomers } from "../lib/customers";
import type { CustomerDto } from "../types";
import { useEffect, useState } from "react";


type Props = {
  requiredCourierId?: number;
  requiredSenderId?: number;
  onCreated?: () => void;
  onCancel?: () => void;
};

export default function CreatePackageForm(props: Props) {
  const { requiredCourierId, requiredSenderId, onCreated, onCancel } = props;

  useEffect(() => {
      if (requiredSenderId != null) {
        setForm(s => ({ ...s, senderCustomerId: requiredSenderId }));
      }
    }, [requiredSenderId]);

  const [form, setForm] = useState<PackageCreateDto>({
      pickupAddress: "",
      deliveryAddress: "",
      weightKg: null,
      courierId: requiredCourierId ?? null,
      senderCustomerId: 0,
    });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [customers, setCustomers] = useState<CustomerDto[]>([]);
  const [loadingCustomers, setLoadingCustomers] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        setLoadingCustomers(true);
        const page1 = await fetchCustomers({ page: 0, size: 50 });
        const list = page1.items ?? [];
        setCustomers(list);
      } finally {
        setLoadingCustomers(false);
      }
    })();
  }, []);

  function set<K extends keyof PackageCreateDto>(k: K, v: PackageCreateDto[K]) {
    setForm(s => ({ ...s, [k]: v }));
  }

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    e.stopPropagation();
    setError(null);


    if (!form.pickupAddress.trim()) return setError("Pickup address is required");
    if (!form.deliveryAddress.trim()) return setError("Delivery address is required");
    if (form.weightKg != null && (isNaN(Number(form.weightKg)) || Number(form.weightKg) < 0)) {
      return setError("Weight must be a positive number");
    }
    if (!form.senderCustomerId || Number(form.senderCustomerId) <= 0) {
       return setError("Sender (customer) is required");
    }

    try {
      setLoading(true);
      await createPackage({
        pickupAddress: form.pickupAddress.trim(),
        deliveryAddress: form.deliveryAddress.trim(),
        weightKg: form.weightKg === null ? null : Number(form.weightKg),
        courierId: requiredCourierId ?? null,
        senderCustomerId: Number(form.senderCustomerId),
      });
      onCreated?.();
      onCancel?.();
    } catch (err: any) {
      setError(err?.response?.data?.message || "Create failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={submit} noValidate style={{ border: "1px solid #ddd", padding: 12, borderRadius: 8 }}>
      <h3 style={{ marginTop: 0 }}>New Package</h3>
      {error && <p style={{ color: "crimson" }}>{error}</p>}

      <div style={{ display: "grid", gap: 8, gridTemplateColumns: "1fr 1fr" }}>

        <label>
          Weight (kg)
          <input
            type="number"
            step="any"
            min="0"
            value={form.weightKg ?? ""}
            onChange={(e) => set("weightKg", e.target.value === "" ? null : Number(e.target.value))}
            style={{ width: "100%" }}
          />
        </label>

        <label style={{ gridColumn: "1 / -1" }}>
          Pickup Address
          <input
            value={form.pickupAddress}
            onChange={(e) => set("pickupAddress", e.target.value)}
            placeholder="Str. Exemplu 1, Cluj"
            required
            style={{ width: "100%" }}
          />
        </label>

        <label style={{ gridColumn: "1 / -1" }}>
          Delivery Address
          <input
            value={form.deliveryAddress}
            onChange={(e) => set("deliveryAddress", e.target.value)}
            placeholder="Str. Exemplu 2, Bucuresti"
            required
            style={{ width: "100%" }}
          />
        </label>
         <label style={{ gridColumn: "1 / -1" }}>
           Sender (Customer) *
           <select
             required
             value={form.senderCustomerId ?? ""}
             onChange={(e) =>
               set("senderCustomerId", e.target.value === "" ? null : Number(e.target.value))
             }
             style={{ width: "100%" }}
           >
             <option value="">-- Select customer --</option>
             {loadingCustomers && <option disabled>Loading...</option>}
             {customers.map((c) => (
               <option key={c.id} value={c.id}>
                 {c.name} {c.email ? `(${c.email})` : ""}
               </option>
             ))}
           </select>
         </label>

        {requiredCourierId == null && (
          <label>
            Courier ID (optional)
            <input
              type="number"
              value={form.courierId ?? ""}
              onChange={(e) => set("courierId", e.target.value === "" ? null : Number(e.target.value))}
              style={{ width: "100%" }}
            />
          </label>
        )}
      </div>

      <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
        <button type="submit" disabled={loading}>
          {loading ? "Creating..." : "Create"}
        </button>
        <button type="button" onClick={onCancel}>Cancel</button>
      </div>
    </form>
  );
}
