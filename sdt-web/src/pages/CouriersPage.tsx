import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import type { CourierDto, Page } from "../types";
import CreateCourierForm from "../components/CreateCourierForm";
import { fetchCouriers, deleteCourier } from "../lib/couriers";

type Params = { page: number; size: number; sort?: string };

export default function CouriersPage() {
  const [data, setData] = useState<Page<CourierDto> | null>(null);
  const [loading, setLoading] = useState(false);
  const [{ page, size, sort }, setParams] = useState<Params>({ page: 0, size: 10, sort: "name,asc" });
  const [error, setError] = useState<string | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchCouriers({ page, size, sort });
      setData(res);
    } catch (err: any) {
      setError(err?.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  }
async function onDelete(id: number, name: string) {
  const ok = window.confirm(`Delete courier "${name}" (#${id})?`);
  if (!ok) return;
  try {
    setDeletingId(id);
    await deleteCourier(id);
    await load(); // reîncarcă pagina curentă
  } catch (err: any) {
    alert(err?.response?.data?.message || "Delete failed. The courier might have packages assigned.");
  } finally {
    setDeletingId(null);
  }
}

  useEffect(() => { load(); }, [page, size, sort]);

  return (
    <section>
      <div style={{display:"flex", justifyContent:"space-between", alignItems:"center"}}>
        <h2 style={{marginBottom: 12}}>Couriers</h2>
        <button onClick={() => setShowCreate(s => !s)}>{showCreate ? "Close" : "New Courier"}</button>
      </div>

      {/* controls */}
      <div style={{display:"flex", gap:12, alignItems:"center", marginBottom:12}}>
        <label>
          Page size:&nbsp;
          <select value={size} onChange={e => setParams(s => ({ ...s, size: Number(e.target.value), page: 0 }))}>
            {[5,10,20,50].map(n => <option key={n} value={n}>{n}</option>)}
          </select>
        </label>
        <label>
          Sort:&nbsp;
          <select value={sort} onChange={e => setParams(s => ({ ...s, sort: e.target.value, page: 0 }))}>
            <option value="name,asc">name ↑</option>
            <option value="name,desc">name ↓</option>
            <option value="email,asc">email ↑</option>
            <option value="email,desc">email ↓</option>
          </select>
        </label>
      </div>

      {showCreate && (
        <CreateCourierForm
          onCreated={load}
          onCancel={() => setShowCreate(false)}
        />
      )}

      {loading && <p>Loading…</p>}
      {error && <p style={{color:"crimson"}}>Error: {error}</p>}

      {data && (
        <>
          <table width="100%" cellPadding={8} style={{borderCollapse:"collapse", marginTop: 12}}>
            <thead>
              <tr style={{background:"#f4f4f4"}}>
                <th align="left">ID</th>
                <th align="left">Name</th>
                <th align="left">Email</th>
                <th align="left">Manager</th>
                <th align="left">Last Location</th>
                <th align="left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.content.map(c => (
                <tr key={c.id} style={{borderTop:"1px solid #eee"}}>
                  <td>{c.id}</td>
                  <td>
                    {/* Link spre pagina de detalii */}
                    <Link to={`/couriers/${c.id}`}>{c.name}</Link>
                  </td>
                  <td>{c.email}</td>
                  <td>{c.managerId ?? "-"}</td>
                  <td>{(c.lastLat ?? "-")}/{(c.lastLng ?? "-")}</td>
                  <td>
                    <button
                      onClick={() => onDelete(c.id, c.name)}
                      disabled={deletingId === c.id}
                      title="Delete courier"
                    >
                      {deletingId === c.id ? "Deleting..." : "Delete"}
                    </button>
                  </td>
                </tr>
              ))}
              {data.content.length === 0 && (
                <tr><td colSpan={5} style={{textAlign:"center", padding:20}}>No couriers.</td></tr>
              )}
            </tbody>
          </table>

          <div style={{display:"flex", justifyContent:"space-between", marginTop:12}}>
            <button disabled={page===0} onClick={() => setParams(s => ({...s, page: s.page-1}))}>Prev</button>
            <span>Page {data.number + 1} / {data.totalPages || 1} — {data.totalElements} items</span>
            <button disabled={data.number + 1 >= data.totalPages} onClick={() => setParams(s => ({...s, page: s.page+1}))}>Next</button>
          </div>
        </>
      )}
    </section>
  );
}
