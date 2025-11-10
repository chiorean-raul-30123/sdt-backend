import { useState } from "react";
import type { CourierCreateDto } from "../types";
import { createCourier } from "../lib/couriers";

type Props = {
  onCreated?: () => void;
  onCancel?: () => void;
};

export default function CreateCourierForm({ onCreated, onCancel }: Props) {
  const [form, setForm] = useState<CourierCreateDto>({ name: "", email: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const set = (k: keyof CourierCreateDto, v: any) => setForm(s => ({ ...s, [k]: v }));

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!form.name.trim()) return setError("Name is required");
    if (!form.email.trim()) return setError("Email is required");

    try {
      setLoading(true);
      await createCourier({
        name: form.name.trim(),
        email: form.email.trim(),
        managerId: form.managerId ?? null,
        lastLat: form.lastLat ?? null,
        lastLng: form.lastLng ?? null,
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
    <form onSubmit={submit} style={{border:"1px solid #ddd", padding:12, borderRadius:8, marginTop:12}}>
      <h3 style={{marginTop:0}}>New Courier</h3>

      {error && <p style={{color:"crimson"}}>{error}</p>}

      <div style={{display:"grid", gap:8, gridTemplateColumns:"1fr 1fr"}}>
        <label>
          Name
          <input
            value={form.name}
            onChange={e => set("name", e.target.value)}
            placeholder="John Doe"
            required
            style={{width:"100%"}}
          />
        </label>
        <label>
          Email
          <input
            type="email"
            value={form.email}
            onChange={e => set("email", e.target.value)}
            placeholder="john@company.com"
            required
            style={{width:"100%"}}
          />
        </label>
        <label>
          Manager ID (optional)
          <input
            type="number"
            value={form.managerId ?? ""}
            onChange={e => set("managerId", e.target.value === "" ? null : Number(e.target.value))}
            style={{width:"100%"}}
          />
        </label>
        <label>
          Last Lat (optional)
          <input
            type="number" step="any"
            value={form.lastLat ?? ""}
            onChange={e => set("lastLat", e.target.value === "" ? null : Number(e.target.value))}
            style={{width:"100%"}}
          />
        </label>
        <label>
          Last Lng (optional)
          <input
            type="number" step="any"
            value={form.lastLng ?? ""}
            onChange={e => set("lastLng", e.target.value === "" ? null : Number(e.target.value))}
            style={{width:"100%"}}
          />
        </label>
      </div>

      <div style={{display:"flex", gap:8, marginTop:12}}>
        <button type="submit" disabled={loading}>{loading ? "Creating..." : "Create"}</button>
        <button type="button" onClick={onCancel}>Cancel</button>
      </div>
    </form>
  );
}
