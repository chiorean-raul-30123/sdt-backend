import { useState } from "react";
import { createCustomer } from "../lib/customers";
import type { CustomerCreateDto } from "../types";

type Props = { onCreated?: () => void; onCancel?: () => void; };

export default function CreateCustomerForm({ onCreated, onCancel }: Props) {
  const [form, setForm] = useState<CustomerCreateDto>({ name: "", email: "", phone: "", address: "" });
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  function set<K extends keyof CustomerCreateDto>(k: K, v: CustomerCreateDto[K]) {
    setForm(s => ({ ...s, [k]: v }));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    if (!form.name.trim()) return setErr("Name is required");

    try {
      setLoading(true);
      await createCustomer({
        name: form.name,
        email: form.email || null,
        phone: form.phone || null,
        address: form.address || null,
      });
      onCreated?.();
    } catch (e: any) {
      setErr(e?.message || "Create failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={submit} noValidate style={{ border:"1px solid #ddd", padding:12, borderRadius:8 }}>
      <h3 style={{marginTop:0}}>New Customer</h3>
      {err && <p style={{color:"crimson"}}>{err}</p>}

      <label>
        Name
        <input value={form.name} onChange={e=>set("name", e.target.value)} required />
      </label>
      <label>
        Email
        <input value={form.email || ""} onChange={e=>set("email", e.target.value)} />
      </label>
      <label>
        Phone
        <input value={form.phone || ""} onChange={e=>set("phone", e.target.value)} />
      </label>
      <label>
        Address
        <input value={form.address || ""} onChange={e=>set("address", e.target.value)} />
      </label>

      <div style={{ display:"flex", gap:8, marginTop:12 }}>
        <button type="submit" disabled={loading}>{loading ? "Creating…" : "Create"}</button>
        <button type="button" onClick={onCancel}>Cancel</button>
      </div>
    </form>
  );
}
