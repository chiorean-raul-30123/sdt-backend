import { useEffect, useState, useCallback } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import {
  fetchCourier,
  fetchPackagesByCourier,
  deleteCourier,
  patchCourier,
} from "../lib/couriers";
import type { CourierDto, Page, PackageDto, CourierPatchDto } from "../types";
import CreatePackageForm from "../components/CreatePackageForm";

export default function CourierDetailsPage() {
  const { id } = useParams();
  const courierId = Number(id);
  const navigate = useNavigate();

  const [courier, setCourier] = useState<CourierDto | null>(null);
  const [pkgs, setPkgs] = useState<Page<PackageDto> | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [page, setPage] = useState(0);
  const size = 10;

  const [deleting, setDeleting] = useState(false);

  const [showCreatePkg, setShowCreatePkg] = useState(false);

  const [showEdit, setShowEdit] = useState(false);
  const [edit, setEdit] = useState<CourierPatchDto>({});
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  // ----- RELOAD: funcție unică ce reîncarcă curierul + pachetele
  const reload = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [c, p] = await Promise.all([
        fetchCourier(courierId),
        fetchPackagesByCourier(courierId, { page, size, sort: "assignedAt,desc" }),
      ]);
      setCourier(c);
      setPkgs(p);
    } catch (err: any) {
      setError(err?.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  }, [courierId, page]);

  // La mount / schimbare id / paginare -> reload
  useEffect(() => {
    if (!Number.isNaN(courierId)) reload();
  }, [reload]);

  // Sincronizează formularul de edit cu datele curente ale curierului
  useEffect(() => {
    if (courier) {
      setEdit({
        name: courier.name,
        email: courier.email,
        managerId: courier.managerId ?? null,
        lastLat: courier.lastLat ?? null,
        lastLng: courier.lastLng ?? null,
      });
    }
  }, [courier]);

  async function onSave() {
    setSaveError(null);
    setSaving(true);
    try {
      if (!courier) throw new Error("Courier not loaded");

      const candidate: CourierPatchDto = {
        name: edit.name?.trim() ?? undefined,
        email: edit.email?.trim() ?? undefined,
        managerId: edit.managerId ?? undefined,
        lastLat: edit.lastLat ?? undefined,
        lastLng: edit.lastLng ?? undefined,
      };

      const patch: CourierPatchDto = {};
      (["name", "email", "managerId", "lastLat", "lastLng"] as const).forEach((k) => {
        if ((candidate as any)[k] !== (courier as any)[k]) {
          (patch as any)[k] = (candidate as any)[k];
        }
      });

      const updated = await patchCourier(courierId, patch);
      setCourier(updated);
      setShowEdit(false);
      await reload();
    } catch (err: any) {
      console.error("PATCH failed:", err?.response?.data || err);
      setSaveError(err?.response?.data?.message || err?.message || "Save failed");
    } finally {
      setSaving(false);
    }
  }

  async function onDelete() {
    const ok = window.confirm(`Delete courier "${courier?.name}" (#${courierId})?`);
    if (!ok) return;
    try {
      setDeleting(true);
      await deleteCourier(courierId);
      navigate("/couriers");
    } catch (err: any) {
      alert(err?.response?.data?.message || "Delete failed. The courier might have packages assigned.");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <section>
      <p><Link to="/couriers">← Back to list</Link></p>
      <h2>Courier #{courierId}</h2>

      {error && <p style={{ color: "crimson" }}>Error: {error}</p>}
      {loading && <p>Loading…</p>}

      {courier && (
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ border: "1px solid #ddd", padding: 12, borderRadius: 8, marginBottom: 16, flex: 1 }}>
            <p><b>Name:</b> {courier.name}</p>
            <p><b>Email:</b> {courier.email}</p>
            <p><b>Manager:</b> {courier.managerId ?? "-"}</p>
            <p><b>Last Location:</b> {(courier.lastLat ?? "-")}/{(courier.lastLng ?? "-")}</p>
          </div>
          <div style={{ marginLeft: 12, display: "flex", gap: 8 }}>
            <button onClick={onDelete} disabled={deleting}>
              {deleting ? "Deleting..." : "Delete"}
            </button>
            <button onClick={() => setShowEdit((s) => !s)}>
              {showEdit ? "Close edit" : "Edit courier"}
            </button>
          </div>
        </div>
      )}

      {showEdit && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSave();
          }}
          style={{ border: "1px solid #ddd", padding: 12, borderRadius: 8, margin: "12px 0" }}
        >
          {saveError && <p style={{ color: "crimson" }}>{saveError}</p>}

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <label>
              Name
              <input
                value={edit.name ?? ""}
                onChange={(e) => setEdit((s) => ({ ...s, name: e.target.value }))}
                placeholder="Ex. Ion Curieru"
              />
            </label>

            <label>
              Email
              <input
                type="email"
                value={edit.email ?? ""}
                onChange={(e) => setEdit((s) => ({ ...s, email: e.target.value }))}
                placeholder="exemplu@firma.ro"
              />
            </label>

            <label>
              Manager ID
              <input
                type="number"
                value={edit.managerId ?? ""}
                onChange={(e) =>
                  setEdit((s) => ({
                    ...s,
                    managerId: e.target.value === "" ? undefined : Number(e.target.value),
                  }))
                }
              />
            </label>

            <label>
              Latitude
              <input
                type="number"
                step="any"
                value={edit.lastLat ?? ""}
                onChange={(e) =>
                  setEdit((s) => ({
                    ...s,
                    lastLat: e.target.value === "" ? undefined : Number(e.target.value),
                  }))
                }
                placeholder="ex. 46.77"
              />
            </label>

            <label>
              Longitude
              <input
                type="number"
                step="any"
                value={edit.lastLng ?? ""}
                onChange={(e) =>
                  setEdit((s) => ({
                    ...s,
                    lastLng: e.target.value === "" ? undefined : Number(e.target.value),
                  }))
                }
                placeholder="ex. 23.59"
              />
            </label>
          </div>

          <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
            <button type="submit" disabled={saving}>
              {saving ? "Saving…" : "Save changes"}
            </button>
            <button type="button" onClick={() => setShowEdit(false)}>
              Cancel
            </button>
          </div>
        </form>
      )}

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <h3 style={{ margin: 0 }}>Packages</h3>
        <button type="button" onClick={() => setShowCreatePkg((s) => !s)}>
          {showCreatePkg ? "Close" : "New Package"}
        </button>
      </div>

      {showCreatePkg && (
        <div style={{ marginBottom: 16 }}>
          <CreatePackageForm
            requiredCourierId={courierId}
            onCreated={async () => {
              setPage(0);
              await reload();
            }}
            onCancel={() => setShowCreatePkg(false)}
          />
        </div>
      )}

      {pkgs && (
        <>
          <table width="100%" cellPadding={8} style={{ borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#f4f4f4" }}>
                <th align="left">ID</th>
                <th align="left">Tracking</th>
                <th align="left">Status</th>
                <th align="left">Pickup</th>
                <th align="left">Delivery</th>
                <th align="left">Assigned</th>
                <th align="left">Delivered</th>
              </tr>
            </thead>
            <tbody>
              {pkgs.content.map((p) => (
                <tr key={p.id} style={{ borderTop: "1px solid #eee" }}>
                  <td>{p.id}</td>
                  <td>{p.trackingCode}</td>
                  <td>{p.status}</td>
                  <td>{p.pickupAddress}</td>
                  <td>{p.deliveryAddress}</td>
                  <td>{p.assignedAt ?? "-"}</td>
                  <td>{p.deliveredAt ?? "-"}</td>
                </tr>
              ))}
              {pkgs.content.length === 0 && (
                <tr>
                  <td colSpan={7} style={{ textAlign: "center", padding: 20 }}>
                    No packages.
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 12 }}>
            <button disabled={page === 0} onClick={() => setPage((p) => p - 1)}>
              Prev
            </button>
            <span>
              Page {pkgs.number + 1} / {pkgs.totalPages || 1} — {pkgs.totalElements} items
            </span>
            <button disabled={pkgs.number + 1 >= pkgs.totalPages} onClick={() => setPage((p) => p + 1)}>
              Next
            </button>
          </div>
        </>
      )}
    </section>
  );
}
