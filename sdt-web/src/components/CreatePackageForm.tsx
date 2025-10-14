import { useState } from "react";
import type { PackageCreateDto } from "../types";
import { createPackage } from "../lib/packages";

type Props = {
  requiredCourierId?: number;
  onCreated?: () => void;
  onCancel?: () => void;
};

export default function CreatePackageForm(props: Props) {
  const { requiredCourierId, onCreated, onCancel } = props;

  const [form, setForm] = useState<PackageCreateDto>({
    trackingCode: "",
    pickupAddress: "",
    deliveryAddress: "",
    weightKg: null,
    courierId: requiredCourierId ?? null,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function set<K extends keyof PackageCreateDto>(k: K, v: PackageCreateDto[K]) {
    setForm(s => ({ ...s, [k]: v }));
  }

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    e.stopPropagation();
    setError(null);

    if (!form.trackingCode.trim()) return setError("Tracking code is required");
    if (!form.pickupAddress.trim()) return setError("Pickup address is required");
    if (!form.deliveryAddress.trim()) return setError("Delivery address is required");
    if (form.weightKg != null && (isNaN(Number(form.weightKg)) || Number(form.weightKg) < 0)) {
      return setError("Weight must be a positive number");
    }

    try {
      setLoading(true);
      await createPackage({
        trackingCode: form.trackingCode.trim(),
        pickupAddress: form.pickupAddress.trim(),
        deliveryAddress: form.deliveryAddress.trim(),
        weightKg: form.weightKg === null ? null : Number(form.weightKg),
        courierId: requiredCourierId ?? null,
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
          Tracking Code
          <input
            value={form.trackingCode}
            onChange={(e) => set("trackingCode", e.target.value)}
            placeholder="TRK-000123"
            required
            style={{ width: "100%" }}
          />
        </label>

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
